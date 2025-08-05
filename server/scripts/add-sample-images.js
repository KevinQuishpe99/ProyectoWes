import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gestion_canchas_epn',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  logging: false
});

// Función para crear una imagen de placeholder en base64
function createPlaceholderImage(width = 400, height = 300, text = 'Cancha') {
  // Crear un SVG simple como placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="#e0e0e0" stroke="#ccc" stroke-width="2"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#666" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dominant-baseline="middle">
        Imagen de ejemplo
      </text>
    </svg>
  `;
  
  // Convertir SVG a base64
  return Buffer.from(svg).toString('base64');
}

async function addSampleImages() {
  try {
    console.log('🖼️ Iniciando agregado de imágenes de ejemplo...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Crear imágenes de placeholder para cada cancha
    const canchas = [
      { id: 1, nombre: 'Cancha Fútbol 1', tipo: 'Fútbol' },
      { id: 2, nombre: 'Cancha Básquet 1', tipo: 'Básquet' },
      { id: 3, nombre: 'Cancha Voleibol 1', tipo: 'Voleibol' }
    ];
    
    for (const cancha of canchas) {
      console.log(`🔄 Procesando cancha: ${cancha.nombre}`);
      
      // Crear imagen de placeholder
      const placeholderImage = createPlaceholderImage(400, 300, cancha.tipo);
      
      // Convertir base64 a buffer
      const imageBuffer = Buffer.from(placeholderImage, 'base64');
      
      // Actualizar la cancha con la imagen
      await sequelize.query(
        'UPDATE canchas SET imagen = $1 WHERE id = $2',
        {
          replacements: [imageBuffer, cancha.id],
          type: sequelize.QueryTypes.UPDATE
        }
      );
      
      console.log(`✅ Imagen agregada a: ${cancha.nombre}`);
    }
    
    // Verificar que las imágenes se agregaron
    const [results] = await sequelize.query(
      'SELECT id, nombre, CASE WHEN imagen IS NOT NULL THEN "Tiene imagen" ELSE "Sin imagen" END as estado_imagen FROM canchas ORDER BY id'
    );
    
    console.log('📋 Estado de las canchas:');
    results.forEach(row => {
      console.log(`  - ${row.nombre}: ${row.estado_imagen}`);
    });
    
    console.log('✅ Imágenes de ejemplo agregadas exitosamente');
    console.log('🎉 Ahora las canchas deberían mostrar imágenes en el frontend');
    
  } catch (error) {
    console.error('❌ Error agregando imágenes:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
addSampleImages(); 