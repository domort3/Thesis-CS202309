import React from "react"
import { View, StyleSheet } from "react-native";
import HomeScreen from "./src/components/HomeScreen";
import ImageCapture from "./src/components/ImageCapture";






const App = () => {
  return (
    <View style={styles.container}>
      <ImageCapture />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default App