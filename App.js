import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import de vos écrans
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import AuthScreen from './screens/authScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        // Ici, on considère qu'un token existant signifie que l'utilisateur est connecté.
        // Vous pouvez ajouter une vérification plus poussée si nécessaire.
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        setIsLoggedIn(false);
      }
    };

    checkUserToken();
  }, []);

  if (isLoggedIn === null) {
    // Vous pouvez afficher un écran de chargement ici pendant la vérification du token
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isLoggedIn ? "Home" : "Auth"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Accueil' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profil' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Register' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Register' }}
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ title: 'Auth' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
