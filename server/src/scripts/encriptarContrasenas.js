import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';
import Usuario from '../models/usuario.js';

const encriptarContrasenas = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');

    // Obtener todos los usuarios
    const usuarios = await Usuario.findAll();
    console.log(`Encontrados ${usuarios.length} usuarios`);

    for (const usuario of usuarios) {
      // Verificar si la contraseña ya está encriptada
      const contrasenaActual = usuario.contrasena;
      
      // Si la contraseña no parece estar encriptada (no empieza con $2b$)
      if (!contrasenaActual.startsWith('$2b$')) {
        console.log(`Encriptando contraseña para usuario: ${usuario.nombres}`);
        
        // Encriptar la contraseña
        const saltRounds = 10;
        const contrasenaEncriptada = await bcrypt.hash(contrasenaActual, saltRounds);
        
        // Actualizar el usuario
        await usuario.update({ contrasena: contrasenaEncriptada });
        console.log(`Contraseña encriptada para: ${usuario.nombres}`);
      } else {
        console.log(`Contraseña ya encriptada para: ${usuario.nombres}`);
      }
    }

    console.log('Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

encriptarContrasenas(); 