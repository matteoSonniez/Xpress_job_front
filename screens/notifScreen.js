import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configuration du comportement des notifications en avant-plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotifScreen = ({ navigation }) => {
  useEffect(() => {
    // Demande la permission pour afficher les notifications
    async function requestPermission() {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("Notification permission status:", status);
      if (status !== 'granted') {
        alert('Permission pour les notifications refusée!');
      }
    }
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Notifications</Text>
      <Button
        title="Test Notification Locale"
        onPress={async () => {
          console.log("Planification d'une notification locale dans 5s...");
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Notification Locale",
              body: "Ceci est un test de notification locale!",
            },
            trigger: { seconds: 5 },
          });
        }}
      />
    </View>
  );
};

export default NotifScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
