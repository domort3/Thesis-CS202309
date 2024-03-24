import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, StatusBar, ImageBackground } from 'react-native';
import InfoItems from './InfoItems';
import slides from './slides';
import Paginator from './Paginator';

const InfoScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  });

  return (
    <ImageBackground source={require('../../assets/green.png')} style={styles.background}>
      <StatusBar backgroundColor="saddlebrown" />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={({ item }) => <InfoItems item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged.current}
        />
        <Paginator data={slides} currentIndex={currentIndex} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default InfoScreen;