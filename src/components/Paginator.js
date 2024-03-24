import React from 'react';
import { View, StyleSheet } from 'react-native';

const Paginator = ({ data, currentIndex }) => {
  return (
    <View style={styles.container}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? 'cadetblue' : 'lightgray' },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    bottom: 20,
  },
});

export default Paginator;