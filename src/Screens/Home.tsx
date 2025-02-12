import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

const Home = ({navigation}: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('CallScreen')}
        style={styles.button}>
        <Text>Call</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0093E9',
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 10,
  },
});
