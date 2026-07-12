import React, { useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, StatusBar, SafeAreaView } from "react-native";
import { Cpu } from "lucide-react-native";

export default function SplashScreen({ onFinish }) {
  
  useEffect(() => {
    // ⏱️ ৩ সেকেন্ড পর অ্যাপের মেইন নেভিগেশনে চলে যাবে
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      
      {/* 🎯 লোগো ও ব্র্যান্ডিং এরিয়া */}
      <View style={styles.logoContainer}>
        <View style={styles.iconGlow}>
          <Cpu color="#f59e0b" size={60} strokeWidth={1.5} />
        </View>
        <Text style={styles.brandName}>MEGA<Text style={{ color: "#f59e0b" }}>MINER</Text></Text>
        <Text style={styles.tagline}>Next-Gen Crypto Mining Platform</Text>
      </View>

      {/* 🔄 নিচে সুন্দর লোডিং বার */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#f59e0b" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconGlow: {
    backgroundColor: "#f59e0b08",
    padding: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#f59e0b15",
    marginBottom: 20,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  brandName: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tagline: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});