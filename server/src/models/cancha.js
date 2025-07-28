import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import TipoEspacio from './tipoEspacio.js';
import EstadoCancha from './estadoCancha.js';

const Cancha = sequelize.define('Cancha', {
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
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo_espacio_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoEspacio,
      key: 'id'
    }
  },
  ubicacion_referencia: {
    type: DataTypes.STRING,
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagen: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  estado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EstadoCancha,
      key: 'id'
    }
  }
}, {
  tableName: 'canchas',
  timestamps: false
});

export default Cancha; 