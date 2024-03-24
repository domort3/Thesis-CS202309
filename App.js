import React from "react"
import { View, StyleSheet } from "react-native";
import HomeScreen from "./src/components/HomeScreen";
import ImageCapture from "./src/components/ImageCapture";
import InfoScreen from "./src/components/InfoScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'aquamarine',
          tabBarInactiveTintColor: 'grey'
        }}
      >
        <Tab.Screen name={'Info'} component={InfoScreen} options={{ tabBarIcon: ({focused}) => ( <Feather name={"info"} size={25} color={focused ? "cadetblue" : "black"} />) }} />
        <Tab.Screen name={'Home'} component={HomeScreen} options={{ tabBarIcon: ({focused}) => ( <Feather name={"home"} size={25} color={focused ? "cadetblue" : "black"} />) }} />
        <Tab.Screen name={'Camera'} component={ImageCapture} options={{ tabBarIcon: ({focused}) => ( <Feather name={"camera"} size={25} color={focused ? "cadetblue" : "black"} />) }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default App