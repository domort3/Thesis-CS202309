import React, { useState } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, ImageBackground, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {

  const [showTutorial, setShowTutorial] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); 

  const toggleTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1, 
      duration: 500, 
      useNativeDriver: true, 
    }).start(); 
  };

  const TutorialPress = () => {
    fadeIn(); 
    setShowTutorial(true); 
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, 
      duration: 500, 
      useNativeDriver: true, 
    }).start(); 
  };

  const closePress = () => {
    fadeOut(); 
    setShowTutorial(false); 
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.imgBackground}
          resizeMode='cover'
          source={require('../../assets/green.png')}
        >
          <StatusBar backgroundColor="aquamarine" />
          <View style={styles.imageContainer}>
          
            <View style={styles.overlay}>
              <Image source={require('../../assets/coconut-logo.png')} style={styles.image}/>
              <Text style={styles.title}>COCOSCAN</Text>
              <Text style={styles.desc}>A Coconut Maturity Detection App</Text>
            </View>
          </View>
          <TouchableOpacity onPress={TutorialPress}>
            <Ionicons name="help-circle-outline" style={styles.questionIcon} size={30} color="white" />
          </TouchableOpacity>
        </ImageBackground>
        <Animated.View style={[styles.tutorial, { opacity: fadeAnim }]}>
        <Text style={styles.tutorialText}>Tutorial</Text>
        <Image source={require('../../assets/correct.png')} style={styles.corImage}/>
        <View style={styles.separator}></View> 
        <View style={styles.imageRow}>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/sideview.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Side View</Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/tooclose.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Too close</Text>
    </View>
  </View>
  <View style={styles.imageRow}>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/lighting.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Incorrect Lighting</Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/blurry.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Blurry</Text>
    </View>
  </View>
        
          <TouchableOpacity style={styles.closeButton} onPress={closePress}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
    
      wrapper: {
        flex: 1,
      },
      title: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        position: 'absolute', 
        top: '50%', 
        transform: [{ translateY: 330 }], 
      },
      desc: {
        color: 'black',
        fontWeight: 'bold',
        position: 'absolute', 
        top: '50%', 
        transform: [{ translateY: 370 }], 
      },
    
      image: {
        height: 100,
        width: 100,
        position: 'absolute',
        top: '50%', 
        transform: [{ translateY: 235 }], 
      },
    
      imgContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      },
    
      overlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50,
        width: '100%',
        height: '100%',
        zIndex: 1, 
      },
    
      imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1,
        position: 'absolute',
      },
    
      questionIcon: {
        position: 'absolute',
        top: 40,
        right: 20,
      },
    
      imageContainer: {
        
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      },
    
      corImage: {
        height: 80,
        width: 80,
        bottom: 10
      },
    
      incImage: {
        height: 75,
        width: 85,
        top: 30,
        marginBottom: 30
      },
    
      tutorial: {
        position: 'absolute',
        backgroundColor: '#333333',
        borderWidth: 1,
        borderRadius: 30,
        width: '80%',
        height: 500,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        bottom: 100,
      },
    
      closeButton: {
        backgroundColor: 'saddlebrown',
        padding: 10,
        borderRadius: 5,
        top: 20
      },
    
      closeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
      },
    
      tutorialText: {
        color: 'white',
        position: 'absolute',
        fontSize: 20,
        fontWeight: 'bold',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -35 }, { translateY: -230 }],
        zIndex: 2, 
      },
    
      imageContainer: {
        alignItems: 'center',
      },
      imageText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
      },
    
      separator: {
        position: 'absolute',
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        top: 160
      },
    
      imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
    });

export default HomeScreen;