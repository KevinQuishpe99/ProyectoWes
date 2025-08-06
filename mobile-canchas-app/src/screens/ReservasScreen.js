import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../services/api';

const ReservasScreen = ({ navigation }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservas/mis-reservas');
      const data = response.data;
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      let errorMessage = 'Error al cargar las reservas';
      
      if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        // Aquí podrías manejar el logout automático
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservas();
    setRefreshing(false);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'reservada':
        return '#27ae60';
      case 'cancelada':
        return '#e74c3c';
      default:
        return '#f39c12';
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Asegurar formato HH:MM:SS
    const time = timeString.toString();
    if (time.length === 5) {
      return time + ':00';
    }
    return time;
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Cancha</Text>
      <Text style={styles.headerText}>Fecha</Text>
      <Text style={styles.headerText}>Hora Inicio</Text>
      <Text style={styles.headerText}>Hora Fin</Text>
      <Text style={styles.headerText}>Estado</Text>
    </View>
  );

  const renderReserva = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cellText} numberOfLines={2}>
        {item.cancha?.nombre || 'N/A'}
      </Text>
      <Text style={styles.cellText}>
        {formatDate(item.fecha)}
      </Text>
      <Text style={styles.cellText}>
        {formatTime(item.hora_inicio)}
      </Text>
      <Text style={styles.cellText}>
        {formatTime(item.hora_fin)}
      </Text>
      <View style={styles.estadoContainer}>
        <View style={[
          styles.estadoBadge,
          { backgroundColor: getEstadoColor(item.estado) }
        ]}>
          <Text style={styles.estadoText}>
            {getEstadoText(item.estado)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mis Reservas</Text>
        <Text style={styles.subtitle}>Lista de tus reservas de canchas</Text>
      </View>
      
      <FlatList
        data={reservas}
        renderItem={renderReserva}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={reservas.length > 0 ? renderHeader : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes reservas</Text>
            <Text style={styles.emptySubtext}>
              Tus reservas aparecerán aquí cuando las tengas
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cellText: {
    flex: 1,
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  estadoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estadoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 60,
  },
  estadoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default ReservasScreen; 