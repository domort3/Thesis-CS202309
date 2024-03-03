import React, { useState } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ImageCapture = () => {
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
          source={require('../../assets/brown.png')}
        >
          <View style={styles.imageContainer}>
            <View>
              <Text style={styles.title}>*CAMERA*</Text>
            </View>
          </View>
        </ImageBackground>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={25} color="white" />
        </TouchableOpacity>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.galleryButton}>
            <Text style={styles.textFont}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton}>
            <Feather name="camera" size={30} color="saddlebrown" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={TutorialPress}>
            <Feather name="help-circle" size={30} color="saddlebrown" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.tutorial, { opacity: fadeAnim }]}>
        <Text style={styles.tutorialText}>Tutorial</Text>
        <Image source={require('../../assets/correct.png')} style={styles.image}/>
        <View style={styles.separator}></View> 
        <View style={styles.imageRow}>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/incorrect.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Side View</Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/incorrect_1.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Too close</Text>
    </View>
  </View>
  <View style={styles.imageRow}>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/incorrect_2.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Incorrect Lighting</Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/incorrect_3.png')} style={styles.incImage}/>
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
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
  },

  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  image: {
    height: 80,
    width: 80,
    bottom: 10
  },

  incImage: {
    height: 75,
    width: 75,
    top: 30,
    marginBottom: 30
  },

  
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
  },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },

  bottomBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  galleryButton: {
    backgroundColor: 'transparent',
    borderColor: 'saddlebrown',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  textFont: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'saddlebrown',
  },

  cameraButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'saddlebrown',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
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

export default ImageCapture;
