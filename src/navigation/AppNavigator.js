import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { StyleSheet, Platform } from "react-native";
import {
  Activity,
  Users,
  Wallet,
  Home as HomeIcon, // 🏠 হোম আইকন যুক্ত করা হলো
} from "lucide-react-native";

// 📂 সব স্ক্রিন সঠিকভাবে ইমপোর্ট করা হলো
import LoginScreen from "../screens/LoginScreen";
import MiningScreen from "../screens/MiningScreen";
import ReferralScreen from "../screens/ReferralScreen";
import WithdrawScreen from "../screens/WithdrawScreen";
import SpinScreen from "../screens/SpinScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import HomeScreen from "../screens/HomeScreen";
import DailyCheckInScreen from "../screens/DailyCheckInScreen";
// import ProfileScreen from "../screens/ProfileScreen"; // 🔑 প্রোফাইল স্ক্রিন ইমপোর্ট মিসিং ছিল

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 🔑 ১. হোম স্ট্যাক (Home Stack)
// এর ভেতরে থাকা সব পেজে বটম নেভিগেশন বারটি অটোমেটিক দেখা যাবে
function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#090d16" },
        headerTintColor: "#fff",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} options={{ title: "Daily Check In" }} />
      {/* মেইন হোম স্ক্রিন */}
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: "Mega Miner" }} />
      
      {/* 🎡 স্পিন স্ক্রিন (হোম পেজের target: "LuckySpin" এর সাথে মিলানো) */}
      <Stack.Screen name="LuckySpin" component={SpinScreen} options={{ title: "Lucky Spin" }} />
      
      {/* 📊 লিডারবোর্ড স্ক্রিন (হোম পেজের target: "Leaderboard" এর সাথে মিলানো) */}
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: "Top Miners" }} />
      
      {/* 👤 প্রোফাইল স্ক্রিন */}
      {/* <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "My Profile" }} /> */}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const isAuthenticated = useSelector((state) => state.wallet.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f59e0b", // 🟢 গোল্ডেন কালার (চাইলে স্পোটিফাই গ্রিন #1db954 দিতে পারো)
        tabBarInactiveTintColor: "#b3b3b3", 
        tabBarShowLabel: true, 
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
        {/* 🏠 ১. মেইন হোম/মাইনিং ট্যাব (এখানে সরাসরি HomeScreen এর বদলে HomeStackNavigator দেওয়া হলো) */}
        <Tab.Screen
            name="HomeTab"
            component={HomeStackNavigator}
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, focused }) => (
                    <HomeIcon color={color} size={focused ? 24 : 20} strokeWidth={focused ? 2.5 : 2} />
                )
            }}
        />

        {/* 🚀 ২. রিয়েল মাইনিং স্ক্রিন ট্যাব (যদি আলাদা পেজ থাকে) */}
        <Tab.Screen
            name="Mining"
            component={MiningScreen}
            options={{
                tabBarLabel: 'Mining',
                tabBarIcon: ({ color, focused }) => (
                    <Activity color={color} size={focused ? 24 : 20} strokeWidth={focused ? 2.5 : 2} />
                )
            }}
        />

        {/* 🌐 ৩. Network / Referral Tab */}
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

        {/* 💰 ৪. Finance / Withdraw Tab */}
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
    </Tab.Navigator>
  );
}

// 🎨 তোমার করা পারফেক্ট বটম বার স্টাইলিং
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000', 
    borderTopWidth: 0, 

    height: Platform.OS === 'ios' ? 88 : 74, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 28, // অ্যান্ড্রয়েডের জন্য ব্যাক বাটন গ্যাপ ফিক্সড
    paddingTop: 10,

    position: 'absolute',
    bottom: 0, 
    left: 0,
    right: 0,

    elevation: 25,
    zIndex: 100,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        marginBottom: 0, // সিস্টেম বাটন ওভারল্যাপ প্রটেকশন
      },
    })
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  }
});