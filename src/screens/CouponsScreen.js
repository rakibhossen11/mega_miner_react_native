import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Tag, Coins, Check, Lock, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard"; // কোড কপি করার জন্য

export default function CouponsScreen() {
  // ডামি ইউজার ব্যালেন্স (রিয়েল অ্যাপে Redux বা API থেকে আসবে)
  const [userCoins, setUserCoins] = useState(1245); 

  // 🎫 কুপন কার্ডস ডাটা লিস্ট
  const [coupons, setCoupons] = useState([
    { id: "1", title: "$5 Amazon Gift Card", cost: 500, code: "AMZ-5829-XN", redeemed: false },
    { id: "2", title: "$10 Google Play Code", cost: 1000, code: "GPLAY-1029-MK", redeemed: false },
    { id: "3", title: "Free VIP Membership (1 Month)", cost: 800, code: "VIP-30DAYS-MINER", redeemed: false },
    { id: "4", title: "$25 Binance Crypto Voucher", cost: 2500, code: "BNB-CRYPTO-789", redeemed: false },
  ]);

  // 🚀 কুপন রিডিম করার মেইন ফাংশন
  const handleRedeemCoupon = (id, cost, title) => {
    if (userCoins < cost) {
      Alert.alert("Insufficient Balance ❌", "You don't have enough coins to redeem this coupon. Keep mining!");
      return;
    }

    Alert.alert(
      "Confirm Redemption",
      `Are you sure you want to spend ${cost} Coins for "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: () => {
            // ইউজারের ব্যালেন্স থেকে কয়েন কেটে নেওয়া
            setUserCoins(userCoins - cost);

            // কুপন লিস্ট আপডেট করে নির্দিষ্ট কুপনটি redeemed: true করা
            setCoupons(
              coupons.map((item) =>
                item.id === id ? { ...item, redeemed: true } : item
              )
            );

            Alert.alert("🎉 Success!", "Coupon unlocked successfully! Copy the code below.");
          },
        },
      ]
    );
  };

  // 📋 কুপন কোড কপি করার ফাংশন
  const copyCode = async (code) => {
    await Clipboard.setStringAsync(code);
    Alert.alert("📋 Copied!", "Voucher code copied to clipboard.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      
      {/* 💰 টপ কারেন্ট ব্যালেন্স ইন্ডিকেটর */}
      <View style={styles.topBalanceBar}>
        <Text style={styles.balanceLabel}>Your Balance:</Text>
        <View style={styles.coinBadge}>
          <Coins color="#f59e0b" size={16} fill="#f59e0b" style={{ marginRight: 6 }} />
          <Text style={styles.coinAmount}>{userCoins} Coins</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🏷️ মেইন হেডার */}
        <View style={styles.mainCard}>
          <View style={styles.iconWrapper}>
            <Tag color="#64748b" size={50} />
          </View>
          <Text style={styles.title}>Shop Coupons</Text>
          <Text style={styles.subtitle}>
            Exchange your hard-earned coins for premium gift cards, crypto vouchers, and special rewards!
          </Text>
        </View>

        {/* 📜 কুপন গ্রিড/লিস্ট */}
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        
        {coupons.map((item) => (
          <View key={item.id} style={[styles.couponCard, item.redeemed ? styles.redeemedCard : null]}>
            <View style={styles.couponLeft}>
              <View style={[styles.tagIconBox, { backgroundColor: item.redeemed ? "#10b98115" : "#64748b15" }]}>
                <Tag color={item.redeemed ? "#10b981" : "#94a3b8"} size={22} />
              </View>
              <View style={styles.couponInfo}>
                <Text style={styles.couponTitle} numberOfLines={1}>{item.title}</Text>
                
                {!item.redeemed ? (
                  // যদি লক থাকে তবে প্রাইস দেখাবে
                  <View style={styles.costBox}>
                    <Coins color="#f59e0b" size={14} fill="#f59e0b" style={{ marginRight: 4 }} />
                    <Text style={styles.costText}>{item.cost} Coins</Text>
                  </View>
                ) : (
                  // যদি আনলক হয়ে যায় তবে কোডটি দেখাবে
                  <TouchableOpacity style={styles.codeRevealBox} onPress={() => copyCode(item.code)}>
                    <Text style={styles.codeText}>{item.code}</Text>
                    <Copy color="#10b981" size={14} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* ডান পাশের অ্যাকশন বাটন */}
            <View style={styles.couponRight}>
              {!item.redeemed ? (
                <TouchableOpacity 
                  style={styles.redeemButton} 
                  onPress={() => handleRedeemCoupon(item.id, item.cost, item.title)}
                >
                  <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.unlockedBadge}>
                  <Check color="#10b981" size={16} style={{ marginRight: 4 }} />
                  <Text style={styles.unlockedText}>Unlocked</Text>
                </View>
              )}
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  topBalanceBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#1e293b",
  },
  balanceLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b10",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#f59e0b",
  },
  coinAmount: {
    color: "#f59e0b",
    fontSize: 14,
    fontWeight: "bold",
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
    backgroundColor: "#64748b15",
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
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  couponCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  redeemedCard: {
    borderColor: "#10b98130",
    backgroundColor: "#10b98103",
  },
  couponLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tagIconBox: {
    padding: 12,
    borderRadius: 14,
    marginRight: 14,
  },
  couponInfo: {
    flex: 1,
    marginRight: 10,
  },
  couponTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  costBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  costText: {
    color: "#f59e0b",
    fontSize: 13,
    fontWeight: "600",
  },
  codeRevealBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b98110",
    borderWidth: 0.5,
    borderColor: "#10b98180",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  codeText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  couponRight: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  redeemButton: {
    backgroundColor: "#64748b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b98115",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unlockedText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "bold",
  },
});