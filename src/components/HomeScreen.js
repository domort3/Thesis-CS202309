import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";
import { HelpModal } from "./HelpModal";
import * as ImagePicker from "expo-image-picker";

const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setisModalVisible] = useState(false);
  const [chooseData, setchooseData] = useState();
  const changeModalVisible = (bool) => {
    setisModalVisible(bool);
  };

  const setData = (data) => {
    setchooseData(data);
  };

  const [photo, setPhoto] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasGalleryPermission(status === "granted");

    if (status !== "granted") {
      alert("Permission to access camera roll is required!");
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
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status === "granted");
    })();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.imgBackground}
          resizeMode="cover"
          source={require("../../assets/teagreen.jpg")}
        >
          <StatusBar backgroundColor="#E9F8E2" />
          <View style={styles.overlay}>
            <Image
              source={require("../../assets/coconut-logo.png")}
              style={styles.image}
            />
            <Text style={styles.title}>COCOSCAN</Text>
            <Text style={styles.desc}>A Coconut Maturity Detection App</Text>

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate("ImageCapture")}
            >
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleGalleryPress}
            >
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>

            
            <Modal
              transparent={true}
              animationType="fade"
              visible={isModalVisible}
              nRequestClose={() => changeModalVisible(false)}
            >
              <HelpModal
                changeModalVisible={changeModalVisible}
                setData={setData}
              />
            </Modal>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
  desc: {
    color: "black",
    fontWeight: "bold",
  },
  image: {
    height: 210,
    width: 181,
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingBottom: 120,
  },
  imgBackground: {
    width: "100%",
    height: "100%",
    flex: 1,
    position: "absolute",
  },
  buttonStyle: {
    backgroundColor: "#C6EDC3",
    padding: 12,
    width: 150,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "darkgreen",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;
