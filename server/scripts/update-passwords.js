import bcrypt from 'bcrypt';
import { Usuario } from '../src/models/index.js';
import sequelize from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

async function updatePasswords() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Contraseñas en texto plano
    const users = [
      { correo: 'admin@epn.edu.ec', contrasena: 'admin123' },
      { correo: 'organizador@epn.edu.ec', contrasena: 'organizador123' },
      { correo: 'estudiante@epn.edu.ec', contrasena: 'estudiante123' }
    ];

    for (const user of users) {
      const usuario = await Usuario.findOne({ where: { correo: user.correo } });
      
      if (usuario) {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(user.contrasena, BCRYPT_SALT_ROUNDS);
        
        // Actualizar en la base de datos
        await usuario.update({ contrasena: hashedPassword });
        
        console.log(`✅ Contraseña actualizada para: ${user.correo}`);
      } else {
        console.log(`❌ Usuario no encontrado: ${user.correo}`);
      }
    }

    console.log('🎉 Todas las contraseñas han sido actualizadas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updatePasswords(); 