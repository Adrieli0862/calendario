/* CREATE TABLE dls_tSedes(
    id varchar(16),
    nombre varchar(250),
    zona_horaria varchar(10),
    PRIMARY KEY(id)
);
*/
/* Ejemplo de como  insertar datos
INSERT INTO dls_tSedes values 
('18a4f115ca2d2e','San Antonio','GTM-5'),
('18a4f11d9168a6','Canadá','GTM-5'),
('18a4f11fe72b36','Chicago','GTM-5'),
('18a4f121b8314e','Los Ángeles','GTM-5'),
('18a4f1239f3b56','China','GTM-5'),
('18a4f1256916aa','España','GTM-5'),
('18a4f1273cfdde','Costa Rica','GTM-5'),
('18a4f1290f2b46','Francia','GTM-5'),
('18a4f12b7343c2','Reino Unido','GTM-5'),
('18a4f12d4fcf12','Tucson','GTM-5'),
('18a4f12fd374e6','Alemania','GTM-5'),
('18a4f1319bf816','Boston','GTM-5'),
('18a4f134ac49a2','Sudáfrica','GTM-5')
;
*/

 Ejemplo  usuarios 
CREATE TABLE dls_tusers (
    id varchar(16)
    ,name varchar(64)
    ,usr varchar(64)
    ,clave varchar(64)
    ,grupo varchar(64)
    ,sem varchar(64)
    ,password varchar(256)
    ,PRIMARY KEY (id)



);

d,name,usr,status,grup,sem,clave,password,id_sede)


Copiar código
-- Tabla usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    tipo ENUM('alumno', 'maestro') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla alumnos
CREATE TABLE alumnos (
    id INT PRIMARY KEY,
    matricula VARCHAR(50) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    semestre VARCHAR(50) NOT NULL,
    FOREIGN KEY (id) REFERENCES usuarios(id)
);

-- Tabla maestros
CREATE TABLE maestros (
    id INT PRIMARY KEY,
    departamento VARCHAR(100),
    FOREIGN KEY (id) REFERENCES usuarios(id)
);

-- Tabla: materias
CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    horario VARCHAR(50) NOT NULL
);

-- Tabla: grupos
CREATE TABLE grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_materia INT NOT NULL,
    id_profesor INT NOT NULL,
    id_alumno INT NOT NULL,
    FOREIGN KEY (id_materia) REFERENCES materias(id),
    FOREIGN KEY (id_profesor) REFERENCES profesores(id),
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id)
);

-- Tabla: examen_fisico
CREATE TABLE examen_fisico (
    resena VARCHAR(50), 
    hisclinica VARCHAR(50),
    anamnesis VARCHAR (50)
    em VARCHAR(50),
    tlic VARCHAR(50),
    ln VARCHAR(50),
    pulso VARCHAR(50),
    peso VARCHAR(50),
    dh VARCHAR(50),
    pp VARCHAR(50),
    fr VARCHAR(50),
    cc VARCHAR(50),
    rt VARCHAR(50),
    pa VARCHAR(50),
    cp VARCHAR(50),
    rd VARCHAR(50),
    fc VARCHAR(50),
    apariencia VARCHAR(50),
    color VARCHAR(50),
    densidad VARCHAR(50),
    examen_quimico VARCHAR(50),
    ph VARCHAR(50),
    proteinas VARCHAR(50),
    glucosa VARCHAR(50),
    cetonas VARCHAR(50),
    bilirrubina VARCHAR(50)
);