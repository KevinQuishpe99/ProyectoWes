import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const EstadoCancha = sequelize.define('EstadoCancha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'estados_cancha',
  timestamps: false
});

export default EstadoCancha; 