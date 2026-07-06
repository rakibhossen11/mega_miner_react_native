import 'react-native-gesture-handler';
import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#090d16" />
        <AppNavigator />
        {/* 🔮 গ্লোবাল টোস্ট কনফিগারেশন */}
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}

// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
