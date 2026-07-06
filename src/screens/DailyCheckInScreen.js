import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalendarCheck, Coins, CheckCircle2, Lock, Unlock } from "lucide-react-native";

export default function DailyCheckInScreen() {
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0); // ইউজার পরপর কয়দিন ক্লেম করেছে (0 থেকে 6)
  const [isClaimedToday, setIsClaimedToday] = useState(false); // আজ ক্লেম করেছে কি না

  // ৭ দিনের ফিক্সড রিওয়ার্ড চার্ট
  const rewardsConfig = [
    { day: 1, coins: 10, label: "Day 1" },
    { day: 2, coins: 20, label: "Day 2" },
    { day: 3, coins: 30, label: "Day 3" },
    { day: 4, coins: 50, label: "Day 4" },
    { day: 5, coins: 60, label: "Day 5" },
    { day: 6, coins: 80, label: "Day 6" },
    { day: 7, coins: 150, label: "Day 7" }, // মেগা বোনাস
  ];

  // 🔄 অ্যাপ ওপেন হলেই লোকাল স্টোরেজ থেকে লাস্ট ক্লেম হিস্ট্রি লোড হবে
  useEffect(() => {
    loadCheckInStatus();
  }, []);

  const loadCheckInStatus = async () => {
    try {
      setLoading(true);
      const lastTimestamp = await AsyncStorage.getItem("last_check_in_time");
      const savedStreak = await AsyncStorage.getItem("current_streak");

      const streak = savedStreak ? parseInt(savedStreak, 10) : 0;
      setCurrentStreak(streak);

      if (lastTimestamp) {
        const lastDate = new Date(parseInt(lastTimestamp, 10));
        const today = new Date();

        // তারিখ চেক করার লজিক (বছরের দিন ও সাল একই কি না)
        const isSameDay =
          lastDate.getDate() === today.getDate() &&
          lastDate.getMonth() === today.getMonth() &&
          lastDate.getFullYear() === today.getFullYear();

        if (isSameDay) {
          setIsClaimedToday(true);
        } else {
          // যদি আগের দিন বা তার আগে ক্লেম করে থাকে
          const oneDayInMs = 24 * 60 * 60 * 1000;
          const timeDiff = today.setHours(0,0,0,0) - lastDate.setHours(0,0,0,0);

          // যদি ২৪ ঘণ্টার বেশি (১ দিনের বেশি) গ্যাপ হয়ে যায়, তবে স্ট্রিক রিসেট হয়ে যাবে
          if (timeDiff > oneDayInMs) {
            setCurrentStreak(0);
            await AsyncStorage.setItem("current_streak", "0");
          }
          setIsClaimedToday(false);
        }
      }
    } catch (error) {
      console.log("Error loading check-in data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 ক্লেম বাটনে ক্লিক করলে যা হবে
  const handleClaimReward = async () => {
    if (isClaimedToday) return;

    try {
      const today = new Date();
      let nextStreak = currentStreak + 1;

      // যদি ৭ দিন পার হয়ে যায়, আবার ১ম দিন থেকে শুরু হবে
      if (nextStreak > 7) {
        nextStreak = 1;
      }

      const rewardedCoins = rewardsConfig[nextStreak - 1].coins;

      // 💾 লোকাল স্টোরেজে নতুন ডাটা সেভ করা
      await AsyncStorage.setItem("last_check_in_time", today.getTime().toString());
      await AsyncStorage.setItem("current_streak", nextStreak.toString());

      // অ্যাপের কারেন্ট স্টেট আপডেট
      setCurrentStreak(nextStreak);
      setIsClaimedToday(true);

      Alert.alert(
        "🎉 Success!",
        `You have successfully claimed your Day ${nextStreak} reward of +${rewardedCoins} Coins!`
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong while claiming reward.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🎁 টপ ব্যানার কার্ড */}
        <View style={styles.headerCard}>
          <View style={styles.iconWrapper}>
            <CalendarCheck color="#3b82f6" size={50} />
          </View>
          <Text style={styles.title}>Daily Rewards</Text>
          <Text style={styles.subtitle}>
            Current Streak: <Text style={{ color: "#f59e0b", fontWeight: "bold" }}>{currentStreak} Days</Text>
          </Text>
        </View>

        {/* 📅 ৭ দিনের ইন্টারঅ্যাক্টিভ গ্রিড */}
        <View style={styles.gridContainer}>
          {rewardsConfig.map((item) => {
            // ১ থেকে ৭ দিনের কন্ডিশনাল স্ট্যাটাস চেক
            const isClaimed = item.day <= currentStreak; 
            const isCurrentAvailable = item.day === currentStreak + 1 && !isClaimedToday;
            const isLocked = item.day > currentStreak + (isClaimedToday ? 0 : 1);

            return (
              <View
                key={item.day}
                style={[
                  styles.dayCard,
                  item.day === 7 ? styles.megaDayCard : null,
                  isClaimed ? styles.claimedCard : null,
                  isCurrentAvailable ? styles.activeCard : null,
                ]}
              >
                <Text style={[styles.dayLabel, isCurrentAvailable ? { color: "#fff" } : null]}>
                  {item.label}
                </Text>
                
                <View style={styles.coinBox}>
                  <Coins 
                    color={isClaimed ? "#64748b" : isCurrentAvailable ? "#f59e0b" : "#475569"} 
                    size={20} 
                    fill={isClaimed ? "#64748b" : isCurrentAvailable ? "#f59e0b" : "transparent"} 
                  />
                  <Text style={[
                    styles.coinText, 
                    isClaimed ? styles.claimedText : isCurrentAvailable ? { color: "#fff" } : { color: "#475569" }
                  ]}>
                    +{item.coins}
                  </Text>
                </View>

                {/* ডাইনামিক স্ট্যাটাস আইকন */}
                <View style={styles.statusIcon}>
                  {isClaimed ? (
                    <CheckCircle2 color="#10b981" size={18} fill="#10b98120" />
                  ) : isCurrentAvailable ? (
                    <Unlock color="#f59e0b" size={16} />
                  ) : (
                    <Lock color="#334155" size={16} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* 🚀 মেইন ক্লেইম বাটন */}
        <TouchableOpacity
          style={[styles.claimButton, isClaimedToday ? styles.disabledButton : null]}
          onPress={handleClaimReward}
          disabled={isClaimedToday}
        >
          <Text style={styles.claimButtonText}>
            {isClaimedToday ? "Already Claimed Today" : "Claim Today's Reward"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  headerCard: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#111827",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  iconWrapper: {
    backgroundColor: "#3b82f615",
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
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayCard: {
    backgroundColor: "#111827",
    width: "30%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1e293b",
    alignItems: "center",
  },
  megaDayCard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  activeCard: {
    borderColor: "#f59e0b",
    backgroundColor: "#f59e0b10",
  },
  claimedCard: {
    backgroundColor: "#0d131f",
    borderColor: "#1e293b",
    opacity: 0.6,
  },
  dayLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  coinBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  coinText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  claimedText: {
    color: "#64748b",
    textDecorationLine: "line-through",
  },
  statusIcon: {
    marginTop: 8,
  },
  claimButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#3b82f6",
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
  claimButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});