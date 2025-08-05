import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar pantallas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isAuthenticated, onAuthChange }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            initialParams={{ onAuthChange }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={{ onAuthChange }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              initialParams={{ onAuthChange }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 