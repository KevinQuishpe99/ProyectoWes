import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Usuario from './usuario.js';
import Cancha from './cancha.js';

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  cancha_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Cancha,
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'reservada'
  }
}, {
  tableName: 'reservas',
  timestamps: false
});

export default Reserva; 