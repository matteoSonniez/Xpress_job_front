import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKURL } from '@env';

const RegisterScreen = ({ navigation }) => {
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (field, value) => {
    setUserForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const checkToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      console.log("Token stocké :", storedToken);
      Alert.alert("Token stocké", storedToken || "Aucun token trouvé");
    } catch (error) {
      console.error("Erreur lors de la récupération du token :", error);
    }
  };

  const handleRegister = async () => {
    console.log("testtttttt", BACKURL)

    try {
      
      const response = await fetch(`${BACKURL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();
      if (response.ok) {
        // Stocker le token dans AsyncStorage
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }
        Alert.alert('Succès', data.message || 'Inscription réussie.');
        // Réinitialiser le formulaire
        setUserForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
        });
        // Redirection vers le profil si nécessaire
        // navigation.navigate('Profile');
      } else {
        Alert.alert('Erreur', data.message || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', error.message);
    }
  };

  const handleGetUser = async () => {
    try {
      // Récupérer le token stocké
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Erreur", "Aucun token trouvé. Veuillez vous inscrire ou vous connecter.");
        return;
      }

      // Faire la requête à l'endpoint /get-user avec le token dans le header Authorization
      const response = await fetch(`${process.env.BACKURL}/api/user/get-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Données utilisateur :", data.user);
        Alert.alert("Données utilisateur", JSON.stringify(data.user, null, 2));
      } else {
        Alert.alert("Erreur", data.message || "Impossible de récupérer les données utilisateur.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Check Token" onPress={checkToken} />
      <Button title="Récupérer mes données" onPress={handleGetUser} />
    </View>
  );
};

export default RegisterScreen;

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
