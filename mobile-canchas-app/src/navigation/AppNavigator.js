// Importación de React para crear componentes
import React from 'react';
// Importación del navegador de stack nativo
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importación de las pantallas de autenticación
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
// Importación del navegador de tabs principal
import MainTabNavigator from './MainTabNavigator';
// Importación del hook de autenticación
import { useAuth } from '../../App';

// Crear instancia del navegador de stack
const Stack = createNativeStackNavigator();

// Componente principal de navegación que maneja las rutas según el estado de autenticación
const AppNavigator = () => {
  // Obtener el estado de autenticación del contexto
  const { isAuthenticated } = useAuth();

  // Renderizar el navegador con las rutas correspondientes
  return (
    // Configurar el navegador de stack
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ocultar headers por defecto
      }}
    >
      {/* Renderizar diferentes pantallas según el estado de autenticación */}
      {isAuthenticated ? (
        // Si está autenticado, mostrar el navegador de tabs principal
        <Stack.Screen 
          name="MainTabs" // Nombre de la ruta
          component={MainTabNavigator} // Componente a renderizar
        />
      ) : (
        // Si no está autenticado, mostrar las pantallas de login y registro
        <>
          {/* Pantalla de inicio de sesión */}
          <Stack.Screen 
            name="Login" // Nombre de la ruta
            component={LoginScreen} // Componente a renderizar
          />
          {/* Pantalla de registro */}
          <Stack.Screen 
            name="Register" // Nombre de la ruta
            component={RegisterScreen} // Componente a renderizar
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// Exportar el componente para usarlo en App.js
export default AppNavigator; 