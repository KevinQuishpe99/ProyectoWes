import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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

async function fixFeedbackConstraints() {
  try {
    console.log('🔧 Iniciando corrección de restricciones de feedback...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Eliminar restricciones existentes
    console.log('🗑️ Eliminando restricciones existentes...');
    await sequelize.query(`
      ALTER TABLE feedback 
      DROP CONSTRAINT IF EXISTS feedback_usuario_id_fkey;
    `);
    
    await sequelize.query(`
      ALTER TABLE feedback 
      DROP CONSTRAINT IF EXISTS feedback_cancha_id_fkey;
    `);
    
    // Agregar nuevas restricciones con CASCADE DELETE
    console.log('➕ Agregando restricciones con CASCADE DELETE...');
    await sequelize.query(`
      ALTER TABLE feedback 
      ADD CONSTRAINT feedback_usuario_id_fkey 
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) 
      ON DELETE CASCADE;
    `);
    
    await sequelize.query(`
      ALTER TABLE feedback 
      ADD CONSTRAINT feedback_cancha_id_fkey 
      FOREIGN KEY (cancha_id) REFERENCES canchas(id) 
      ON DELETE CASCADE;
    `);
    
    // Verificar las restricciones
    console.log('🔍 Verificando restricciones...');
    const [results] = await sequelize.query(`
      SELECT 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.delete_rule
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          JOIN information_schema.referential_constraints AS rc
            ON tc.constraint_name = rc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND tc.table_name='feedback';
    `);
    
    console.log('📋 Restricciones actualizadas:');
    results.forEach(row => {
      console.log(`  - ${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name} (${row.delete_rule})`);
    });
    
    console.log('✅ Restricciones de feedback actualizadas con CASCADE DELETE');
    console.log('🎉 Ahora puedes eliminar feedback sin problemas de dependencias');
    
  } catch (error) {
    console.error('❌ Error al corregir restricciones:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
fixFeedbackConstraints(); 