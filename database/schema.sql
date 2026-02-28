-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gymentality;
USE gymentality;

--------------------------------------------------
-- Tabla: usuario
-- Almacena los datos básicos de todos los usuarios
--------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATE,
    estado_cuenta VARCHAR(20) DEFAULT 'activo'
);

--------------------------------------------------
-- Tabla: club
-- Almacena los datos de los clubs/gimnasios
--------------------------------------------------
CREATE TABLE IF NOT EXISTS club (
    id_club INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    ciudad VARCHAR(50),
    codigo_postal VARCHAR(10),
    telefono VARCHAR(20),
    email VARCHAR(100)
);

--------------------------------------------------
-- Tabla: socio
-- Datos específicos de los socios
--------------------------------------------------
CREATE TABLE IF NOT EXISTS socio (
    id_usuario INT PRIMARY KEY,
    fecha_alta DATE,
    puntos_acumulados INT DEFAULT 0,
    estado_suscripcion VARCHAR(20) DEFAULT 'activa',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: admin
-- Datos específicos de administradores
--------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
    id_usuario INT PRIMARY KEY,
    tipo_admin ENUM('Global','Local') NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: monitor
-- Almacena los monitores que imparten clases
--------------------------------------------------
CREATE TABLE IF NOT EXISTS monitor (
    id_monitor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50),
    especialidad VARCHAR(50)
);

--------------------------------------------------
-- Tabla: inscripcion
-- Vincula usuarios con clubs
--------------------------------------------------
CREATE TABLE IF NOT EXISTS inscripcion (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_club INT NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(20),
    metodo_pago VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_club) REFERENCES club(id_club) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: cuota
-- Cuotas asociadas a cada inscripción
--------------------------------------------------
CREATE TABLE IF NOT EXISTS cuota (
    id_cuota INT AUTO_INCREMENT PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    nombre VARCHAR(50),
    precio DECIMAL(10,2),
    duracion VARCHAR(20),
    FOREIGN KEY (id_inscripcion) REFERENCES inscripcion(id_inscripcion) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: plan_entrenamiento
-- Planes personalizados por inscripción
--------------------------------------------------
CREATE TABLE IF NOT EXISTS plan_entrenamiento (
    id_plan INT AUTO_INCREMENT PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    tipo_plan VARCHAR(50),
    precio_extra DECIMAL(10,2),
    FOREIGN KEY (id_inscripcion) REFERENCES inscripcion(id_inscripcion) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: pago
-- Registra los pagos asociados a una inscripción
--------------------------------------------------
CREATE TABLE IF NOT EXISTS pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    fecha_pago DATE,
    monto DECIMAL(10,2),
    metodo VARCHAR(50),
    estado VARCHAR(20),
    FOREIGN KEY (id_inscripcion) REFERENCES inscripcion(id_inscripcion) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: canjear
-- Canjes de puntos de los usuarios
--------------------------------------------------
CREATE TABLE IF NOT EXISTS canjear (
    id_canjear INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATE,
    puntos_usados INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: recompensa
-- Recompensas obtenidas por canjes
--------------------------------------------------
CREATE TABLE IF NOT EXISTS recompensa (
    id_recompensa INT AUTO_INCREMENT PRIMARY KEY,
    id_canjear INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puntos_necesarios INT NOT NULL,
    FOREIGN KEY (id_canjear) REFERENCES canjear(id_canjear) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: notificacion
-- Notificaciones enviadas a usuarios
--------------------------------------------------
CREATE TABLE IF NOT EXISTS notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT,
    fecha_envio DATE,
    tipo VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: instalaciones_club
-- Instalaciones disponibles en cada club
--------------------------------------------------
CREATE TABLE IF NOT EXISTS instalaciones_club (
    id_instalaciones INT AUTO_INCREMENT PRIMARY KEY,
    id_club INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_club) REFERENCES club(id_club) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: clase
-- Clases impartidas en los clubs
--------------------------------------------------
CREATE TABLE IF NOT EXISTS clase (
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    horario TIME NOT NULL,
    id_monitor INT,
    id_club INT NOT NULL,
    FOREIGN KEY (id_monitor) REFERENCES monitor(id_monitor) ON DELETE SET NULL,
    FOREIGN KEY (id_club) REFERENCES club(id_club) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: reserva_clase
-- Relaciona usuarios con clases reservadas
--------------------------------------------------
CREATE TABLE IF NOT EXISTS reserva_clase (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_clase INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_clase) REFERENCES clase(id_clase) ON DELETE CASCADE
);

--------------------------------------------------
-- Tabla: valoracion_club
-- Valoraciones de usuarios sobre clubs
--------------------------------------------------
CREATE TABLE IF NOT EXISTS valoracion_club (
    id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_club INT NOT NULL,
    puntuacion INT,
    comentario TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_club) REFERENCES club(id_club) ON DELETE CASCADE
);
