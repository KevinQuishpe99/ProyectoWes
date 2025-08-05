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
import { reservasService } from '../services/reservasService';

const ReservasScreen = ({ navigation }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const data = await reservasService.getMisReservas();
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      let errorMessage = 'Error al cargar las reservas';
      
      if (error.message === 'Usuario no autenticado') {
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

  const renderReserva = ({ item }) => (
    <View style={styles.reservaCard}>
      <View style={styles.reservaHeader}>
        <Text style={styles.reservaTitle}>Cancha: {item.cancha?.nombre || 'N/A'}</Text>
        <View style={[
          styles.estadoBadge,
          { backgroundColor: getEstadoColor(item.estado) }
        ]}>
          <Text style={styles.estadoText}>
            {getEstadoText(item.estado)}
          </Text>
        </View>
      </View>
      
      <View style={styles.reservaDetails}>
        <Text style={styles.reservaText}>
          📅 Fecha: {new Date(item.fecha).toLocaleDateString()}
        </Text>
        <Text style={styles.reservaText}>
          🕐 Hora: {item.hora_inicio} - {item.hora_fin}
        </Text>
        <Text style={styles.reservaText}>
          🏟️ Tipo: {item.cancha?.tipoEspacio?.nombre || 'N/A'}
        </Text>
        <Text style={styles.reservaText}>
          📍 Ubicación: {item.cancha?.ubicacion || 'N/A'}
        </Text>
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
      <FlatList
        data={reservas}
        renderItem={renderReserva}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
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
  reservaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reservaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reservaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  reservaDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  reservaText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  reservaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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