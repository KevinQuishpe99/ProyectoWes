// Importaciones necesarias para React y navegación
import React, { useState, useEffect, createContext, useContext } from 'react';
// Componente de barra de estado de Expo
import { StatusBar } from 'expo-status-bar';
// Componentes básicos de React Native
import { View, StyleSheet } from 'react-native';
// Proveedor de área segura para diferentes dispositivos
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Contenedor principal de navegación
import { NavigationContainer } from '@react-navigation/native';
// Navegador principal de la aplicación
import AppNavigator from './src/navigation/AppNavigator';
// Servicio de autenticación
import { authService } from './src/services/authService';

// Crear contexto de autenticación para compartir estado entre componentes
export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  // Obtener el contexto actual
  const context = useContext(AuthContext);
  // Verificar que el contexto existe
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Componente principal de la aplicación
export default function App() {
  // Estado para controlar si el usuario está autenticado (null = cargando, true/false = autenticado/no autenticado)
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    // Verificar el estado de autenticación al iniciar la app
    checkAuthStatus();
  }, []); // Array vacío significa que solo se ejecuta una vez

  // Función para verificar si hay una sesión activa
  const checkAuthStatus = async () => {
    try {
      // Llamar al servicio para verificar si hay un token válido
      const authenticated = await authService.isAuthenticated();
      // Actualizar el estado con el resultado
      setIsAuthenticated(authenticated);
    } catch (error) {
      // Si hay error, asumir que no está autenticado
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  // Función para manejar cambios en el estado de autenticación
  const handleAuthChange = (authenticated) => {
    // Actualizar el estado de autenticación
    setIsAuthenticated(authenticated);
  };

  // Objeto con el valor del contexto que se pasará a los componentes hijos
  const authValue = {
    isAuthenticated, // Estado actual de autenticación
    login: () => handleAuthChange(true), // Función para hacer login
    logout: () => handleAuthChange(false), // Función para hacer logout
  };

  // Renderizar la aplicación con el contexto de autenticación
  return (
    // Proveedor del contexto de autenticación
    <AuthContext.Provider value={authValue}>
      {/* Proveedor de área segura para manejar notches y barras del sistema */}
      <SafeAreaProvider>
        {/* Contenedor principal de navegación */}
        <NavigationContainer>
          {/* Contenedor principal de la aplicación */}
          <View style={styles.container}>
            {/* Configuración de la barra de estado */}
            <StatusBar 
              style="light" // Estilo claro para la barra de estado
              backgroundColor="#3498db" // Color de fondo de la barra
              translucent={false} // No translúcida para evitar problemas de layout
            />
            {/* Navegador principal que maneja las rutas según el estado de autenticación */}
            <AppNavigator />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

// Estilos para el contenedor principal
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupar todo el espacio disponible
    backgroundColor: '#f5f5f5', // Color de fondo gris claro
  },
});
