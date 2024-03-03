import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, ImageBackground } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.imgBackground}
          resizeMode='cover'
          source={require('../../assets/brown.png')}
        >
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/coconut-logo.png')} style={styles.image}/>
            <View style={styles.overlay}>
              <Text style={styles.title}>COCOSCAN</Text>
              <Text style={styles.desc}>A Coconut Maturity Detection App</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrapper: {
    flex: 1,
  },
  title: {
    color: 'saddlebrown',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
  },
  desc: {
    color: 'saddlebrown',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  image: {
    height: 100,
    width: 100,
    marginBottom: 20,
    bottom: 120
  },

  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
    width: '100%',
    height: '100%',
  },

  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
  }
});

export default HomeScreen;