import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tv, Coins, Play, CheckCircle, Info } from "lucide-react-native";

export default function RewardAdsScreen() {
  const [adLoading, setAdLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const DAILY_LIMIT = 5; // দৈনিক সর্বোচ্চ ৫টি অ্যাড দেখা যাবে
  const REWARD_COINS = 25; // প্রতিটি অ্যাডের জন্য ২৫ কয়েন

  // 🔄 অ্যাপ ওপেন হলে আজকের দেখা অ্যাডের সংখ্যা লোড হবে
  useEffect(() => {
    loadAdsCount();
  }, []);

  const loadAdsCount = async () => {
    try {
      const savedDate = await AsyncStorage.getItem("last_ad_date");
      const savedCount = await AsyncStorage.getItem("ads_count_today");
      
      const todayStr = new Date().toDateString();

      if (savedDate === todayStr) {
        setAdsWatchedToday(savedCount ? parseInt(savedCount, 10) : 0);
      } else {
        // যদি নতুন দিন হয়, কাউন্টার রিসেট হবে
        await AsyncStorage.setItem("last_ad_date", todayStr);
        await AsyncStorage.setItem("ads_count_today", "0");
        setAdsWatchedToday(0);
      }
    } catch (error) {
      console.log("Error loading ads count:", error);
    }
  };

  // 🎬 ভিডিও অ্যাড প্লে করার ফাংশন (Simulation)
  const handleWatchAd = () => {
    if (adsWatchedToday >= DAILY_LIMIT) {
      Alert.alert("Limit Reached", "You have reached your daily limit for today. Come back tomorrow!");
      return;
    }

    setAdLoading(true);
    let timeLeft = 5; // ৫ সেকেন্ডের ডামি ভিডিও অ্যাড
    setCountdown(timeLeft);

    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        rewardUser();
      }
    }, 1000);
  };

  // 🎁 অ্যাড দেখা শেষ হলে রিওয়ার্ড দেওয়ার ফাঞ্চন
  const rewardUser = async () => {
    try {
      const nextCount = adsWatchedToday + 1;
      await AsyncStorage.setItem("ads_count_today", nextCount.toString());
      setAdsWatchedToday(nextCount);
      setAdLoading(false);

      Alert.alert(
        "🎉 Reward Claimed!",
        `Thank you for watching! +${REWARD_COINS} Coins have been added to your balance.`
      );
    } catch (error) {
      setAdLoading(false);
      Alert.alert("Error", "Something went wrong while giving reward.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      
      {/* যদি অ্যাড চলতে থাকে তবে একটি ফুল-স্ক্রিন ডার্ক প্লেয়ার আসবে */}
      {adLoading ? (
        <View style={styles.adOverlay}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.adPlayingText}>Watching Video Ad...</Text>
          <Text style={styles.countdownText}>Reward in {countdown}s</Text>
          <Text style={styles.adWarning}>Do not close or go back</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* 📺 টপ টিভি ব্যানার */}
          <View style={styles.mainCard}>
            <View style={styles.iconWrapper}>
              <Tv color="#10b981" size={55} />
            </View>
            <Text style={styles.title}>Watch & Earn</Text>
            <Text style={styles.subtitle}>
              Watch short video ads and earn instant bonus coins.
            </Text>
          </View>

          {/* 📊 প্রোগ্রেস ও লিমিট বক্স */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Daily Limit:</Text>
              <Text style={styles.statValue}>{adsWatchedToday} / {DAILY_LIMIT}</Text>
            </View>
            {/* প্রোগ্রেস বার */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(adsWatchedToday / DAILY_LIMIT) * 100}%` }]} />
            </View>
          </View>

          {/* 💰 রিওয়ার্ড ইনফো বক্স */}
          <View style={styles.rewardInfoBox}>
            <View style={styles.infoLeft}>
              <Coins color="#f59e0b" size={24} fill="#f59e0b" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Per Video Reward</Text>
                <Text style={styles.infoSubtitle}>Get guaranteed coins instantly</Text>
              </View>
            </View>
            <Text style={styles.rewardAmount}>+{REWARD_COINS}</Text>
          </View>

          {/* 🚀 মেইন ওয়াচ বাটন */}
          <TouchableOpacity
            style={[styles.watchButton, adsWatchedToday >= DAILY_LIMIT ? styles.disabledButton : null]}
            onPress={handleWatchAd}
            disabled={adsWatchedToday >= DAILY_LIMIT}
          >
            <Play color="#fff" size={20} fill="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.watchButtonText}>
              {adsWatchedToday >= DAILY_LIMIT ? "No Ads Available Today" : "Watch Video Ad"}
            </Text>
          </TouchableOpacity>

          {/* 📜 নিয়মাবলী */}
          <View style={styles.rulesContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Info color="#64748b" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.rulesTitle}>Important Rules</Text>
            </View>
            <Text style={styles.ruleText}>• You must watch the complete video to get rewarded.</Text>
            <Text style={styles.ruleText}>• Skipping or closing the ad early will result in 0 rewards.</Text>
            <Text style={styles.ruleText}>• Reset happens automatically every midnight.</Text>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  mainCard: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#111827",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  iconWrapper: {
    backgroundColor: "#10b98115",
    padding: 20,
    borderRadius: 50,
    marginBottom: 15,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  statsCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 15,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  statValue: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#1e293b",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  rewardInfoBox: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 25,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  infoSubtitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  rewardAmount: {
    color: "#f59e0b",
    fontSize: 20,
    fontWeight: "bold",
  },
  watchButton: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#1e293b",
    shadowOpacity: 0,
    elevation: 0,
  },
  watchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rulesContainer: {
    marginTop: 30,
    backgroundColor: "#11182705",
    padding: 10,
  },
  rulesTitle: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
  },
  ruleText: {
    color: "#475569",
    fontSize: 12,
    marginTop: 5,
    lineHeight: 16,
  },
  /* 🎬 ভিডিও প্লেয়ার ওভারলে স্টাইল */
  adOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#000000FA", // একদম ডার্ক ব্ল্যাক
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  adPlayingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  countdownText: {
    color: "#f59e0b",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  adWarning: {
    color: "#475569",
    fontSize: 12,
    marginTop: 15,
  }
});