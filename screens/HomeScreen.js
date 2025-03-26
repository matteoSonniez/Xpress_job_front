import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {

  const [userInfo, setUserInfo] = useState(null);
  
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  // On utilise ici le iOS Client ID que tu as créé dans la Google Cloud Console
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '808203207821-t34gv4c7rlefgrvt07pru5c6qerjvfqi.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  };
  const showToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log('The token', token);
    } catch (error) {
      console.error('Erreur lors de la recup du token', error);
    }
  };

  const handleChange = (field, value) => {
    setUserForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${process.env.BACKURL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });
      

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', data.message || 'Inscription réussie.');
        // Réinitialiser le formulaire
        setUserForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
        });
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de l\'inscription.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', error.message);
    }
  };

  // Gère la réponse du flux OAuth
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      setUserInfo(authentication);
    }
  }, [response]);

  // Lance la demande d'authentification
  const handleGoogleSignIn = async () => {
    await promptAsync();
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userInfo ? (
        <Text>Connecté avec Google. Token : {userInfo.accessToken}</Text>
      ) : (
        <Button
          disabled={!request}
          title="Se connecter avec Google (iOS OAuth)"
          onPress={handleGoogleSignIn}
        />
      )}
      <Button
        title="remove token"
        onPress={() => removeToken()}
      />
      <Button
        title="show token"
        onPress={() => showToken()}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    section: {
      marginTop: 20,
      width: '90%',
      padding: 10,
      backgroundColor: '#f2f2f2',
      borderRadius: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 8,
      marginBottom: 10,
      borderRadius: 4,
    },
  });