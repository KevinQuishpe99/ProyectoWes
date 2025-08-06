import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import { useAuth } from '../../App';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
        />
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 