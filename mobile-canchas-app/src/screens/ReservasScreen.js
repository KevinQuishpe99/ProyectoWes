// Importación de React para crear componentes
import React, { useState, useEffect } from 'react';
// Importación de componentes básicos de React Native
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
// Importación del servicio de API
import api from '../services/api';

// Componente de pantalla para mostrar las reservas del usuario
const ReservasScreen = ({ navigation }) => {
  // Estado para almacenar la lista de reservas
  const [reservas, setReservas] = useState([]);
  // Estado para controlar si se está cargando inicialmente
  const [loading, setLoading] = useState(true);
  // Estado para controlar si se está refrescando la lista
  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar las reservas desde el servidor
  const loadReservas = async () => {
    try {
      // Activar el estado de carga
      setLoading(true);
      // Hacer petición GET al endpoint de mis reservas
      const response = await api.get('/reservas/mis-reservas');
      // Extraer los datos de la respuesta
      const data = response.data;
      // Actualizar el estado con los datos, asegurándose de que sea un array
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error cargando reservas:', error);
      // Variable para almacenar el mensaje de error
      let errorMessage = 'Error al cargar las reservas';
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        // Aquí podrías manejar el logout automático
      }
      
      // Mostrar alerta con el mensaje de error
      Alert.alert('Error', errorMessage);
    } finally {
      // Desactivar el estado de carga
      setLoading(false);
    }
  };

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    // Cargar las reservas al iniciar la pantalla
    loadReservas();
  }, []); // Array vacío significa que solo se ejecuta una vez

  // Función para manejar el pull-to-refresh
  const onRefresh = async () => {
    // Activar el estado de refrescado
    setRefreshing(true);
    // Recargar las reservas
    await loadReservas();
    // Desactivar el estado de refrescado
    setRefreshing(false);
  };

  // Función para obtener el color según el estado de la reserva
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'reservada':
        return '#27ae60'; // Verde para reservas activas
      case 'cancelada':
        return '#e74c3c'; // Rojo para reservas canceladas
      default:
        return '#f39c12'; // Naranja para otros estados
    }
  };

  // Función para obtener el texto del estado de la reserva
  const getEstadoText = (estado) => {
    switch (estado) {
      case 'reservada':
        return 'Reservada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  };

  // Función para formatear la fecha en formato DD/MM/YYYY
  const formatDate = (dateString) => {
    // Crear objeto Date a partir del string
    const date = new Date(dateString);
    // Formatear la fecha usando el locale español
    return date.toLocaleDateString('es-ES', {
      day: '2-digit', // Día con dos dígitos
      month: '2-digit', // Mes con dos dígitos
      year: 'numeric' // Año numérico
    });
  };

  // Función para formatear la hora en formato HH:MM:SS
  const formatTime = (timeString) => {
    // Si no hay hora, retornar N/A
    if (!timeString) return 'N/A';
    // Convertir a string si no lo es
    const time = timeString.toString();
    // Si la hora tiene 5 caracteres (HH:MM), agregar :00
    if (time.length === 5) {
      return time + ':00';
    }
    // Retornar la hora tal como está
    return time;
  };

  // Función para renderizar el header de la tabla
  const renderHeader = () => (
    <View style={styles.tableHeader}>
      {/* Columna Cancha */}
      <Text style={styles.headerText}>Cancha</Text>
      {/* Columna Fecha */}
      <Text style={styles.headerText}>Fecha</Text>
      {/* Columna Hora Inicio */}
      <Text style={styles.headerText}>Hora Inicio</Text>
      {/* Columna Hora Fin */}
      <Text style={styles.headerText}>Hora Fin</Text>
      {/* Columna Estado */}
      <Text style={styles.headerText}>Estado</Text>
    </View>
  );

  // Función para renderizar cada fila de reserva
  const renderReserva = ({ item }) => (
    <View style={styles.tableRow}>
      {/* Celda con nombre de la cancha */}
      <Text style={styles.cellText} numberOfLines={2}>
        {item.cancha?.nombre || 'N/A'}
      </Text>
      {/* Celda con fecha formateada */}
      <Text style={styles.cellText}>
        {formatDate(item.fecha)}
      </Text>
      {/* Celda con hora de inicio formateada */}
      <Text style={styles.cellText}>
        {formatTime(item.hora_inicio)}
      </Text>
      {/* Celda con hora de fin formateada */}
      <Text style={styles.cellText}>
        {formatTime(item.hora_fin)}
      </Text>
      {/* Contenedor para el estado con badge */}
      <View style={styles.estadoContainer}>
        {/* Badge del estado con color dinámico */}
        <View style={[
          styles.estadoBadge,
          { backgroundColor: getEstadoColor(item.estado) }
        ]}>
          {/* Texto del estado */}
          <Text style={styles.estadoText}>
            {getEstadoText(item.estado)}
          </Text>
        </View>
      </View>
    </View>
  );

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Indicador de actividad */}
        <ActivityIndicator size="large" color="#3498db" />
        {/* Texto de carga */}
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  // Renderizar la pantalla de reservas
  return (
    // Contenedor principal de la pantalla
    <View style={styles.container}>
      {/* Contenedor del título */}
      <View style={styles.titleContainer}>
        {/* Título principal */}
        <Text style={styles.title}>Mis Reservas</Text>
        {/* Subtítulo descriptivo */}
        <Text style={styles.subtitle}>Lista de tus reservas de canchas</Text>
      </View>
      
      {/* Lista plana para mostrar las reservas */}
      <FlatList
        data={reservas} // Datos a mostrar
        renderItem={renderReserva} // Función para renderizar cada item
        keyExtractor={(item) => item.id.toString()} // Función para generar keys únicas
        refreshControl={
          // Control de pull-to-refresh
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer} // Estilos del contenedor
        ListHeaderComponent={reservas.length > 0 ? renderHeader : null} // Header solo si hay reservas
        ListEmptyComponent={
          // Componente a mostrar cuando no hay reservas
          <View style={styles.emptyContainer}>
            {/* Mensaje principal */}
            <Text style={styles.emptyText}>No tienes reservas</Text>
            {/* Mensaje secundario */}
            <Text style={styles.emptySubtext}>
              Tus reservas aparecerán aquí cuando las tengas
            </Text>
          </View>
        }
      />
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
  // Estilos para el contenedor del título
  titleContainer: {
    backgroundColor: '#fff', // Fondo blanco
    padding: 20, // Padding interno
    borderBottomWidth: 1, // Ancho del borde inferior
    borderBottomColor: '#e0e0e0', // Color del borde inferior
  },
  // Estilos para el título principal
  title: {
    fontSize: 24, // Tamaño de fuente
    fontWeight: 'bold', // Fuente en negrita
    color: '#2c3e50', // Color del texto
    textAlign: 'center', // Centrar texto
  },
  // Estilos para el subtítulo
  subtitle: {
    fontSize: 14, // Tamaño de fuente
    color: '#7f8c8d', // Color del texto gris
    textAlign: 'center', // Centrar texto
    marginTop: 5, // Margen superior
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
  // Estilos para el contenedor de la lista
  listContainer: {
    padding: 16, // Padding interno
    paddingBottom: 100, // Padding inferior para los tabs
  },
  // Estilos para el header de la tabla
  tableHeader: {
    flexDirection: 'row', // Dirección horizontal
    backgroundColor: '#34495e', // Color de fondo azul oscuro
    paddingVertical: 12, // Padding vertical
    paddingHorizontal: 8, // Padding horizontal
    borderRadius: 8, // Bordes redondeados
    marginBottom: 8, // Margen inferior
  },
  // Estilos para el texto del header
  headerText: {
    flex: 1, // Ocupar espacio igual
    color: '#fff', // Color blanco
    fontSize: 12, // Tamaño de fuente
    fontWeight: 'bold', // Fuente en negrita
    textAlign: 'center', // Centrar texto
  },
  // Estilos para cada fila de la tabla
  tableRow: {
    flexDirection: 'row', // Dirección horizontal
    backgroundColor: '#fff', // Fondo blanco
    paddingVertical: 12, // Padding vertical
    paddingHorizontal: 8, // Padding horizontal
    borderRadius: 8, // Bordes redondeados
    marginBottom: 6, // Margen inferior
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0, // Offset horizontal
      height: 1, // Offset vertical
    },
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 2, // Radio de la sombra
    elevation: 2, // Elevación para Android
  },
  // Estilos para el texto de cada celda
  cellText: {
    flex: 1, // Ocupar espacio igual
    fontSize: 12, // Tamaño de fuente
    color: '#2c3e50', // Color del texto
    textAlign: 'center', // Centrar texto
    paddingHorizontal: 2, // Padding horizontal
  },
  // Estilos para el contenedor del estado
  estadoContainer: {
    flex: 1, // Ocupar espacio igual
    alignItems: 'center', // Centrar horizontalmente
    justifyContent: 'center', // Centrar verticalmente
  },
  // Estilos para el badge del estado
  estadoBadge: {
    paddingHorizontal: 6, // Padding horizontal
    paddingVertical: 3, // Padding vertical
    borderRadius: 10, // Bordes redondeados
    minWidth: 60, // Ancho mínimo
  },
  // Estilos para el texto del estado
  estadoText: {
    color: '#fff', // Color blanco
    fontSize: 10, // Tamaño de fuente pequeño
    fontWeight: '600', // Peso de la fuente
    textAlign: 'center', // Centrar texto
  },
  // Estilos para el contenedor vacío
  emptyContainer: {
    flex: 1, // Ocupar todo el espacio disponible
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    paddingVertical: 50, // Padding vertical
  },
  // Estilos para el texto principal del estado vacío
  emptyText: {
    fontSize: 18, // Tamaño de fuente
    fontWeight: 'bold', // Fuente en negrita
    color: '#7f8c8d', // Color del texto gris
    marginBottom: 8, // Margen inferior
  },
  // Estilos para el texto secundario del estado vacío
  emptySubtext: {
    fontSize: 14, // Tamaño de fuente
    color: '#95a5a6', // Color del texto gris claro
    textAlign: 'center', // Centrar texto
  },
});

// Exportar el componente para usarlo en la navegación
export default ReservasScreen; 