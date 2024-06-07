import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Feather } from "@expo/vector-icons";

export default function App({ navigation }) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>Permission for camera not granted. Please change in settings.</Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
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
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#D0F0C0" />
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={25} color="white" />
      </TouchableOpacity>
      <View style={styles.outerBorder}>
        <TouchableOpacity style={styles.innerBorder} onPress={takePic}>
          <View style={styles.cameraButton} />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },

  outerBorder: {
    position: "absolute",
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 45,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "white",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
