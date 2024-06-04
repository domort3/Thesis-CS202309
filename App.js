import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, Modal } from "react-native";
import HomeScreen from "./src/components/HomeScreen";
import ImageCapture from "./src/components/ImageCapture";
import GalleryOpen from "./src/components/GalleryOpen";
import Settings from "./src/components/Settings";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { HelpModal } from "./src/components/HelpModal";
import { MLevelModal } from "./src/components/MLevelModal";


const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        top: -30,
        justifyContent: "center",
        alignItems: "center",
        ...styles.tabBarButtonContainer,
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

const App = () => {
  const [photo, setPhoto] = useState(null);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const [isMLevelModalVisible, setMLevelModalVisible] = useState(false);

  const changeHelpModalVisible = (bool) => {
    setHelpModalVisible(bool);
  };

  const changeMLevelModalVisible = (bool) => {
    setMLevelModalVisible(bool);
  };

  const navigateToMLevel = () => {
    setHelpModalVisible(false);
    setMLevelModalVisible(true);
  };

  const navigateToHelp = () => {
    setMLevelModalVisible(false);
    setHelpModalVisible(true);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "darkgreen",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            display: route.name === "ImageCapture" ? "none" : "flex",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: "#C6EDC3",
            position: "absolute",
            height: 50,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="home"
                size={25}
                color={focused ? "darkgreen" : "black"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Gallery"
          component={HomeScreen}
          options={{
            tabBarButton: (props) => <GalleryOpen setPhoto={setPhoto} {...props} />,
          }}
        />
        <Tab.Screen
          name="ImageCapture"
          component={ImageCapture}
          options={({ navigation }) => ({
            tabBarButton: (props) => (
              <CustomTabBarButton
                {...props}
                onPress={() => navigation.navigate("ImageCapture")}
              >
                <Feather name="camera" size={25} color="black" />
              </CustomTabBarButton>
            ),
          })}
        />
        <Tab.Screen
          name="Help"
          component={HomeScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => changeHelpModalVisible(true)}
              >
                <Feather name="info" size={27} color="black" />
                <Text style={{ color: "black", fontSize: 10 }}>Help</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="settings"
                size={25}
                color={focused ? "darkgreen" : "black"}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isHelpModalVisible}
        onRequestClose={() => changeHelpModalVisible(false)}
      >
        <HelpModal
          changeModalVisible={changeHelpModalVisible}
          setData={() => {}}
          navigateToMLevel={navigateToMLevel}
        />
      </Modal>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isMLevelModalVisible}
        onRequestClose={() => changeMLevelModalVisible(false)}
      >
        <MLevelModal
          changeModalVisible={changeMLevelModalVisible}
          setData={() => {}}
          navigateToHelp={navigateToHelp}
        />
      </Modal>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarButtonContainer: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "darkgreen",
    backgroundColor: "#E9F8E2",
    elevation: 5,
  },
  helpButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;