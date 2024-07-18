import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const GalleryOpen = ({ setPhoto }) => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasGalleryPermission(status === "granted");

    if (status !== "granted") {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status === "granted");
    })();
  }, []);

  return (
    <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryPress}>
      <Feather name="image" size={25} color="black" />
      <Text style={styles.galleryButtonText}>Gallery</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  galleryButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    bottom: 3,
    marginRight: 10,
  },
  galleryButtonText: {
    fontSize: 10,
    marginTop: 5,
    color: "black",
  },
});

export default GalleryOpen;