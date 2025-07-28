import Rol from './rol.js';
import Usuario from './usuario.js';
import TipoEspacio from './tipoEspacio.js';
import Cancha from './cancha.js';
import Reserva from './reserva.js';
import Evento from './evento.js';
import Feedback from './feedback.js';
import EstadoCancha from './estadoCancha.js';

// ASOCIACIONES CENTRAlIZADAS
// Usuario - Rol
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });

// Cancha - TipoEspacio
Cancha.belongsTo(TipoEspacio, { foreignKey: 'tipo_espacio_id', as: 'tipoEspacio' });
TipoEspacio.hasMany(Cancha, { foreignKey: 'tipo_espacio_id', as: 'canchas' });

// Cancha - EstadoCancha
Cancha.belongsTo(EstadoCancha, { foreignKey: 'estado_id', as: 'estadoCancha' });
EstadoCancha.hasMany(Cancha, { foreignKey: 'estado_id', as: 'canchas' });

// Reserva - Usuario - Cancha
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'reservas' });
Reserva.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });
Cancha.hasMany(Reserva, { foreignKey: 'cancha_id', as: 'reservas' });

// Evento - Cancha
Evento.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });
Cancha.hasMany(Evento, { foreignKey: 'cancha_id', as: 'eventos' });

// Feedback - Usuario - Cancha
Feedback.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Feedback, { foreignKey: 'usuario_id', as: 'feedbacks' });
Feedback.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });
Cancha.hasMany(Feedback, { foreignKey: 'cancha_id', as: 'feedbacks' });

export { Rol, Usuario, TipoEspacio, Cancha, Reserva, Evento, Feedback, EstadoCancha }; 