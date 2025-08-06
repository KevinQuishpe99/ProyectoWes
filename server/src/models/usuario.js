// Importación de DataTypes de Sequelize para definir tipos de datos
import { DataTypes } from 'sequelize';
// Importación de la configuración de la base de datos
import sequelize from '../config/db.js';
// Importación del modelo Rol para la referencia
import Rol from './rol.js';

// Definición del modelo Usuario usando Sequelize
const Usuario = sequelize.define('Usuario', {
  // Campo ID - Clave primaria autoincremental
  id: {
    type: DataTypes.INTEGER, // Tipo de dato entero
    primaryKey: true, // Marcar como clave primaria
    autoIncrement: true // Auto incrementar el valor
  },
  // Campo nombres - Nombre completo del usuario
  nombres: {
    type: DataTypes.STRING, // Tipo de dato string
    allowNull: false // No permitir valores nulos
  },
  // Campo correo - Email único del usuario
  correo: {
    type: DataTypes.STRING, // Tipo de dato string
    unique: true, // Debe ser único en la tabla
    allowNull: false // No permitir valores nulos
  },
  // Campo contrasena - Contraseña hasheada del usuario
  contrasena: {
    type: DataTypes.STRING, // Tipo de dato string
    allowNull: false // No permitir valores nulos
  },
  // Campo rol_id - Referencia al rol del usuario
  rol_id: {
    type: DataTypes.INTEGER, // Tipo de dato entero
    allowNull: false, // No permitir valores nulos
    references: {
      model: Rol, // Referencia al modelo Rol
      key: 'id' // Clave primaria del modelo Rol
    }
  },
  // Campo codigo - Código único del estudiante
  codigo: {
    type: DataTypes.STRING, // Tipo de dato string
    unique: true, // Debe ser único en la tabla
    allowNull: false // No permitir valores nulos
  }
}, {
  tableName: 'usuarios', // Nombre de la tabla en la base de datos
  timestamps: false // No usar timestamps automáticos (createdAt, updatedAt)
});

// Exportar el modelo Usuario
export default Usuario; 