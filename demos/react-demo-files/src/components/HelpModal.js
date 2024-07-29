import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

const WIDTH = Dimensions.get("window").width;
const HEIGHT_MODAL = 680;

const HelpModal = (props) => {
  const [currentPage, setCurrentPage] = useState(0);

  const closeModal = (bool, data) => {
    props.changeModalVisible(bool);
    props.setData(data);
  };

  const handlePageChange = (event) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / (WIDTH - 60));
    setCurrentPage(page);
  };

  return (
    <TouchableOpacity disabled={true} style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.textView}>
          <Text style={styles.helpHeader}>Tutorial</Text>
          <Image
            source={require("../../assets/separator.png")}
            style={styles.separator}
          />
          <Text style={styles.helpDesc}>
            Cocoscan helps you detect the maturity level of your coconuts.
          </Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handlePageChange}
            style={styles.imageScrollView}
          >
            <Image source={require("../../assets/04.png")} style={styles.image} />
            <Image source={require("../../assets/05.png")} style={styles.image} />
            <Image source={require("../../assets/06.png")} style={styles.image} />
            <Image source={require("../../assets/07.png")} style={styles.image} />
          </ScrollView>
          <View style={styles.pagination}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentPage === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
          
          <Text style={styles.helpBody}>
            The application camera can only accept the pictures that are taken in the correct format. The picture with a check is the ideal format for taking the picture.
          </Text>
          
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => {
              closeModal(false, "Close");
              props.navigateToMLevel();
            }}
          >
            <Text style={styles.navigationButtonText}>Maturity Levels</Text>
            <Feather name="chevron-right" size={25} color="darkgreen" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonStyle}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => closeModal(false, "Cancel")}
          >
            <Feather name="x-circle" size={24} color="darkgreen" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: 10
  },
  modal: {
    height: HEIGHT_MODAL,
    width: WIDTH - 30,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 15,
  },
  textView: {
    flex: 1,
    alignItems: "center",
  },
  helpHeader: {
    margin: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "darkgreen",
    right: 110,
  },
  helpDesc: {
    color: "darkgreen",
    margin: 15,
    fontSize: 14,
  },
  helpBody: {
    color: "darkgreen",
    margin: 15,
    fontSize: 14,
    bottom: 50,
  },
  imageScrollView: {
    height: 210,
  },
  image: {
    height: 260,
    width: WIDTH - 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  pagination: {
    bottom: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "lightgray",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "darkgreen",
  },
  buttonStyle: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  navigationButton: {
    flexDirection: "row",
    padding: 12,
    width: 150,
    borderRadius: 10,
    marginTop: 20,
    left: 60,
    bottom: 10,
  },
  navigationButtonText: {
    color: "darkgreen",
    fontWeight: "bold",
    fontSize: 16,
  },

  separator: {
    right: 50
  }
});

export { HelpModal };