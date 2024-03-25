import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import HomeScreen from "./src/components/HomeScreen";
import ImageCapture from "./src/components/ImageCapture";
import InfoScreen from "./src/components/InfoScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        top: -30, 
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.tabBarButtonContainer,
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'aquamarine',
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: { display: route.name === 'ImageCapture' ? 'none' : 'flex' },
        })}
      >
        <Tab.Screen name={'Home'} component={HomeScreen} options={{ tabBarIcon: ({ focused }) => (<Feather name={"home"} size={25} color={focused ? "cadetblue" : "black"} />) }} />
        <Tab.Screen name={'ImageCapture'} component={ImageCapture} options={({ navigation }) => ({
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() => navigation.navigate('ImageCapture')}
            >
              <Feather name={"camera"} size={25} color="white" />
            </CustomTabBarButton>
          ),
        })} />
        <Tab.Screen name={'Info'} component={InfoScreen} options={{ tabBarIcon: ({ focused }) => (<Feather name={"info"} size={25} color={focused ? "cadetblue" : "black"} />) }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBarButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'cadetblue', 
    elevation: 10, 
  },
});

export default App;