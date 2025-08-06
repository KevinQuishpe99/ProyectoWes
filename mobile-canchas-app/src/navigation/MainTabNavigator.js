// Importación de React para crear componentes
import React from 'react';
// Importación del navegador de tabs inferior
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Importación de componentes básicos de React Native
import { Text, StyleSheet, Platform } from 'react-native';
// Importación del componente de área segura
import { SafeAreaView } from 'react-native-safe-area-context';

// Importación de las pantallas principales
import ReservasScreen from '../screens/ReservasScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Crear instancia del navegador de tabs
const Tab = createBottomTabNavigator();

// Componente principal de navegación por tabs para usuarios autenticados
const MainTabNavigator = ({ route }) => {
  // Extraer parámetros de la ruta (si los hay)
  const { onAuthChange } = route.params || {};

  // Renderizar el navegador de tabs
  return (
    // Contenedor de área segura que respeta las barras del sistema
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Configurar el navegador de tabs */}
      <Tab.Navigator
        // Configuración de opciones para cada tab
        screenOptions={({ route }) => ({
          // Función para renderizar el ícono de cada tab
          tabBarIcon: ({ focused, color, size }) => {
            // Variable para almacenar el nombre del ícono
            let iconName;

            // Asignar emoji según la ruta activa
            if (route.name === 'Mis Reservas') {
              iconName = focused ? '📅' : '📅'; // Ícono de calendario
            } else if (route.name === 'Perfil') {
              iconName = focused ? '👤' : '👤'; // Ícono de usuario
            }

            // Retornar el componente de texto con el emoji
            return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
          },
          // Color del tab activo
          tabBarActiveTintColor: '#3498db',
          // Color del tab inactivo
          tabBarInactiveTintColor: '#7f8c8d',
          // Estilos personalizados para la barra de tabs
          tabBarStyle: {
            backgroundColor: '#fff', // Fondo blanco
            borderTopWidth: 1, // Borde superior
            borderTopColor: '#e0e0e0', // Color del borde
            paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Padding inferior según plataforma
            paddingTop: 10, // Padding superior
            height: Platform.OS === 'ios' ? 90 : 70, // Altura según plataforma
            elevation: 8, // Elevación para Android (sombra)
            shadowColor: '#000', // Color de la sombra
            shadowOffset: { width: 0, height: -2 }, // Offset de la sombra
            shadowOpacity: 0.1, // Opacidad de la sombra
            shadowRadius: 4, // Radio de la sombra
            position: 'absolute', // Posición absoluta
            bottom: 0, // Pegado al fondo
            left: 0, // Desde la izquierda
            right: 0, // Hasta la derecha
            zIndex: 1000, // Índice z alto para estar por encima
          },
          // Estilos para las etiquetas de los tabs
          tabBarLabelStyle: {
            fontSize: 12, // Tamaño de fuente
            fontWeight: '600', // Peso de la fuente
            marginTop: 5, // Margen superior
          },
          // Estilos para el header (aunque no se muestra)
          headerStyle: {
            backgroundColor: '#3498db', // Color de fondo del header
            elevation: 0, // Sin elevación
            shadowOpacity: 0, // Sin sombra
          },
          // Color del texto del header
          headerTintColor: '#fff',
          // Estilos del título del header
          headerTitleStyle: {
            fontWeight: 'bold', // Fuente en negrita
          },
          // Configuración de área segura para el header
          headerSafeAreaInsets: { top: 0 },
        })}
      >
        {/* Tab para ver las reservas del usuario */}
        <Tab.Screen 
          name="Mis Reservas" // Nombre del tab
          component={ReservasScreen} // Componente a renderizar
          options={{
            title: 'Mis Reservas', // Título del tab
          }}
        />
        {/* Tab para ver el perfil del usuario */}
        <Tab.Screen 
          name="Perfil" // Nombre del tab
          component={ProfileScreen} // Componente a renderizar
          options={{
            title: 'Mi Perfil', // Título del tab
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

// Estilos para el contenedor principal
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupar todo el espacio disponible
    backgroundColor: '#f5f5f5', // Color de fondo gris claro
  },
});

// Exportar el componente para usarlo en AppNavigator
export default MainTabNavigator; 