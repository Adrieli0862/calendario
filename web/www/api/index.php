<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
//ini_set('display_errors', 'on');
require_once('../../../lib/settings.inic.php');
# Zona horaria default
date_default_timezone_set('America/Mexico_City');
//incluye las librerias

require_once("../../../lib/rest.inic.php");
//carga librerias externas



//define la clase
class API extends REST
{
	//constructor
	public function __construct()
	{
		parent::__construct(); // Init parent contructor
	}
	public function processApi(){
		$request = (isset($_GET["api_uri_r"])) ? $_GET["api_uri_r"] : null;
		$request_parts = array_diff(explode("/", rtrim($request, "/")), array(''));
		$entry_point = (sizeof($request_parts) > 0) ? $request_parts[0] : null;
		if ((int)method_exists($this, $entry_point) > 0)
			$this->$entry_point($request_parts);
		else
			$this->response('{"meta":{"code":404},"response":{"msg":"' . $request . ' not found"}}', 404);
	}
	public function test(){
		$this->response('{"hello":"world"}', 200);
	}
	public function fulltest(){
		if (!file_exists('../data')) mkdir('../data');
		$test = [];
		$test['users'] = false;
		if (!file_exists('../data/users')) mkdir('../data/users');
		else $test['users'] = true;
		$test['files'] = false;
		if (!file_exists('../data/files')) mkdir('../data/files');
		else $test['files'] = true;
		$test['rsa'] = false;
		if ($this->decrypt($this->encrypt('hola')) == 'hola') $test['rsa'] = true;
		
		$this->response(json_encode($test), 200);
	}
	//public methods
	public function auth($request_parts){
		switch ($this->get_request_method()) {
			case "GET":
				$s = explode("|", $this->decrypt($_GET["s"]));
				$qry = "SELECT   usr, id as pubkey,password, status, id_sede FROM dls_tUsers WHERE status=1 AND usr='" . $this->sanitize($s[0]) ."'";
				$r = $this->getDB($qry);
				if (sizeof($r) == 0) $this->response($qry, 401);
				if(($this->decrypt($r[0]['password']!==$s[1]))) $this->response('bad password '.$s[1].'-'.$this->decrypt($r[0]['password']), 401);
				//crea llave de sesion
				$authkey = $this->snowflake(36);
				$r[0]['password']='';
				$r[0]["authkey"] = $authkey;
				file_put_contents('../data/users/' . $authkey . '.json', '{"user":' . json_encode($r[0]) . '}');
				$this->response('{"authkey":"' . $authkey . '"}', 200);
			case "DELETE":
				$authkey = $this->_request["authkey"];
				if (file_exists('../data/users/' . $authkey . ".json")) {
					unlink('../data/users/' . $authkey . ".json");
					$this->response('{"delete":true}', 200);
				}
				break;
			case "PUT":
				$income = json_decode(file_get_contents('php://input'));
				$qry = "SELECT organization_id, usr, id as pubkey, status FROM dls_tUsers WHERE status>-1 AND usr='" . $usr . "';";
				$r = $this->getDB($qry);
				if (sizeof($r) == 0) $this->response(null, 401);
				//crea llave de sesion
				$authkey = $this->snowflake(36);
				$r[0]["authkey"] = $authkey;
				file_put_contents('../data/users/' . $authkey . '.json', '{"user":' . json_encode($r[0]) . '}');
				$this->response('{"authkey":"' . $authkey . '"}', 200);
				break;
			default:
				$this->response(null, 405);
		}
	}

