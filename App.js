// import 'react-native-gesture-handler';
import React from "react";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
// import { store } from "./src/store/store";
import { store, persistor } from "./src/redux/store"; // 👈 persistor ইমপোর্ট করলাম
import { PersistGate } from 'redux-persist/integration/react'; // 👈 PersistGate ইমপোর্ট করলাম
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

// ⏳ অ্যাপ যখন মেমোরি থেকে ডাটা লোড করবে, তখন ব্যাকগ্রাউন্ডে দেখানোর জন্য একটি সিম্পল ডার্ক লোডার
const LoadingScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#090d16', justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#00ff00" />
  </View>
);

export default function App() {
  return (
    <Provider store={store}>
      {/* 🛡️ PersistGate নিশ্চিত করবে লোকাল মেমোরি থেকে ডাটা রেডাক্সে ব্যাক আসার পরই যেন অ্যাপ স্ক্রিন খোলে */}
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#090d16" />
          <AppNavigator />
          {/* 🔮 গ্লোবাল টোস্ট কনফিগারেশন */}
          <Toast />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}


// import 'react-native-gesture-handler';
// import React from "react";
// import { StatusBar } from "react-native";
// import { Provider } from "react-redux";
// // import { store } from "./src/store/store";
// import { store } from "./src/redux/store";
// import { NavigationContainer } from "@react-navigation/native";
// import AppNavigator from "./src/navigation/AppNavigator";
// import Toast from "react-native-toast-message";
// import { SafeAreaView } from "react-native-safe-area-context";


// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <StatusBar barStyle="light-content" backgroundColor="#090d16" />
//         <AppNavigator />
//         {/* 🔮 গ্লোবাল টোস্ট কনফিগারেশন */}
//         <Toast />
//       </NavigationContainer>
//     </Provider>
//   );
// }

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
