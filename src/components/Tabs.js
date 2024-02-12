import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Feather } from '@expo/vector-icons'
import HomeScreen from './HomeScreen';
import Tutorial from './Tutorial';
import ImageUpload from './ImageUpload';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return(
        <NavigationContainer>
      <Tab.Navigator initialRouteName="Home" screenOptions={{tabBarActiveTintColor: 'darkgreen', tabBarInactiveTintColor: 'grey'}}>
        <Tab.Screen name="Tutorial" component={Tutorial} options={{ tabBarIcon: ({ focused }) => <Feather name={'alert-circle'} size={25} color={focused ? 'lightgreen' : 'black'} />, headerShown: false }}/>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }) => <Feather name={'home'} size={25} color={focused ? 'lightgreen' : 'black'} />, headerShown: false }} />
        <Tab.Screen name="Image" component={ImageUpload} options={{ tabBarIcon: ({ focused }) => <Feather name={'camera'} size={25} color={focused ? 'lightgreen' : 'black'} />, headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>

    )
}

export default Tabs;