import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importar pantallas
import ReservasScreen from '../screens/ReservasScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ route }) => {
  const { onAuthChange } = route.params || {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mis Reservas') {
              iconName = focused ? '📅' : '📅';
            } else if (route.name === 'Perfil') {
              iconName = focused ? '👤' : '👤';
            }

            return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#7f8c8d',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 10,
            height: Platform.OS === 'ios' ? 90 : 70,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 5,
          },
          headerStyle: {
            backgroundColor: '#3498db',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerSafeAreaInsets: { top: 0 },
        })}
      >
        <Tab.Screen 
          name="Mis Reservas" 
          component={ReservasScreen}
          options={{
            title: 'Mis Reservas',
          }}
        />
        <Tab.Screen 
          name="Perfil" 
          component={ProfileScreen}
          initialParams={{ onAuthChange }}
          options={{
            title: 'Mi Perfil',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default MainTabNavigator; 