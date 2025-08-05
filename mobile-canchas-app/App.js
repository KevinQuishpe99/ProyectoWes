import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { authService } from './src/services/authService';

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

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar 
          style="light" 
          backgroundColor="#3498db"
          translucent={false}
        />
        <AppNavigator 
          isAuthenticated={isAuthenticated} 
          onAuthChange={handleAuthChange}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