	public function events($request_parts){
		if($this->get_request_method()!='GET'){
			if(!isset($_GET['authkey'])) $this->response(null,401);
			if (file_exists($fn='../data/users/'.$_GET['authkey'].'.json'))
				if($fgc=file_get_contents($fn))
					$me=json_decode($fgc)->user;
			if(!$me) $this->response(null,401);
		}
		switch ($this->get_request_method()) {
			
			
			/*     */
			case "GET":
				$qry = "SELECT * FROM dls_tEvents order by datefrom";
				$r = $this->getDB($qry);
				if($r!==null)
					$this->response(json_encode($r),200);
				else
					$this->response($qry,400);
			break;
			case "POST":
				$id= $this->snowflake(16);
				if(isset($_POST['title'])) $title = $this->_request['title']; else $this->response("missing title",400);
				if(isset($_POST['sede'])) $sede = $this->_request['sede']; else $this->response("missing sede",400);
				if(isset($_POST['type'])) $type = $this->_request['type']; else $this->response("missing type",400);
				if(isset($_POST['allday'])) $allday = $this->_request['allday']; $allday=0;
				if(isset($_POST['datefrom'])) $datefrom = $this->_request['datefrom']; else $this->response("missing dateFrom",400);
				if(isset($_POST['dateto'])&&$_POST['dateto']!='') $dateto = $this->_request['dateto']; else $dateto =$datefrom;
				if ($allday !=1){
					if(isset($_POST['Hora1'])) $Hora1 = $this->_request['Hora1']; else $this->response("missing Hora1",400);
					if(isset($_POST['Hora2'])) $Hora2 = $this->_request['Hora2']; else $this->response("missing Hora2",400);
				}else{
					$Hora1 =null;
					$Hora2 = null;
				}
				if($allday !=1){
					$datefrom.=" ".$Hora1.":00";
					$dateto.=" ".$Hora2.":00";
				}
				if(isset($_POST['url'])) $url = $this->_request['url']; else $this->response("missing url",400);
				if(!isset($_FILES['picture']))  $this->response("missing picture",400);
				$name = $_FILES['picture']['name'];
				$target_dir = "../data/img/";
				if(!file_exists($target_dir)){
					mkdir($target_dir,0755,true);
				}
				$target_file = $target_dir . $id.basename($_FILES["picture"]["name"]);

				// Select file type
				$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
				$target_file=$id.'.'.$imageFileType;
				// Valid file extensions
				$extensions_arr = array("jpg","jpeg","png","gif");

				$picture=$target_dir.$target_file;
				// Check extension
				if( in_array($imageFileType,$extensions_arr) ){
					// Upload file
					if(!move_uploaded_file($_FILES['picture']['tmp_name'],$picture)){
						$this->response('error saving file',500);
					}

				}
				$created_at = date('Y-m-d H:s:i');
				$alter_at = date('Y-m-d H:s:i');
				$alter_by = $me->pubkey;
				$array = ["id" => $id,"title" => $title,"sede" => $sede,"type" => $type,"allday" => $allday,"datefrom" => $datefrom,"dateto" => $dateto,"url" => $url,"picture" => $picture,"created_at" => $created_at,"alter_at" => $alter_at,"alter_by" => $alter_by];
				$qry = "INSERT INTO dls_tEvents VALUES (";
				$qryValues =[];
				foreach ($array as $key => $value) {
					if(is_numeric($value))
						$qryValues[]=$value;
					else
						$qryValues[]="'".$this->sanitize($value)."'";
				}
				$qry.=implode(" , ",$qryValues);
				$qry.=")";
				$r = $this->setDB($qry);
				if ($r)
					$this->response(json_encode($array),200);
				else
					$this->response($qry,400);
			break;
			case "PUT":
				$id=$request_parts[1];
				$payload= json_decode(file_get_contents('php://input'));
				if(isset($payload->title)) $title = $payload->title; else $this->response("missing title",400);
				if(isset($payload->type)) $type = $payload->type; else $this->response("missing type",400);
				if(isset($payload->allday)) $allday = 1; else $allday=0;
				if(isset($payload->datefrom)) $datefrom = $payload->datefrom; else $this->response("missing dateFrom",400);
				if(isset($payload->dateto)&&$payload->dateto!='') $dateto = $payload->dateto; else $dateto = null;
				if ($allday !=1){
					if(isset($payload->Hora1)) $Hora1 = $payload->Hora1; else $Hora1 = null;
					if(isset($payload->Hora2)) $Hora2 = $payload->Hora2; else $Hora2 = null;
				}else{
					$Hora1 =null;
					$Hora2 = null;
				}
				if($allday !=1){
					$datefrom.=" ".$Hora1.":00";
					$dateto.=" ".$Hora2.":00";
				}
				if(isset($payload->url)) $url = $payload->url; else $payload->url= null;
				if(!isset($payload->picture)||$payload->picture =='') {
					$picture = null;
				}else{
					$target_dir = "../data/img/";
					if (preg_match('/^data:image\/(\w+);base64,/', $payload->picture, $t)) {
						$data = substr($payload->picture, strpos($payload->picture, ',') + 1);
						$t = strtolower($t[1]); // jpg, png, gif
					
						if (!in_array($t, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
							throw new \Exception('invalid image type');
						}
						$data = str_replace( ' ', '+', $data );
						$data = base64_decode($data);
					
						if ($data === false) {
							throw new \Exception('base64_decode failed');
						}
					} else {
						throw new \Exception('did not match data URI with image data');
					}
					if(!file_exists($target_dir)){
						mkdir($target_dir,0755,true);
					}
					if(file_exists("{$target_dir}{$id}}.*")){
						unlink("{$target_dir}{$id}}.*");
					}
					file_put_contents("{$target_dir}{$id}.{$t}", $data);
					$picture="{$target_dir}{$id}.{$t}";
				}
				$alter_at = date('Y-m-d H:s:i');
				$alter_by = $me->pubkey;
				$array = ["title" => $title,"type" => $type,"allday" => $allday,"datefrom" => $datefrom,"dateto" => $dateto,"url" => $url,"alter_at" => $alter_at,"alter_by" => $alter_by];
				if($picture)
					$array["picture"]=$picture;
				$qry = "UPDATE  dls_tEvents SET ";
				$qryValues =[];
				foreach ($array as $key => $value) {
					if($value==null)
						$qryValues[]=$key.' = NULL';
					else{
						if(is_numeric($value))
							$qryValues[]=$key.' = '.$value;
						else
							$qryValues[]=$key.' = '."'".$this->sanitize($value)."'";
					}
				}
				$qry.=implode(" , ",$qryValues);
				$qry.="WHERE id = '".$this->sanitize($id)."'";
				$r = $this->setDB($qry);
				if ($r)
					$this->response(json_encode($array),200);
				else
					$this->response($qry,400);
			break;
			case "DELETE":
				$id=$request_parts[1];
				if(!$id) $this->response(null,400);
				$qry = "DELETE FROM dls_tEvents WHERE id = '".$this->sanitize($id)."'";
				$r = $this->setDB($qry);
				if ($r)
					$this->response(($r),200);
				else
					$this->response($qry,400);
			break;
			default:
				$this->response(null,403);
			break;
		}
	}

	public function users($request_parts){
		if(!isset($_GET['authkey'])) $this->response(null,401);
		if (file_exists($fn='../data/users/'.$_GET['authkey'].'.json'))
			if($fgc=file_get_contents($fn))
				$me=json_decode($fgc)->user;
		if(!$me) $this->response(null,401);
		switch ($this->get_request_method()) {
			case "GET":
				if(in_array($me->pubkey,SUPER_USERS))
					$qry="select id, name, usr, status, id_sede from dls_tUsers";
				else
					$qry="select id, name, usr, status, id_sede from dls_tUsers WHERE status = 0 AND id_sede = '".$this->sanitize($me->id_sede)."'";
				$this->response(json_encode($this->getDB($qry)),200);
			break;
			case "PUT":
				$id=$request_parts[1];
				$income = json_decode(file_get_contents('php://input'));
				$qry = "UPDATE  dls_tUsers SET ";
				$qryValues =[];
				foreach ($income as $key => $value) {
					if($value==null)
						$qryValues[]=$key.' = NULL';
					else{
						if(is_numeric($value))
							$qryValues[]=$key.' = '.$value;
						else
							$qryValues[]=$key.' = '."'".$this->sanitize($value)."'";
					}
				}
				$qry.=implode(" , ",$qryValues);
				$qry.=" WHERE id = '".$this->sanitize($id)."'";
				$r = $this->setDB($qry);
				if ($r)
					$this->response(json_encode($r),200);
				else
					$this->response($qry,400);

			break;
			case "DELETE":
				$id=$request_parts[1];
				$response = $this->setDB("UPDATE  dls_tUsers SET status = -1 WHERE id = '".$this->sanitize($id)."'");
				$this->response(json_encode($response),200);
			break;
		}
		
		
	}

	/// Aqui se envian datos/////
	public function oportunities($request_parts){
		if (!$pubkey = $this->isauth(isset($_GET["authkey"]) ? $_GET["authkey"] : null))
			if ($this->get_request_method() != 'POST') $this->response(null, 401);
		$outcome = [];
		switch ($this->get_request_method()) {
			case "POST":
				if (isset($_POST["n"])) $n = $this->_request["n"];
				else $this->response('n', 400);
				if (isset($_POST["s"])) $s = $this->_request["s"];
				else $this->response('s', 400);
				if (isset($_POST["e"])) $e = $this->_request["e"];
				else $this->response('e', 400);
				if (isset($_POST["f"])) $f = $this->_request["f"];
				else $this->response('f', 400);
				if (isset($_POST["g"])) $g = $this->_request["g"];
				else $this->response('g', 400);
				if (isset($_POST["p1"])) $p1 = $this->_request["p1"];
				else $this->response('p1', 400);
				if (isset($_POST["p2"])) $p2 = $this->_request["p2"];
				else $this->response('p2', 400);
				if ($p1!=$p2) $this->response('p1,p2', 400);
				$r0 = $this->getDB("SELECT * FROM dls_tUsers WHERE usr='" . $this->sanitize($e) . "'");
				if (sizeof($r0) > 0) $this->response('E', 400);
				$iu = $this->snowflake();
				#id	name	usr	clave	grupo	sem	password
				$qry = "INSERT INTO dls_tUsers (id,name,usr,clave,grupo,sem,password) VALUES 
				('" . $iu . "','" . $this->sanitize($n) . "','" . $this->sanitize($e) . "' , '".$this->sanitize($f)."' , '".$this->sanitize($g).
				"','".$this->encrypt($this->sanitize($p1))."','".$this->sanitize($s)."')";
				$r2 = $this->setDB($qry);
				if ($r2) $outcome['id'] = $iu;
				else $this->response($qry, 400);
				break;
			default:
				$this->response(null, 405);
		}
		$this->response(json_encode($outcome), 200);
	}
	public function pubkey(){
		$this->response(PUBRSA, 200);
	}
	public function testKey(){
		$this->response($this->snowflake(16),200);
	}
	public function sedes($request_parts){
		switch ($this->get_request_method()) {
			case "GET":
				$qry = "SELECT * FROM dls_tSedes";
				$r = $this->getDB($qry);
				$this->response(json_encode($r),200);
			break;
			case "POST":
				if(!isset($_GET['authkey'])) $this->response(null,401);
				if (file_exists($fn='../data/users/'.$_GET['authkey'].'.json'))
					if($fgc=file_get_contents($fn))
						$me=json_decode($fgc)->user;
				if(!$me) $this->response(null,401);
				$id= $this->snowflake(16);
				if(isset($_POST['nombre'])) $nombre = $this->_request['nombre']; else $this->response("missing nombre",400);
				if(isset($_POST['zona_horaria'])) $zona_horaria = $this->_request['zona_horaria']; else $this->response("missing zona_horaria",400);
				$qry = "INSERT INTO dls_tSedes (id,nombre,zona_horaria) VALUES ('" . $id . "','" . $this->sanitize($nombre) . "','" . $this->sanitize($zona_horaria) . "')";
				$r = $this->setDB($qry);
				if($r)
					$this->response(json_encode(array("id"=>$id,"nombre"=>$nombre,"zona_horaria"=>$zona_horaria)),200);
				else
					$this->response(json_encode(array("code"=>400,"msg"=>"error on insert db")),400);
			break;
			default:
				$this->response(null,403);
			break;
		}
	}

	//private methods
	
	private function decrypt($s){
		$res = openssl_get_privatekey(PVTRSA);
		openssl_private_decrypt(base64_decode($s), $decrypttext, $res);
		return $decrypttext;
	}
	private function encrypt($s){
		$pub_key = openssl_get_publickey(PUBRSA);
		openssl_public_encrypt($s, $crypttext, $pub_key);
		return base64_encode($crypttext);
	}
	private function getDB($qry){
		//connects to database
		$conn = new mysqli(DBSERVER, DBUSER, DBPASSWD, DBCATALOG, DBPORT);
		if ($conn->connect_errno) $this->response('', 400);
		mysqli_set_charset($conn, "utf8");
		//runs query
		if ($resultado = $conn->query($qry)) {
			$myArray = array();
			while ($fila = $resultado->fetch_assoc())
				$myArray[] = $fila;
			$resultado->close();
		} else
			$myArray = null;
		//closes conection
		mysqli_close($conn);
		//returns data
		return $myArray;
	}

	private function getUrl($u = null, $h = null, $b = null, $v = 'GET'){
		if ($u == null) return array('response' => null, 'code' => 0);
		//call external url
		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_URL => $u,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 0,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => $v,
			CURLOPT_HTTPHEADER => ($h) ? $h : [],
		));
		if ($b) {
			curl_setopt($curl, CURLOPT_POST, 1);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $b);
		}
		$response = curl_exec($curl);
		$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);
		//write log
		file_put_contents(CRON_LOG.'/request' . date('Ymd') . '.log', date('Y-m-d H:i:s') . "," . $httpcode . "," . str_replace("https://", "", $u) . "\n", FILE_APPEND | LOCK_EX);
		return array('response' => $response, 'code' => $httpcode);
	}
	private function HMACSHA256($key, $string_to_sign){
		return (hash_hmac("sha256", $string_to_sign, $key, true));
	}
	private function isauth($authkey){
		if ($authkey == null) return null;
		if (!$fgc = file_get_contents('../data/users/' . $authkey . '.json'))
			return null;
		else {
			$u = json_decode($fgc, true);
			return $u["user"]["pubkey"];
		}
	}
	private function kerberos() {
		$outcome=["meta"=>["code"=>401],"response"=>["msg"=>"Unauthorized"]];
		if (isset($_GET["authkey"])) {
			$authkey=$_GET["authkey"];
			if (file_exists($fn='../data/users/'.$authkey.'.json'))
				if($fgc=file_get_contents($fn))
					$outcome=json_decode($fgc)->user;
		}			
		return $outcome;
	}
	
	private function sanitize($txt){
		$txt = str_replace("\'", "'", $txt);
		$txt = str_replace("'", "''", $txt);
		if (substr($txt, -1) == '\\') $txt .= ' ';
		return str_replace('\x', 'u', $txt);
	}
	private function setDB($qry){
		//conecta con la base de datos
		$conn = new mysqli(DBSERVER, DBUSER, DBPASSWD, DBCATALOG, DBPORT);
		if ($conn->connect_errno) $this->response('', 400);
		mysqli_set_charset($conn, "utf8");
		//ejecuta la consulta
		$res = $conn->query($qry);
		if ($conn->error) {
			try {
				throw new Exception("MySQL error $conn->error", $conn->errno);
			} catch (Exception $e) {
				file_put_contents('../data/files/q' . date('Ymd') . '.log', "\n#" . date('Y-m-d H:i:s') . "\n#ERROR" . $e->getCode() . " " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n" . $qry, FILE_APPEND | LOCK_EX);
				var_dump($e->getMessage() . "\n" . explode("\n", $e->getTraceAsString())[0]);
			}
			return false;
		}
		$r = $conn->affected_rows;
		//cierra la conexion
		mysqli_close($conn);
		return $r;
	}
	
	private function snowflake($b = 36){
		$d = round(microtime(true) * 1000);
		if (extension_loaded('apc') && ini_get('apc.enabled')) {
			if (apc_exists($d))
				apc_inc($d);
			else
				apc_store($d, 1);
			$r = apc_fetch($d);
		} else {
			$r = rand(1, 4095); //strlen(file_get_contents($fp));
		}
		if (PHP_INT_MAX == 2147483647) {
			$x = bcadd(bcmul($d, 4194304), (1 * 4096) + $r);
		} else {
			$x = ($d * 4194304) + (1 * 4096) + $r;
		}
		error_reporting(E_ALL ^ E_DEPRECATED);
		$r=base_convert($x, 10, $b);
		error_reporting(E_ALL);
		return $r;
	}
}
//inicializa la libreria
$api = new API;
$api->processApi();