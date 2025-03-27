import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, View, ActivityIndicator } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";

import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthScreen from "./screens/authScreen";
import NotifScreen from "./screens/notifScreen";
import StripeScreen from "./screens/StripeScreen";
import AbonnementScreen from "./screens/AbonnementScreen";

import { createStackNavigator } from "@react-navigation/stack";
//import * as Notifications from "expo-notifications";

// Configure le comportement des notifications (affichage en avant-plan, etc.)
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// // Fonction pour demander la permission de notification (locales uniquement)
// async function requestNotificationPermission() {
//   console.log("Demande de permission pour les notifications locales...");
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   console.log("existingStatus:", existingStatus);
//   let finalStatus = existingStatus;

//   // Si aucune permission n'est donnée, demande-la
//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//     console.log("Après demande, status:", finalStatus);
//   }

//   if (finalStatus !== "granted") {
//     alert("Permission pour les notifications locales refusée!");
//     return;
//   }

//   // Configuration spécifique pour Android (canaux de notification)
//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }
// }

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // état pour gérer le chargement
  const [notification, setNotification] = useState(null);

  // useRef pour stocker les subscriptions de notifications
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    // Vérifie si un token d'authentification est stocké
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("the tokennnnnn", token);
        // Si token existe (et n'est pas une chaîne vide ou null), l'utilisateur est connecté
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false); // La vérification est terminée
      }
    };

    checkUserToken();

    // Demande la permission pour les notifications locales
    
    //requestNotificationPermission();

    // Listener pour recevoir les notifications quand l'app est en avant-plan
    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notif) => {
    //     setNotification(notif);
    //     console.log("Notification reçue en avant-plan:", notif);
    //   });

    // // Listener pour gérer les réponses aux notifications (quand l'utilisateur clique dessus)
    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log("Réponse à la notification:", response);
    //   });

    // Nettoyage des listeners au démontage
    // return () => {
    //   Notifications.removeNotificationSubscription(
    //     notificationListener.current
    //   );
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  // Tant que la vérification du token est en cours, affichez un indicateur de chargement
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StripeProvider publishableKey="pk_test_51R7D6gCZA9KIcchBEMQt0tA4XJ0GX2pjVs40Y0rtjzdGpZietlmry8bAzc1WtZXtL0XG94gz1aes3FaGbNb4d15q00YYqenHjH">
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Accueil" }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Profil" }}
              />
              <Stack.Screen
                name="Notif"
                component={NotifScreen}
                options={{ title: "Notif" }}
              />
              <Stack.Screen
                name="Stripe"
                component={StripeScreen}
                options={{ title: "Stripe" }}
              />
              <Stack.Screen
                name="Abonnement"
                component={AbonnementScreen}
                options={{ title: "Abonnement" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {(props) => (
                  <RegisterScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ title: "Auth" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}
