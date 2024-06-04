import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

const WIDTH = Dimensions.get("window").width;
const HEIGHT_MODAL = 680;

const MLevelModal = (props) => {
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
          <Text style={styles.maturityHeader}>Maturity Level</Text>
          <Image
            source={require("../../assets/separator.png")}
            style={styles.separator}
          />
          <Text style={styles.maturityDesc}>
            Coconuts have three different maturity levels.
          </Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handlePageChange}
            style={styles.imageScrollView}
          >
            <Image source={require("../../assets/01.png")} style={styles.image} />
            <Image source={require("../../assets/02.png")} style={styles.image} />
            <Image source={require("../../assets/03.png")} style={styles.image} />
            
          </ScrollView>
          <View style={styles.pagination}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentPage === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
          <View>
          <Text style={styles.maturityDesc}>
            Pre-mature coconuts are tiny, unripe, green coconuts lacking of maturity.
          </Text>

          <Text style={styles.maturityDesc}>
            Mature coconuts are edible coconuts with firm flesh and sweet water.
          </Text>

          <Text style={styles.maturityDesc}>
            Overmature coconuts are aged and dried coconuts with tough husk and possible spoiled contents.
          </Text>
          </View>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => {
              closeModal(false, "Close");
              props.navigateToHelp();
            }}
          >
            <Feather name="chevron-left" size={25} color="darkgreen" />
            <Text style={styles.navigationButtonText}>Tutorial</Text>
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
    width: WIDTH -30,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 15,
  },
  textView: {
    flex: 1,
    alignItems: "center",
  },
  maturityHeader: {
    margin: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "darkgreen",
    right: 70
  },
  maturityDesc: {
    color: "darkgreen",
    margin: 10,
    fontSize: 14,
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
    right: 70,
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

export { MLevelModal };