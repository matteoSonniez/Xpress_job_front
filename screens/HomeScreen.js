import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

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

  const handleChange = (field, value) => {
    setUserForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      // On envoie les données au format JSON
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
      <View style={styles.section}>
        <Text style={styles.title}>Inscription</Text>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={userForm.firstName}
          onChangeText={(text) => handleChange('firstName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={userForm.lastName}
          onChangeText={(text) => handleChange('lastName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userForm.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={userForm.phone}
          onChangeText={(text) => handleChange('phone', text)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={userForm.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
        />
        <Button title="S'inscrire" onPress={handleRegister} />
      </View>
      <Button
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
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