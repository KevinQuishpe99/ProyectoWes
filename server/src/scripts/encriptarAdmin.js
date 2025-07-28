import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';
import Usuario from '../models/usuario.js';

const encriptarAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');

    // Buscar el usuario admin
    const admin = await Usuario.findOne({
      where: { correo: 'admin@epn.edu.ec' }
    });

    if (!admin) {
      console.log('Usuario admin no encontrado');
      return;
    }

    console.log('Usuario encontrado:', admin.nombres);
    console.log('Contraseña actual:', admin.contrasena);

    // Encriptar la contraseña
    const saltRounds = 10;
    const contrasenaEncriptada = await bcrypt.hash('admin123', saltRounds);
    
    console.log('Contraseña encriptada:', contrasenaEncriptada);

    // Actualizar el usuario
    await admin.update({ contrasena: contrasenaEncriptada });
    
    console.log('Contraseña actualizada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

encriptarAdmin(); 