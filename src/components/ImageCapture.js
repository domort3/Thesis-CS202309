import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library'
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

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
    <View style={styles.bottomBar}>
    <TouchableOpacity onPress={handleGalleryPress}>
        <View style={styles.galleryButton}>
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.cameraButton}>
        <Ionicons name="camera" size={36} color="saddlebrown" onPress={takePic} />
      </View>
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
    justifyContent: 'flex-start', 
    paddingHorizontal: 25, 
  },

  cameraButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 1,
    borderColor: "saddlebrown",
    borderRadius: 50, 
    padding: 10, 
    marginLeft: 60,
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

  preview: {
    alignSelf: 'stretch',
    flex: 1
  }

})