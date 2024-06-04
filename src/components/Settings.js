import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";

const Settings = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()}>
      <Feather name="arrow-left" size={20} color="darkgreen" />
      <Text style={styles.header}>Settings</Text>
      </TouchableOpacity>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <TouchableOpacity style={styles.item} onPress={() => { /* INSERT CHANGE THEME COMPONENT*/ }}>
          <Text style={styles.itemText}>Theme Settings</Text>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { /* INSERT CHANGE LANGUAGE COMPONENT*/ }}>
          <Text style={styles.itemText}>Language Settings</Text>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy and Security</Text>
        <TouchableOpacity style={styles.item} onPress={() => { /* INSERT PERMISSIONS COMPONETN */ }}>
          <Text style={styles.itemText}>Manage Permissions</Text>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F8E2",
  },
  headerContainer: {
    marginTop: 15,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    left: 8,
    bottom: 5,
    color: "darkgreen",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "darkgreen",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: "black",
  },
});

export default Settings;