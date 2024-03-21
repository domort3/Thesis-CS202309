import React from "react"
import { View, StyleSheet } from "react-native";
import HomeScreen from "./src/components/HomeScreen";
import ImageCapture from "./src/components/ImageCapture";
import InfoScreen from "./src/components/InfoScreen";







const App = () => {
  return (
    <View style={styles.container}>
      <InfoScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default App