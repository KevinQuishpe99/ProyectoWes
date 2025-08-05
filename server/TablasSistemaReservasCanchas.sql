-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS gestion_canchas_epn;

-- Crear la base de datos
CREATE DATABASE gestion_canchas_epn;

-- Conectarse a la base de datos
-- \c gestion_canchas_epn

-- 1. Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO roles (nombre) VALUES
('admin'),
('organizador'),
('usuario');

-- 2. Tabla de tipos de espacio
CREATE TABLE tipos_espacio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    imagen BYTEA
);

INSERT INTO tipos_espacio (nombre, descripcion, imagen) VALUES
('Fútbol', 'Espacio para fútbol', NULL),
('Básquet', 'Espacio para básquet', NULL),
('Voleibol', 'Espacio para voleibol', NULL),
('Fútbol Sala', 'Espacio para fútbol sala', NULL);

-- 3. Tabla de estados de cancha
CREATE TABLE estados_cancha (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO estados_cancha (nombre) VALUES
('disponible'),
('no disponible');

-- 4. Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    codigo VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO usuarios (nombres, correo, contrasena, rol_id, codigo) VALUES
('Administrador', 'admin@epn.edu.ec', 'admin123', 1, '2020557'),
('Organizador EPN', 'organizador@epn.edu.ec', 'organizador123', 2, '2020556'),
('Estudiante EPN', 'estudiante@epn.edu.ec', 'estudiante123', 3, '2020667');

-- 5. Tabla de canchas
CREATE TABLE canchas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    capacidad INTEGER NOT NULL,
    tipo_espacio_id INTEGER NOT NULL REFERENCES tipos_espacio(id),
    ubicacion_referencia VARCHAR(100),
    descripcion TEXT,
    imagen BYTEA,
    estado_id INTEGER NOT NULL REFERENCES estados_cancha(id)
);

INSERT INTO canchas (nombre, capacidad, tipo_espacio_id, ubicacion_referencia, descripcion, imagen, estado_id) VALUES
('Cancha Fútbol 1', 22, 1, 'Zona Norte', 'Cancha de césped sintético', NULL, 1),
('Cancha Básquet 1', 10, 2, 'Zona Sur', 'Cancha techada', NULL, 1),
('Cancha Voleibol 1', 12, 3, 'Zona Centro', 'Cancha de arena', NULL, 2);

-- 6. Tabla de reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    cancha_id INTEGER NOT NULL REFERENCES canchas(id),
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'reservada' CHECK (estado IN ('reservada', 'cancelada'))
);

INSERT INTO reservas (usuario_id, cancha_id, fecha, hora_inicio, hora_fin, estado) VALUES
(3, 1, '2024-06-10', '10:00', '11:00', 'reservada'),
(3, 2, '2024-06-11', '12:00', '13:00', 'cancelada');

-- 7. Tabla de eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    cancha_id INTEGER NOT NULL REFERENCES canchas(id),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('agendado', 'en proceso', 'finalizado'))
);

INSERT INTO eventos (cancha_id, nombre, tipo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin, estado) VALUES
(1, 'Torneo Relámpago', 'Torneo', 'Torneo de fútbol rápido', '2024-06-15', '2024-06-15', '09:00', '13:00', 'agendado'),
(2, 'Mantenimiento Básquet', 'Mantenimiento', 'Reparación de tableros', '2024-06-12', '2024-06-13', '08:00', '12:00', 'en proceso');

-- 8. Tabla de feedback
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    cancha_id INTEGER NOT NULL REFERENCES canchas(id),
    comentario TEXT,
    calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
    respuesta TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO feedback (usuario_id, cancha_id, comentario, calificacion, respuesta) VALUES
(3, 1, 'Excelente cancha, muy buen estado.', 5, NULL),
(3, 2, 'Faltan balones disponibles.', 3, 'Gracias por tu comentario. Estamos trabajando para mejorar el equipamiento disponible.');
