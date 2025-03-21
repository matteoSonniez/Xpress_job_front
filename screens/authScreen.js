import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Video } from 'expo-av';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AuthScreen = () => {
  // Permet de savoir quelle box est active ("box1", "box2", ou null)
  const [activeBox, setActiveBox] = useState(null);

  // Animations pour Box 1
  const box1Anim = useRef(new Animated.Value(0)).current;
  const newView1Anim = useRef(new Animated.Value(screenWidth)).current; // démarre hors écran à droite

  // Animations pour Box 2
  const box2Anim = useRef(new Animated.Value(0)).current;
  const newView2Anim = useRef(new Animated.Value(-screenWidth)).current; // démarre hors écran à gauche

  // Animation pour Box 1 : Box glisse à gauche, nouvelle vue apparaît de la droite
  const handleBox1Press = () => {
    setActiveBox('box1');
    Animated.parallel([
      Animated.timing(box1Anim, {
        toValue: -screenWidth, // Box 1 sort vers la gauche
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(newView1Anim, {
        toValue: 0, // Nouvelle vue glisse depuis la droite
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animation pour Box 2 : Box glisse à droite, nouvelle vue apparaît de la gauche
  const handleBox2Press = () => {
    setActiveBox('box2');
    Animated.parallel([
      Animated.timing(box2Anim, {
        toValue: screenWidth, // Box 2 sort vers la droite
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(newView2Anim, {
        toValue: 0, // Nouvelle vue glisse depuis la gauche
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Bouton retour pour la vue de Box 1
  const handleBackPressBox1 = () => {
    Animated.parallel([
      Animated.timing(box1Anim, {
        toValue: 0, // Remet Box 1 en place
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(newView1Anim, {
        toValue: screenWidth, // Fait sortir la vue vers la droite
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveBox(null);
    });
  };

  // Bouton retour pour la vue de Box 2
  const handleBackPressBox2 = () => {
    Animated.parallel([
      Animated.timing(box2Anim, {
        toValue: 0, // Remet Box 2 en place
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(newView2Anim, {
        toValue: -screenWidth, // Fait sortir la vue vers la gauche
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveBox(null);
    });
  };

  return (
    <View style={styles.container}>
      {/* Vidéo en fond depuis un fichier local */}
      <Video
        source={require('../img/authvideo3.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
      />

      {/* Overlay sombre pour assombrir la vidéo */}
      <View style={styles.darkOverlay} />

      {/* Overlay avec les deux boîtes placées en bas */}
      <View style={styles.overlay}>
        <TouchableOpacity onPress={handleBox1Press}>
          <Animated.View style={[styles.box, { transform: [{ translateX: box1Anim }] }]}>
            <Text>Box 1</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBox2Press}>
          <Animated.View style={[styles.box, { transform: [{ translateX: box2Anim }] }]}>
            <Text>Box 2</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Nouvelle vue plein écran pour Box 1 */}
      {activeBox === 'box1' && (
        <Animated.View style={[styles.fullScreenOverlay, { transform: [{ translateX: newView1Anim }] }]}>
          <TouchableOpacity onPress={handleBackPressBox1} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.fullScreenText}>Nouvelle vue Box 1</Text>
        </Animated.View>
      )}

      {/* Nouvelle vue plein écran pour Box 2 */}
      {activeBox === 'box2' && (
        <Animated.View style={[styles.fullScreenOverlay, { transform: [{ translateX: newView2Anim }] }]}>
          <TouchableOpacity onPress={handleBackPressBox2} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.fullScreenText}>Nouvelle vue Box 2</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Ajustez l'opacité selon vos besoins
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end', // Place les boxes en bas
    alignItems: 'center',
    paddingBottom: 50,
  },
  box: {
    width: 250,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenText: {
    color: '#fff',
    fontSize: 24,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
