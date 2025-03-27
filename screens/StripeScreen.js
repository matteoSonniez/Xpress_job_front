import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { BACKURL } from '@env';

export default function StripeScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState(null);

  // Fonction pour récupérer le clientSecret depuis votre backend
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${BACKURL}/api/stripe/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1099, currency: 'eur' }),
      });
      const data = await response.json();
      console.log('Réponse du serveur Stripe:', data);
      const { clientSecret } = data;
      return clientSecret;
    } catch (error) {
      console.error("Erreur lors de la requête Stripe :", error);
      return null;
    }
  };
  

  // Initialiser la PaymentSheet
  const initializePaymentSheet = async () => {
    console.log("called");
    const clientSecret = await fetchPaymentSheetParams();
    setClientSecret(clientSecret);
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      // Vous pouvez ajouter d'autres options pour personnaliser la PaymentSheet
    });
    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      console.log('PaymentSheet initialisé');
    }
  };

  // Ouvrir la PaymentSheet
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Erreur de paiement`, error.message);
    } else {
      Alert.alert('Succès', 'Votre paiement a été confirmé!');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Initialiser le paiement" onPress={initializePaymentSheet} />
      <Button title="Payer" onPress={openPaymentSheet} disabled={!clientSecret} />
    </View>
  );
}
