import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authService } from '../services/authService';
import { useAuth } from '../../App';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await authService.getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              // Usar el contexto para cambiar el estado de autenticación
              logout();
            } catch (error) {
              console.error('Error en logout:', error);
              // Forzar logout incluso si hay error
              logout();
            }
          }
        }
      ]
    );
  };

  const formatUserData = (data) => {
    if (!data) return null;
    
    return {
      nombre: data.nombres || data.userName || 'Usuario',
      email: data.correo || data.email || 'email@ejemplo.com',
      codigo: data.codigo || 'N/A',
      rol: 'Estudiante',
      id: data.id || 'N/A'
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  const userInfo = formatUserData(userData);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <Text style={styles.userName}>{userInfo?.nombre}</Text>
          <Text style={styles.userEmail}>{userInfo?.email}</Text>
          <Text style={styles.userCode}>Código: {userInfo?.codigo}</Text>
          <Text style={styles.userRole}>{userInfo?.rol}</Text>
          <Text style={styles.userId}>ID: {userInfo?.id}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Información de la Cuenta</Text>
            <Text style={styles.infoText}>
              Tu cuenta está activa y puedes acceder a todas las funcionalidades de la aplicación móvil.
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Espacio para los tabs
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  userCode: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 