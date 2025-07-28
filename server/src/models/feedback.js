import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Usuario from './usuario.js';
import Cancha from './cancha.js';

const Feedback = sequelize.define('Feedback', {
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
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'feedback',
  timestamps: false
});

export default Feedback; 