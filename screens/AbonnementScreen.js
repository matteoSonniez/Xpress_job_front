import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { BACKURL } from '@env';

export default function AbonnementScreen() {
    
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Fonction pour récupérer le clientSecret et l'ID de la souscription depuis votre backend
  const fetchSubscriptionParams = async () => {
    try {
      const response = await fetch(`${BACKURL}/api/stripe/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Vous pouvez envoyer des infos supplémentaires (par exemple, userId)
        body: JSON.stringify({ userId: 123 }),
      });
      const data = await response.json();
      console.log('Réponse du serveur pour l’abonnement:', data);
      const { clientSecret, subscriptionId } = data;
      return { clientSecret, subscriptionId };
    } catch (error) {
      console.error("Erreur lors de la requête Stripe :", error);
      return { clientSecret: null, subscriptionId: null };
    }
  };

  // Initialiser la PaymentSheet pour la souscription
  const initializePaymentSheet = async () => {
    console.log("Initialisation de la souscription appelée");
    const { clientSecret, subscriptionId } = await fetchSubscriptionParams();
    if (!clientSecret) {
      Alert.alert("Erreur", "Impossible de récupérer le clientSecret pour l'abonnement.");
      return;
    }
    setClientSecret(clientSecret);
    setSubscriptionId(subscriptionId);

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      // Vous pouvez ajouter d'autres options spécifiques à la PaymentSheet si besoin
    });

    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      console.log('PaymentSheet initialisé pour l’abonnement');
    }
  };

  // Ouvrir la PaymentSheet pour confirmer l'abonnement
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Erreur de paiement`, error.message);
    } else {
      Alert.alert('Succès', 'Votre abonnement a été activé !');
      console.log('Subscription ID :', subscriptionId);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Initialiser l'abonnement" onPress={initializePaymentSheet} />
      <Button title="Confirmer l'abonnement" onPress={openPaymentSheet} disabled={!clientSecret} />
    </View>
  );
}
