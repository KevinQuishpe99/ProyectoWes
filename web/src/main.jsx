// Importación de React para crear componentes
import React from 'react';
// Importación de ReactDOM para renderizar en el DOM
import ReactDOM from 'react-dom/client';
// Importación del Provider de Redux para gestionar el estado global
import { Provider } from 'react-redux';
// Importación del store configurado de Redux
import { store } from './store/store';
// Importación del BrowserRouter para manejar la navegación
import { BrowserRouter } from 'react-router-dom';
// Importación del componente principal de la aplicación
import App from './App';
// Importación de los estilos de Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css';
// Importación de los estilos personalizados de la aplicación
import './estilos/custom.css';

// Crear el elemento raíz de React y renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  // Proveedor de Redux que envuelve toda la aplicación
  <Provider store={store}>
    {/* Router de navegación que maneja las rutas de la aplicación */}
    <BrowserRouter>
      {/* Componente principal de la aplicación */}
      <App />
    </BrowserRouter>
  </Provider>
); 
