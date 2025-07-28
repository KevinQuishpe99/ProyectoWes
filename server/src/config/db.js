import { Sequelize } from 'sequelize';

// Cambia estos valores por los de tu base de datos real
const sequelize = new Sequelize('gestion_canchas_epn', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

// 3. Sincronizar modelos (opcional, puedes comentar si solo quieres probar conexión)
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((err) => {
    console.log('Error al sincronizar la BDD', err);
  });

// 4. Exportar la instancia de Sequelize
export default sequelize; 