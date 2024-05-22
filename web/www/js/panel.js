types ={
1:'Conferencia' ,
2:'Seminario' ,
3:'Taller' ,
4: 'Videoconferencias recibidas' ,
5:'Congresos',
6:'Simposios',
7:'Mesas redondas',
8:'Cursos',
9:'Panel de expertos',
10:'Foro',
11:'Coloquio',
12:'Diplomado',
13:'Jornada',
14:'Exposiciones',
15:'Proyección de películas',
16:'Teatro y danza',
17:'Conciertos',
18:'Visitas guiadas',
19:'Festividades',
20:'Presentación de libros',
21:'Veladas literarias',
22:'Muestra gastronómica',
23:'Concursos',
24:'Lúdico-pedagógicas',
25:'Lúdico-deportivas',
26:'Certificaciones de español. Por selección'};
$.ajax({
    type: "GET",
    url: 'api/events?authkey='+getCookie('authkey'),
    processData: false,  // tell jQuery not to process the data
    contentType: false ,
    success: function (response) {
        events = response;
        drawEvents(events);
        
    },
    fail:function (response) {
        console.log(response);
    },
    dataType: 'json'
  });
  $('#formEventButton').click(function (event) {
    payload = new FormData(document.getElementById('formEvent'));
    id_event=payload.get('id');
    console.log(id_event);
    if(id_event==''){
        payload.delete('id')
        payload.set('sede',usr.id_sede)
        $.ajax({
        type: "POST",
        url: 'api/events?authkey='+getCookie('authkey'),
        data: payload,
        processData: false,  // tell jQuery not to process the data
        contentType: false ,
        success: function (response) {
            console.log(response);
            alert('Created successfully');
            events.push(response);
            drawEvents(events);
            var instance = M.Modal.getInstance(document.getElementById('modalAddEvent'));
            instance.close();
        },
        fail:function (response) {
            console.log(response);
            alert('Fail creating event: '+response);
        },
        dataType: 'json'
    });
    }else{
        payload.delete('id')
        var object = {};
        payload.forEach(function(value, key){
            if(key!=='picture')
                object[key] = value;
        });
        file = document.getElementById("picture").files[0];
        if (file !==undefined) {
            var filereader = new FileReader();
            filereader.readAsDataURL(file,object,id_event);
            filereader.onload = function (evt) {
               var base64 = evt.target.result;
               object.picture = base64;
               $.ajax({
                    type: "PUT",
                    url: 'api/events/'+id_event+'?authkey='+getCookie('authkey'),
                    data: JSON.stringify(object),
                    processData: false,  // tell jQuery not to process the data
                    contentType: false ,
                    success: function (response) {
                        console.log(response);
                        alert('Updated successfully');
                        i=events.findIndex(e => e.id === id_event);
                        
                        events[i].allday= payload.get('allday') ;
                        events[i].alter_at= payload.get('alter_at') ;
                        events[i]. alter_by= payload.get('alter_by') ;
                        events[i].datefrom= payload.get('datefrom') ;
                        events[i].dateto= payload.get('dateto') ;
                        events[i].title= payload.get('title') ;
                        events[i].type= payload.get('type') ;
                        events[i].url= payload.get('url') ;
                        drawEvents(events);
                        var instance = M.Modal.getInstance(document.getElementById('modalAddEvent'));
                        instance.close();
                    },
                    fail:function (response) {
                        console.log(response);
                        alert('Fail creating event: '+response);
                    },
                    dataType: 'json'
                });
            }
        }else{
            $.ajax({
                type: "PUT",
                url: 'api/events/'+id_event+'?authkey='+getCookie('authkey'),
                data: JSON.stringify(object),
                processData: false,  // tell jQuery not to process the data
                contentType: false ,
                success: function (response) {
                    console.log(response);
                    alert('Updated successfully');
                    i=events.findIndex(e => e.id === id_event);
                    
                    events[i].allday= payload.get('allday') ;
                    events[i].alter_at= payload.get('alter_at') ;
                    events[i]. alter_by= payload.get('alter_by') ;
                    events[i].datefrom= payload.get('datefrom') ;
                    events[i].dateto= payload.get('dateto') ;
                    events[i].title= payload.get('title') ;
                    events[i].type= payload.get('type') ;
                    events[i].url= payload.get('url') ;
                    drawEvents(events);
                    var instance = M.Modal.getInstance(document.getElementById('modalAddEvent'));
                    instance.close();
                },
                fail:function (response) {
                    console.log(response);
                    alert('Fail creating event: '+response);
                },
                dataType: 'json'
            });
        }
        
    }
  });
  function drawEvents(events) {
    tbody=document.getElementById('eventsList');
    tbody.innerHTML='';
    events.forEach(event => {
        const datefrom = moment.utc(event.datefrom, "YYYY-MM-DD HH:mm:ss");
        const dateto = moment.utc(event.dateto ,"YYYY-MM-DD HH:mm:ss");
        const formatedDateFrom= datefrom.toDate().getFullYear()+'-'+(datefrom.toDate().getMonth()+1).toString().padStart(2, '0')+'-'+datefrom.toDate().getDate().toString().padStart(2, '0');
        const formatedDateTo= dateto.toDate().getFullYear()+'-'+(dateto.toDate().getMonth()+1).toString().padStart(2, '0')+'-'+dateto.toDate().getDate().toString().padStart(2, '0');
        const formatHora1= datefrom.toDate().getHours()+':'+datefrom.toDate().getMinutes();
        const formatHora2= dateto.toDate().getHours()+':'+dateto.toDate().getMinutes();
        
        tr=document.createElement('tr'); tr.setAttribute('eventId',event.id);
       
        td_picture= document.createElement('td');
        td_picture_img= document.createElement('img');
        td_picture_img.src=event.picture;
        td_picture_img.classList.add('table-img');
        td_picture.append(td_picture_img);
        tr.append(td_picture);

        td_title= document.createElement('td');
        td_title.innerText=event.title; 
        tr.append(td_title);
        
        td_type= document.createElement('td');
        td_type.innerText=types[event.type]; 
        tr.append(td_type);
        
        td_allday= document.createElement('td');
        td_allday.innerText=event.allday==1?'YES':'NO'; 
        tr.append(td_allday);
        
        td_datefrom= document.createElement('td');
        td_datefrom.innerText=event.datefrom; 
        td_datefrom.classList.add('table-date'); 
        tr.append(td_datefrom);
        
        td_dateto= document.createElement('td');
        td_dateto.innerText=event.dateto;
        td_dateto.classList.add('table-date');  
        tr.append(td_dateto);
        
        td_url= document.createElement('td');
        a_url= document.createElement('a');
        a_url.innerText=event.url; 
        a_url.href=event.url;
        td_url.append(a_url);
        tr.append(td_url);
       
        td_edit= document.createElement('td');
        td_edit.classList.add('row');
        div_edit= document.createElement('div');div_edit.classList.add('col', 's6');
        a_edit= document.createElement('a');
        a_edit.classList.add('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'gold');
        i_edit =document.createElement('i');
        i_edit.classList.add('material-icons', 'left');
        i_edit.innerText='edit';
        a_edit.append(i_edit);
        div_edit.append(a_edit);
        
        div_delete= document.createElement('div');div_delete.classList.add('col', 's6');
        a_delete= document.createElement('a');
        a_delete.classList.add('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'red');
        i_delete =document.createElement('i');
        i_delete.classList.add('material-icons', 'left');
        i_delete.innerText='delete';
        a_delete.append(i_delete);
        div_delete.append(a_delete);


        td_edit.append(div_edit);
        td_edit.append(div_delete);
        //td_edit.innerHTML='<div><a class="btn-floating btn-small waves-effect waves-light gold"><i class="material-icons left">edit</i>button</a></div>'; 
        a_edit.addEventListener('click',function(e){
           $('#formEventButton').html('Edit');
           document.getElementById('formEvent').reset();
           
           id = document.getElementById('id_event');
           id.value= event.id;
           title = document.getElementById('title');
           title.value= event.title;
           sede = document.getElementById('sede');
           sede.value= event.sede;
           type = document.getElementById('type');
           type.value= event.type;
           datefromInput = document.getElementById('datefrom');
           datefromInput.value= formatedDateFrom;
           datefromPicket = M.Datepicker.getInstance(datefromInput);
           datefromPicket.setDate(datefrom.toDate());

           datetoInput = document.getElementById('dateto');
           datetoInput.value= formatedDateTo;
           datetoPicket = M.Datepicker.getInstance(datetoInput);
           datetoPicket.setDate(dateto.toDate());

           allday = document.getElementById('allday');
           if(event.allday==='1') 
               allday.setAttribute('checked','checked');
           else
               allday.removeAttribute('checked');
           Hora1 = document.getElementById('Hora1');
           Hora1.value= formatHora1;

           Hora2 = document.getElementById('Hora2');
           Hora2.value= formatHora2;

           url = document.getElementById('url');
           url.value= event.url;
           picture = document.getElementById('picture');
           // picture.value= event.picture;

           var instance = M.Modal.getInstance(document.getElementById('modalAddEvent'));
           instance.open();

        });

        a_delete.addEventListener('click',function(e){
           c = confirm('This action cannot be undone, are you shure to continue?');
           if(c)
               $.ajax({
                   type: "DELETE",
                   url: 'api/events/'+event.id+'?authkey='+getCookie('authkey'),
                   processData: false,  // tell jQuery not to process the data
                   contentType: false ,
                   success: function (response) {
                       console.log(response);
                       alert('Updated successfully');
                       i=events.findIndex(e => e.id === event.id);
                       events.splice(i, 1);
                       drawEvents(events);
                   },
                   fail:function (response) {
                       console.log(response);
                       alert('Fail creating event: '+response);
                   },
                   dataType: 'json'
               });
               else
                   return;
           });
           
        

        tr.append(td_edit);

        tbody.append(tr);
       });
          $('.tooltipped').tooltip();
    
  }