import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TipoEspacio = sequelize.define('TipoEspacio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagen: {
    type: DataTypes.BLOB,
    allowNull: true
  }
}, {
  tableName: 'tipos_espacio',
  timestamps: false
});

export default TipoEspacio; 