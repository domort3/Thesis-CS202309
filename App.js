import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, SafeAreaView, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library'
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

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

  const tutorialPress = () => {
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

  const handleGalleryPress = () => {
    
    console.log("Gallery button pressed");
  };

  useEffect(() => {
    (async () => {
       const cameraPermission = await Camera.requestCameraPermissionsAsync();
       const MediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
       setHasCameraPermission(cameraPermission.status === "granted");
       setHasMediaLibraryPermission(MediaLibraryPermission.status === "granted")
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);

  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };
    
    let savePhoto = () => {

      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style = {styles.container}>
        <Image style = {styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64}} />
        <Button title="Share" onPress = {sharePic} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress = {savePhoto} /> : undefined }
        <Button title="Discard" onPress = {() => setPhoto(undefined)} />

      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color="white" />
        </TouchableOpacity>

    <View style={styles.bottomBar}>
    <TouchableOpacity onPress={handleGalleryPress}>
        <View style={styles.galleryButton}>
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.cameraButton}>
        <Ionicons name="camera" size={36} color="saddlebrown" onPress={takePic} />
      </View>
      <TouchableOpacity onPress={tutorialPress}>
        <View style={styles.questionMark}>
          <Ionicons name="help-circle-outline" size={36} color="saddlebrown" />
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.tutorial, { opacity: fadeAnim }]}>
        <Text style={styles.tutorialText}>Tutorial</Text>
        <Image source={require('./assets/correct.png')} style={styles.image}/>
        <View style={styles.separator}></View> 
        <View style={styles.imageRow}>
    <View style={styles.imageContainer}>
      <Image source={require('./assets/incorrect.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Side View</Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={require('./assets/incorrect_1.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Too close</Text>
    </View>
  </View>
  <View style={styles.imageRow}>
    <View style={styles.imageContainer}>
      <Image source={require('./assets/incorrect_2.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Incorrect Lighting</Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={require('./assets/incorrect_3.png')} style={styles.incImage}/>
      <Text style={styles.imageText}>Blurry</Text>
    </View>
  </View>
        
          <TouchableOpacity style={styles.closeButton} onPress={closePress}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
    </View>
  </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 20, 
    paddingTop: 5,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
  },

  cameraButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 1,
    borderColor: "saddlebrown",
    borderRadius: 50, 
    padding: 10, 
  },

  galleryButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "saddlebrown",
    borderWidth: 1,
    borderRadius: 5,
  },

  galleryButtonText: {
    color: 'saddlebrown',
    fontWeight: 'bold',
    fontSize: 12,
  },

  questionMark: {
    padding: 10,
    color: "saddlebrown"
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

  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
  },

  preview: {
    alignSelf: 'stretch',
    flex: 1
  }

})
