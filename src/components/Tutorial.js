import React from "react"
import { View, Text, Image, SafeAreaView, StyleSheet,} from 'react-native'

const Tutorial = () => {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
        <Text style={styles.title}>TUTORYAL</Text>
        <View style={styles.imageContainer}>
        <Image source={require('../../assets/coconuttop.png')} style={styles.image} />
        <Image source={require('../../assets/coconutside.png')} style={styles.image} />
        </View>
        <View style={styles.imageContainer}>
        <Image source={require('../../assets/check.png')} style={styles.marks} />
        <Image source={require('../../assets/cross.png')} style={styles.marks} />
        </View>
        <Text style={styles.bodyText}>Magandang araw sa iyo kaibigan. Para sa paggamit ng aplikasyon, 
          maaaring sundin ang tamang pagkuha ng litrato na kung saan ay makikita sa kaliwa. 
          Iwasang kumuha ng litrato tulad ng nasa kanan sapagkat ito ay maaaring magbigay ng 
          hindi wastong resulta.</Text>
      </View>
      </SafeAreaView>
      
    );
  }
  

  
  
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'lightgreen',
      flex: 1,
      alignItems: 'center',
      marginTop: 20
      
      
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
  
    imageContainer: {
      marginTop: 20,
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginBottom: 10
    },
  
    image: {
      height: 100, 
      width: 100,
      marginLeft: 10,
      marginRight: 10
    },
  
    marks: {
      height: 45,
      width: 45,
      marginLeft: 40,
      marginRight: 40
    },
  
    bodyText: {
      fontSize: 16,
      lineHeight: 24,
      color: 'black',
      textAlign: 'center',
      fontWeight: 'bold'  
    },
  })
  export default Tutorial