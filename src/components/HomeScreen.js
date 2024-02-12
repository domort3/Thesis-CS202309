import React from "react"
import { View, Text, Image, SafeAreaView, StyleSheet } from 'react-native';


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>COCOSCAN</Text>
        <Text style={styles.desc}>A Coconut Maturity Detection App</Text>

        <Image source={require('../../assets/coconut-logo.png')} style={styles.image} />
      </View>
    </SafeAreaView>
  )
}




const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgreen',
    flex: 1,
    alignItems: 'center',
    
    
    
  },
  wrapper: {
    flex: 1
  },
  title: {
    color: 'darkgreen',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 80
    
  },
  desc: {
    color: 'darkgreen',
    fontWeight: 'bold'
  },

  image: {
    height: 100, 
    width: 100,
    marginLeft: 10,
    marginRight: 10
  },


})
export default HomeScreen