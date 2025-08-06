import React, { useState, useEffect, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { authService } from './src/services/authService';

// Crear contexto de autenticación
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const handleAuthChange = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  const authValue = {
    isAuthenticated,
    login: () => handleAuthChange(true),
    logout: () => handleAuthChange(false),
  };

  return (
    <AuthContext.Provider value={authValue}>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar 
              style="light" 
              backgroundColor="#3498db"
              translucent={false}
            />
            <AppNavigator />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
