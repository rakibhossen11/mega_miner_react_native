import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  CalendarCheck,
  Tv,
  HelpCircle,
  Users,
  Ticket,
  Crown,
  Tag,
  Bell,
  Coins,
  ArrowRight,
  Sparkles
} from "lucide-react-native";

export default function HomeScreen() {
  const navigation = useNavigation();

  // ইউজার ব্যালেন্স (রিয়েল অ্যাপে এটি Redux বা API থেকে আসবে)
  const userStats = {
    name: "Alex Mercer",
    coins: "1,245",
    usd: "12.45"
  };

  // তোমার ফিচারগুলোর জন্য একটি সাজানো ডাটা লিস্ট
  const features = [
    { id: "1", name: "Daily Check In", desc: "Daily Rewards", icon: CalendarCheck, color: "#3b82f6", target: "DailyCheckIn" },
    { id: "2", name: "Spin Wheel", desc: "Lucky Spin", icon: Sparkles, color: "#ec4899", target: "LuckySpin" },
    { id: "3", name: "Reward Ads", desc: "Watch & Earn", icon: Tv, color: "#10b981", target: "RewardAds" },
    { id: "4", name: "Scratch Card", desc: "Test Your Luck", icon: Ticket, color: "#f59e0b", target: "ScratchCard" },
    { id: "5", name: "Quiz", desc: "Play & Win", icon: HelpCircle, color: "#8b5cf6", target: "Quiz" },
    { id: "6", name: "Lucky Draw", desc: "Mega Giveaways", icon: Ticket, color: "#ef4444", target: "LuckyDraw" },
    { id: "7", name: "Referral", desc: "Invite Friends", icon: Users, color: "#06b6d4", target: "Network" },
    { id: "8", name: "Coupons", desc: "Free Vouchers", icon: Tag, color: "#64748b", target: "Coupons" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      
      {/* 🔹 1. Top Profile & Notification Header */}
      <View style={styles.header}>
        <View style={styles.profileZone}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{userStats.name[0]}</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userStats.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={() => alert('Notifications Clicked')}>
          <Bell color="#fff" size={22} />
          {/* নোটিফিকেশন ডট */}
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🔹 2. Premium Wallet/Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View style={styles.coinLabelBox}>
              <Coins color="#f59e0b" size={18} fill="#f59e0b" />
              <Text style={styles.coinLabelText}>Total Balance</Text>
            </View>
            <TouchableOpacity style={styles.membershipBadge}>
              <Crown color="#f59e0b" size={14} fill="#f59e0b" />
              <Text style={styles.membershipText}>PRO</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.coinAmount}>{userStats.coins} <Text style={styles.coinUnit}>Coins</Text></Text>
          <Text style={styles.usdAmount}>≈ ${userStats.usd} USD</Text>
        </View>

        {/* 🔹 3. Membership / Banner Promos */}
        <TouchableOpacity style={styles.bannerContainer}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Upgrade VIP Membership</Text>
            <Text style={styles.bannerSubtitle}>Get 2x faster mining rate & ad-free experience.</Text>
          </View>
          <ArrowRight color="#fff" size={20} />
        </TouchableOpacity>

        {/* 🔹 4. Main Features Grid */}
        <Text style={styles.sectionTitle}>Earn Rewards</Text>
        <View style={styles.gridContainer}>
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => {
                  if(item.target) {
                    // যদি নেভিগেশন সেট করা থাকে
                    // navigation.navigate(item.target);
                    alert(`${item.name} Clicked`);
                  }
                }}
              >
                <View style={[styles.iconWrapper, { backgroundColor: `${item.color}20` }]}>
                  <IconComponent color={item.color} size={24} />
                </View>
                <Text style={styles.featureName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.featureDesc} numberOfLines={1}>{item.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 પ્રીમિયમ ડાર્ક યુઝર ઇન્ટરફેસ (UI) સ્ટાઇલ
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16", // MegaMinerApp মেইন ব্যাকগ্রাউন্ড থিম
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // বটম নেভিগেশনের জন্য এক্সট্রা স্পেস
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileZone: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  avatarText: {
    color: "#f59e0b",
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeText: {
    color: "#64748b",
    fontSize: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  notificationButton: {
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  balanceCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  coinLabelBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinLabelText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#f59e0b",
  },
  membershipText: {
    color: "#f59e0b",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 4,
  },
  coinAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  coinUnit: {
    color: "#f59e0b",
    fontSize: 18,
  },
  usdAmount: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  bannerContainer: {
    backgroundColor: "#4f46e5", // প্রিমিয়াম পার্পল কালার
    borderRadius: 20,
    padding: 16,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "#c7d2fe",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    backgroundColor: "#111827",
    width: "48%", // ২ কলাম গ্রিড লেআউট
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1e293b",
    alignItems: "flex-start",
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 14,
    marginBottom: 12,
  },
  featureName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  featureDesc: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 2,
  },
});