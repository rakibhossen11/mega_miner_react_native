import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Bell, Coins, Activity, Gift, Trash2, ShieldAlert } from "lucide-react-native";

export default function NotificationScreen() {
  // ডামি নোটিফিকেশন ডাটা লিস্ট
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Mining Payout Successful! 🚀",
      desc: "Your 24-hour mining cycle finished. +50 Coins added to wallet.",
      time: "2 hours ago",
      type: "mining",
      icon: Activity,
      color: "#10b981",
    },
    {
      id: "2",
      title: "New Coupon Available! 🏷️",
      desc: "Exchange your coins for a brand new $5 Amazon Gift Card now.",
      time: "5 hours ago",
      type: "gift",
      icon: Gift,
      color: "#8b5cf6",
    },
    {
      id: "3",
      title: "Referral Bonus Received! 👥",
      desc: "Your friend Alex joined using your code. You got +100 Coins!",
      time: "1 day ago",
      type: "coin",
      icon: Coins,
      color: "#f59e0b",
    },
  ]);

  // সব নোটিফিকেশন একসাথে ক্লিয়ার করার ফাংশন
  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* 🔝 টপ বার: নোটিফিকেশন সংখ্যা ও ক্লিয়ার অল বাটন */}
      {notifications.length > 0 && (
        <View style={styles.topBar}>
          <Text style={styles.countText}>You have {notifications.length} unread alerts</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Trash2 color="#ef4444" size={16} style={{ marginRight: 4 }} />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications.length > 0 ? (
          notifications.map((item) => {
            const IconComponent = item.icon;
            return (
              <View key={item.id} style={styles.notiCard}>
                {/* বাম পাশের আইকন বক্স */}
                <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                  <IconComponent color={item.color} size={20} />
                </View>
                
                {/* মাঝখানের টেক্সট এরিয়া */}
                <View style={styles.textContainer}>
                  <Text style={styles.notiTitle}>{item.title}</Text>
                  <Text style={styles.notiDesc}>{item.desc}</Text>
                  <Text style={styles.notiTime}>{item.time}</Text>
                </View>
              </View>
            );
          })
        ) : (
          // 📭 যদি কোনো নোটিফিকেশন না থাকে
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Bell color="#475569" size={48} />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>You don't have any new notifications right now.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#1e293b",
    backgroundColor: "#11182705",
  },
  countText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef444410",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 120,
  },
  notiCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  notiTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  notiDesc: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  notiTime: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyIconBox: {
    backgroundColor: "#111827",
    padding: 24,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptySubtitle: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 30,
    lineHeight: 18,
  },
});