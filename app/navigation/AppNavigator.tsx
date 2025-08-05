
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LetsGoScreen from '../screens/auth/LetsGoScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import HomeTabs from './HomeTabs';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      ) : (
        <>
          <Stack.Screen name="LetsGo" component={LetsGoScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
