// Importación de todos los modelos de la aplicación
import Rol from './rol.js';
import Usuario from './usuario.js';
import TipoEspacio from './tipoEspacio.js';
import Cancha from './cancha.js';
import Reserva from './reserva.js';
import Evento from './evento.js';
import Feedback from './feedback.js';
import EstadoCancha from './estadoCancha.js';

// ASOCIACIONES CENTRALIZADAS - Definición de relaciones entre modelos
// Estas asociaciones definen cómo se relacionan las tablas en la base de datos

// Asociación Usuario - Rol (Muchos a Uno)
// Un usuario pertenece a un rol, un rol puede tener muchos usuarios
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' }); // Usuario pertenece a un Rol
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' }); // Rol tiene muchos Usuarios

// Asociación Cancha - TipoEspacio (Muchos a Uno)
// Una cancha pertenece a un tipo de espacio, un tipo de espacio puede tener muchas canchas
Cancha.belongsTo(TipoEspacio, { foreignKey: 'tipo_espacio_id', as: 'tipoEspacio' }); // Cancha pertenece a un TipoEspacio
TipoEspacio.hasMany(Cancha, { foreignKey: 'tipo_espacio_id', as: 'canchas' }); // TipoEspacio tiene muchas Canchas

// Asociación Cancha - EstadoCancha (Muchos a Uno)
// Una cancha tiene un estado, un estado puede tener muchas canchas
Cancha.belongsTo(EstadoCancha, { foreignKey: 'estado_id', as: 'estadoCancha' }); // Cancha pertenece a un EstadoCancha
EstadoCancha.hasMany(Cancha, { foreignKey: 'estado_id', as: 'canchas' }); // EstadoCancha tiene muchas Canchas

// Asociación Reserva - Usuario - Cancha (Muchos a Muchos a través de Reserva)
// Una reserva pertenece a un usuario y a una cancha
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' }); // Reserva pertenece a un Usuario
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'reservas' }); // Usuario tiene muchas Reservas
Reserva.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' }); // Reserva pertenece a una Cancha
Cancha.hasMany(Reserva, { foreignKey: 'cancha_id', as: 'reservas' }); // Cancha tiene muchas Reservas

// Asociación Evento - Cancha (Muchos a Uno)
// Un evento pertenece a una cancha, una cancha puede tener muchos eventos
Evento.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' }); // Evento pertenece a una Cancha
Cancha.hasMany(Evento, { foreignKey: 'cancha_id', as: 'eventos' }); // Cancha tiene muchos Eventos

// Asociación Feedback - Usuario - Cancha (Muchos a Muchos a través de Feedback)
// Un feedback pertenece a un usuario y a una cancha
Feedback.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' }); // Feedback pertenece a un Usuario
Usuario.hasMany(Feedback, { foreignKey: 'usuario_id', as: 'feedbacks' }); // Usuario tiene muchos Feedbacks
Feedback.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' }); // Feedback pertenece a una Cancha
Cancha.hasMany(Feedback, { foreignKey: 'cancha_id', as: 'feedbacks' }); // Cancha tiene muchos Feedbacks

// Exportar todos los modelos para uso en controladores y otros archivos
export { Rol, Usuario, TipoEspacio, Cancha, Reserva, Evento, Feedback, EstadoCancha }; 