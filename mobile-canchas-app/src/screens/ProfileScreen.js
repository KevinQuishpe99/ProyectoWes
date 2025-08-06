// Importación de React para crear componentes
import React, { useState, useEffect } from 'react';
// Importación de componentes básicos de React Native
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
// Importación del servicio de autenticación
import { authService } from '../services/authService';
// Importación del hook de autenticación
import { useAuth } from '../../App';

// Componente de pantalla de perfil del usuario
const ProfileScreen = ({ navigation }) => {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState(null);
  // Estado para controlar si se está cargando
  const [loading, setLoading] = useState(true);
  // Obtener la función de logout del contexto de autenticación
  const { logout } = useAuth();

  // Función para cargar los datos del usuario desde el almacenamiento local
  const loadUserData = async () => {
    try {
      // Activar el estado de carga
      setLoading(true);
      // Obtener los datos del usuario almacenados
      const data = await authService.getUserData();
      // Actualizar el estado con los datos obtenidos
      setUserData(data);
    } catch (error) {
      // Mostrar error en consola si algo falla
      console.error('Error cargando datos del usuario:', error);
    } finally {
      // Desactivar el estado de carga
      setLoading(false);
    }
  };

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    // Cargar los datos del usuario al iniciar la pantalla
    loadUserData();
  }, []); // Array vacío significa que solo se ejecuta una vez

  // Función para manejar el proceso de cierre de sesión
  const handleLogout = async () => {
    // Mostrar alerta de confirmación antes de cerrar sesión
    Alert.alert(
      'Cerrar Sesión', // Título de la alerta
      '¿Estás seguro de que quieres cerrar sesión?', // Mensaje de confirmación
      [
        // Botón de cancelar
        { text: 'Cancelar', style: 'cancel' },
        // Botón de confirmar
        {
          text: 'Cerrar Sesión',
          style: 'destructive', // Estilo destructivo (rojo)
          onPress: async () => {
            try {
              // Llamar al servicio para limpiar los datos de sesión
              await authService.logout();
              // Usar el contexto para cambiar el estado de autenticación
              logout();
            } catch (error) {
              // Mostrar error en consola si algo falla
              console.error('Error en logout:', error);
              // Forzar logout incluso si hay error
              logout();
            }
          }
        }
      ]
    );
  };

  // Función para formatear los datos del usuario para mostrar
  const formatUserData = (data) => {
    // Si no hay datos, retornar null
    if (!data) return null;
    
    // Retornar objeto con datos formateados
    return {
      nombre: data.nombres || data.userName || 'Usuario', // Nombre del usuario
      email: data.correo || data.email || 'email@ejemplo.com', // Email del usuario
      codigo: data.codigo || 'N/A', // Código de estudiante
      rol: 'Estudiante', // Rol fijo para la app móvil
      id: data.id || 'N/A' // ID del usuario
    };
  };

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Indicador de actividad */}
        <ActivityIndicator size="large" color="#3498db" />
        {/* Texto de carga */}
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  // Formatear los datos del usuario para mostrar
  const userInfo = formatUserData(userData);

  // Renderizar la pantalla de perfil
  return (
    // Contenedor principal de la pantalla
    <View style={styles.container}>
      {/* Contenedor scrolleable para el contenido */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta principal del perfil */}
        <View style={styles.profileCard}>
          {/* Contenedor del avatar */}
          <View style={styles.avatarContainer}>
            {/* Emoji como avatar */}
            <Text style={styles.avatar}>👤</Text>
          </View>
          {/* Nombre del usuario */}
          <Text style={styles.userName}>{userInfo?.nombre}</Text>
          {/* Email del usuario */}
          <Text style={styles.userEmail}>{userInfo?.email}</Text>
          {/* Código de estudiante */}
          <Text style={styles.userCode}>Código: {userInfo?.codigo}</Text>
          {/* Rol del usuario */}
          <Text style={styles.userRole}>{userInfo?.rol}</Text>
          {/* ID del usuario */}
          <Text style={styles.userId}>ID: {userInfo?.id}</Text>
        </View>

        {/* Sección de información adicional */}
        <View style={styles.infoSection}>
          {/* Tarjeta de información */}
          <View style={styles.infoCard}>
            {/* Título de la información */}
            <Text style={styles.infoTitle}>Información de la Cuenta</Text>
            {/* Descripción de la cuenta */}
            <Text style={styles.infoText}>
              Tu cuenta está activa y puedes acceder a todas las funcionalidades de la aplicación móvil.
            </Text>
          </View>
        </View>

        {/* Sección del menú */}
        <View style={styles.menuSection}>
          {/* Botón para cerrar sesión */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            {/* Texto del botón */}
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Estilos para los componentes de la pantalla
const styles = StyleSheet.create({
  // Estilos para el contenedor principal
  container: {
    flex: 1, // Ocupar todo el espacio disponible
    backgroundColor: '#f5f5f5', // Color de fondo gris claro
  },
  // Estilos para el contenido scrolleable
  content: {
    flex: 1, // Ocupar todo el espacio disponible
  },
  // Estilos para el contenido del scroll
  scrollContent: {
    padding: 20, // Padding horizontal
    paddingBottom: 120, // Padding inferior para los tabs
  },
  // Estilos para el contenedor de carga
  loadingContainer: {
    flex: 1, // Ocupar todo el espacio disponible
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    backgroundColor: '#f5f5f5', // Color de fondo gris claro
  },
  // Estilos para el texto de carga
  loadingText: {
    marginTop: 10, // Margen superior
    fontSize: 16, // Tamaño de fuente
    color: '#7f8c8d', // Color del texto gris
  },
  // Estilos para la tarjeta del perfil
  profileCard: {
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 15, // Bordes redondeados
    padding: 30, // Padding interno
    alignItems: 'center', // Centrar contenido horizontalmente
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0, // Offset horizontal
      height: 2, // Offset vertical
    },
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de la sombra
    elevation: 5, // Elevación para Android
    marginBottom: 20, // Margen inferior
  },
  // Estilos para el contenedor del avatar
  avatarContainer: {
    width: 80, // Ancho del avatar
    height: 80, // Alto del avatar
    borderRadius: 40, // Bordes redondeados para hacer círculo
    backgroundColor: '#3498db', // Color de fondo azul
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    marginBottom: 20, // Margen inferior
  },
  // Estilos para el emoji del avatar
  avatar: {
    fontSize: 40, // Tamaño del emoji
  },
  // Estilos para el nombre del usuario
  userName: {
    fontSize: 24, // Tamaño de fuente
    fontWeight: 'bold', // Fuente en negrita
    color: '#2c3e50', // Color del texto
    marginBottom: 8, // Margen inferior
  },
  // Estilos para el email del usuario
  userEmail: {
    fontSize: 16, // Tamaño de fuente
    color: '#7f8c8d', // Color del texto gris
    marginBottom: 8, // Margen inferior
  },
  // Estilos para el código de estudiante
  userCode: {
    fontSize: 14, // Tamaño de fuente
    color: '#95a5a6', // Color del texto gris claro
    marginBottom: 4, // Margen inferior
  },
  // Estilos para el rol del usuario
  userRole: {
    fontSize: 14, // Tamaño de fuente
    color: '#27ae60', // Color verde para el rol
    fontWeight: '600', // Peso de la fuente
    marginBottom: 4, // Margen inferior
  },
  // Estilos para el ID del usuario
  userId: {
    fontSize: 12, // Tamaño de fuente pequeño
    color: '#bdc3c7', // Color del texto muy claro
  },
  // Estilos para la sección de información
  infoSection: {
    marginBottom: 20, // Margen inferior
  },
  // Estilos para la tarjeta de información
  infoCard: {
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 10, // Bordes redondeados
    padding: 20, // Padding interno
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0, // Offset horizontal
      height: 1, // Offset vertical
    },
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 2, // Radio de la sombra
    elevation: 2, // Elevación para Android
  },
  // Estilos para el título de la información
  infoTitle: {
    fontSize: 18, // Tamaño de fuente
    fontWeight: 'bold', // Fuente en negrita
    color: '#2c3e50', // Color del texto
    marginBottom: 10, // Margen inferior
  },
  // Estilos para el texto de la información
  infoText: {
    fontSize: 14, // Tamaño de fuente
    color: '#7f8c8d', // Color del texto gris
    lineHeight: 20, // Altura de línea
  },
  // Estilos para la sección del menú
  menuSection: {
    marginTop: 20, // Margen superior
  },
  // Estilos para el botón de cerrar sesión
  logoutButton: {
    backgroundColor: '#e74c3c', // Color de fondo rojo
    borderRadius: 10, // Bordes redondeados
    padding: 15, // Padding interno
    alignItems: 'center', // Centrar contenido
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0, // Offset horizontal
      height: 2, // Offset vertical
    },
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de la sombra
    elevation: 5, // Elevación para Android
  },
  // Estilos para el texto del botón de cerrar sesión
  logoutButtonText: {
    color: '#fff', // Color blanco
    fontSize: 16, // Tamaño de fuente
    fontWeight: '600', // Peso de la fuente
  },
});

// Exportar el componente para usarlo en la navegación
export default ProfileScreen; 