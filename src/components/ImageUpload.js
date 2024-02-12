import React from "react"
import { View, Text, Image, Button, StyleSheet,} from 'react-native';
import ImagePicker from 'react-native-image-picker'

const ImageUpload = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Image Upload</Text>
        <Button title="Take Photo" />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'lightgreen',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', // Center both horizontally and vertically
      marginTop: 20,
    },
    title: {
      color: 'darkgreen',
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 10, // Adjust the marginTop as needed
    },
  });
  
  export default ImageUpload;