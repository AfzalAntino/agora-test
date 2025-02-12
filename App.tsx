import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  NativeModules,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CallScreen from './src/Screens/CallScreen';
import Home from './src/Screens/Home';
import Login from './src/Screens/Login';
const {MyMathModule} = NativeModules;

const Stack = createNativeStackNavigator();
const linking = {
  prefixes: ['agora://', 'http://agora.com', 'https://xyz.in', 'https:afz.c'],
  config: {
    screens: {
      Home: 'home',
      CallScreen: 'call/:id',
    },
  },
};

const App = () => {
  const handleTheAddition = async () => {
    // const res = await MyMathModule?.add(2, 3);
    // const res2 = await MyMathModule?.sub(2, 3);
    // console.log('Addition Result:', res);
    // console.log('Subtraction Result:', res2);
  };

  React.useEffect(() => {
    handleTheAddition();
  }, []);

  const fallbackComp = (
    <View style={styles.button}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );

  return (
    <>
      <Text>Say Hello</Text>
      <NavigationContainer linking={linking} fallback={fallbackComp}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          {/* <Stack.Screen name="CallScreen" component={CallScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
