// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { useSelector } from "react-redux";
// import { StyleSheet, Platform } from "react-native";
// import { Activity, Users, Wallet, Home as HomeIcon } from "lucide-react-native";

// import LoginScreen from "../screens/LoginScreen";
// import HomeScreen from "../screens/HomeScreen"; // হোম স্ক্রিন
// import ReferralScreen from "../screens/ReferralScreen";
// import WithdrawScreen from "../screens/WithdrawScreen";

// const Tab = createBottomTabNavigator();

// export default function AppNavigator() {
//   const isAuthenticated = useSelector((state) => state.wallet.isAuthenticated);

//   if (!isAuthenticated) {
//     return <LoginScreen />;
//   }

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#f59e0b",
//         tabBarInactiveTintColor: "#64748b",
//         tabBarStyle: styles.tabBar,
//         tabBarLabelStyle: styles.tabLabel,
//       }}
//     >
//       <Tab.Screen 
//         name="Home" 
//         component={HomeScreen} 
//         options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} size={20} /> }} 
//       />
//       {/* <Tab.Screen 
//         name="Mining" 
//         component={MiningScreen} 
//         options={{ tabBarIcon: ({ color }) => <Activity color={color} size={20} /> }} 
//       /> */}
//       <Tab.Screen 
//         name="Network" 
//         component={ReferralScreen} 
//         options={{ tabBarIcon: ({ color }) => <Users color={color} size={20} /> }} 
//       />
//       <Tab.Screen 
//         name="Finance" 
//         component={WithdrawScreen} 
//         options={{ tabBarIcon: ({ color }) => <Wallet color={color} size={20} /> }} 
//       />
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     backgroundColor: '#000000',
//     borderTopWidth: 0,
//     height: Platform.OS === 'ios' ? 88 : 74, 
//     paddingBottom: Platform.OS === 'ios' ? 30 : 20, 
//     paddingTop: 10,
//     position: 'absolute',
//     bottom: 0, left: 0, right: 0,
//     elevation: 25, zIndex: 100, 
//   },
//   tabLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 }
// });

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { StyleSheet, Platform } from "react-native";
// মডার্ন এবং স্পোটিফাই ভাইব-এর আইকন সেট
import {
  Activity,
  Users,
  Wallet,
  Music,
  LayoutGrid,
  HelpCircle
} from "lucide-react-native";

import LoginScreen from "../screens/LoginScreen";
import MiningScreen from "../screens/MiningScreen";
import ReferralScreen from "../screens/ReferralScreen";
import WithdrawScreen from "../screens/WithdrawScreen";
import SpinScreen from "../screens/SpinScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import HomeScreen from "../screens/HomeScreen";
// import { createDrawerNavigator } from "@react-navigation/drawer";

const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  const isAuthenticated = useSelector((state) => state.wallet.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    // <Drawer.Navigator
    //   drawerContent={(props) => <CustomDrawer {...props} />}
    //   screenOptions={{
    //     headerShown: true, // 🔑 Eti 'true' thakle screen-er upore 'Hamburger (3 lines)' menu-ti dekhabe
    //     headerStyle: { backgroundColor: "#090d16" },
    //     headerTintColor: "#fff",
    //     drawerStyle: { width: 280, backgroundColor: "#090d16" },
    //   }}
    // >
    //   {/* 🔑 Nishchit koro ekhane HomeScreen-ti dewa ache */}
    //   <Drawer.Screen name="Home" component={HomeScreen} />
    // </Drawer.Navigator>
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#1db954", // 🟢 Spotify Green অথবা গোল্ডেন #f59e0b ব্যবহার করতে পারো
            tabBarInactiveTintColor: "#b3b3b3", // মডার্ন গ্রে কালার
            tabBarShowLabel: true, // লেবেল অন রাখা হলো
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
        }}
    >
        {/* 🚀 Mining Tab */}
        <Tab.Screen
            name="Mining"
            component={HomeScreen}
            options={{
                tabBarLabel: 'Mining',
                tabBarIcon: ({ color, focused }) => (
                    <Activity color={color} size={focused ? 24 : 20} strokeWidth={focused ? 2.5 : 2} />
                )
            }}
        />

        {/* 🌐 Network / Referral Tab */}
        <Tab.Screen
            name="Network"
            component={ReferralScreen}
            options={{
                tabBarLabel: 'Network',
                tabBarIcon: ({ color, focused }) => (
                    <Users color={color} size={focused ? 24 : 20} strokeWidth={focused ? 2.5 : 2} />
                )
            }}
        />

        {/* 💰 Finance / Withdraw Tab */}
        <Tab.Screen
            name="Finance"
            component={WithdrawScreen}
            options={{
                tabBarLabel: 'Finance',
                tabBarIcon: ({ color, focused }) => (
                    <Wallet color={color} size={focused ? 24 : 20} strokeWidth={focused ? 2.5 : 2} />
                )
            }}
        />

        <Tab.Screen
            name="LuckySpin"
            component={LeaderboardScreen}
            options={{
                tabBarLabel: 'Lucky Spin',
                tabBarIcon: ({ color, focused }) => (
                    <HelpCircle color={color} size={focused ? 24 : 20} />
                )
            }}
        />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000', // স্পোটিফাই ডার্ক থিম
    borderTopWidth: 0, // টপ বর্ডার রিমুভ করা হলো

    // 🔑 মেইন ফিক্স: হাইট এবং নিচের গ্যাপ বাড়ানো হলো যাতে ফোনের ব্যাক বাটনের ওপরে থাকে
    height: Platform.OS === 'ios' ? 88 : 74, // অ্যান্ড্রয়েডের জন্য হাইট ৭৪ করা হলো
    paddingBottom: Platform.OS === 'ios' ? 30 : 28, // নিচের সিস্টেম বাটন থেকে ২০ পিক্সেল ওপরে থাকবে
    paddingTop: 10,

    position: 'absolute',
    bottom: 0, // স্ক্রিনের একদম নিচে সেট করা হলো
    left: 0,
    right: 0,

    // শ্যাডো এবং এলিভেশন যাতে এটি সব স্ক্রিনের ওপরে ভেসে থাকে
    elevation: 25,
    zIndex: 100,

    // ফোনের ব্যাক বাটনের ব্যাকগ্রাউন্ড কালার যাতে অ্যাপের ভেতরে ঢুকে না যায়, সেজন্য শ্যাডো
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        // অ্যান্ড্রয়েডে কিছু ডিভাইসে সিস্টেম বারের ওপরে মার্জিন দিতে সাহায্য করবে
        marginBottom: 28,
      },
    })
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  }
});
