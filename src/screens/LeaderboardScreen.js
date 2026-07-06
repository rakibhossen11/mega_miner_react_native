import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Trophy, Medal, Award, Flame } from "lucide-react-native";

// ডামি লিডারবোর্ড ডাটা (রিয়েল টাইমে এটি এপিআই থেকে আসবে)
const DUMMY_LEADERBOARD = [
  { id: "1", name: "Alex Mercer", coins: "25,430", streak: 12, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" },
  { id: "2", name: "Sarah Connor", coins: "22,150", streak: 8, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: "3", name: "David Kim", coins: "19,800", streak: 15, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  { id: "4", name: "Emma Watson", coins: "15,200", streak: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
  { id: "5", name: "James Bond", coins: "14,850", streak: 3, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
  { id: "6", name: "John Doe", coins: "12,100", streak: 2, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100" },
  { id: "7", name: "Sophia Lee", coins: "10,400", streak: 6, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" },
  { id: "8", name: "Sophia Lee", coins: "10,400", streak: 6, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" },
  { id: "9", name: "Sophia Lee", coins: "10,400", streak: 6, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" },
  { id: "10", name: "Sophia Lee", coins: "10,400", streak: 6, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" },
  { id: "11", name: "Sophia Lee", coins: "10,400", streak: 6, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" },
];

export default function LeaderboardScreen() {
  const [timeframe, setTimeframe] = useState("all-time"); // weekly, monthly, all-time

  // Top 3 ইউজার আলাদা করা হলো পোডিয়ামের জন্য
  const topThree = DUMMY_LEADERBOARD.slice(0, 3);
  const remainingUsers = DUMMY_LEADERBOARD.slice(3);

  // র‍্যাংক অনুযায়ী মেডেল আইকন বা নাম্বার দেখানোর ফাংশন
  const renderRankBadge = (rank) => {
    if (rank === 1) return <Trophy color="#f59e0b" size={22} fill="#f59e0b" />;
    if (rank === 2) return <Medal color="#e2e8f0" size={22} fill="#e2e8f0" />;
    if (rank === 3) return <Award color="#b45309" size={22} fill="#b45309" />;
    return <Text style={styles.rankText}>{rank}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Header Section */}
      <View style={styles.header}>
        <Trophy color="#f59e0b" size={28} style={{ marginRight: 8 }} />
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      {/* 🔹 Timeframe Filter Tabs */}
      <View style={styles.tabContainer}>
        {["Weekly", "Monthly", "All-Time"].map((tab) => {
          const tabId = tab.toLowerCase();
          const isActive = timeframe === tabId;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setTimeframe(tabId)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🔹 Top 3 Podiums Section */}
      <View style={styles.podiumContainer}>
        {/* 2nd Place */}
        {topThree[1] && (
          <View style={[styles.podiumColumn, { marginTop: 30 }]}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: topThree[1].avatar }} style={styles.avatarLarge} />
              <View style={[styles.podiumBadge, { backgroundColor: "#e2e8f0" }]}>
                <Text style={styles.podiumBadgeText}>2</Text>
              </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].name}</Text>
            <Text style={styles.podiumCoins}>{topThree[1].coins} C</Text>
          </View>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <View style={styles.podiumColumn}>
            <View style={styles.avatarWrapper}>
              <Trophy color="#f59e0b" size={24} style={styles.crownIcon} fill="#f59e0b" />
              <Image source={{ uri: topThree[0].avatar }} style={[styles.avatarLarge, styles.avatarGold]} />
              <View style={[styles.podiumBadge, { backgroundColor: "#f59e0b" }]}>
                <Text style={styles.podiumBadgeText}>1</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, { fontWeight: "bold" }]} numberOfLines={1}>{topThree[0].name}</Text>
            <Text style={[styles.podiumCoins, { color: "#f59e0b" }]}>{topThree[0].coins} C</Text>
          </View>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <View style={[styles.podiumColumn, { marginTop: 45 }]}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: topThree[2].avatar }} style={styles.avatarLarge} />
              <View style={[styles.podiumBadge, { backgroundColor: "#b45309" }]}>
                <Text style={styles.podiumBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].name}</Text>
            <Text style={styles.podiumCoins}>{topThree[2].coins} C</Text>
          </View>
        )}
      </View>

      {/* 🔹 Remaining Users List */}
      <View style={styles.listContainer}>
        <FlatList
          data={remainingUsers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const actualRank = index + 4; // যেহেতু প্রথম ৩ জন বাদে এই লিস্ট শুরু
            return (
              <View style={styles.listItem}>
                <View style={styles.rankBadgeZone}>
                  {renderRankBadge(actualRank)}
                </View>
                
                <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
                
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <View style={styles.streakBox}>
                    <Flame color="#ef4444" size={14} fill="#ef4444" />
                    <Text style={styles.streakText}>{item.streak}d streak</Text>
                  </View>
                </View>

                <Text style={styles.userCoins}>{item.coins} C</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// 🎨 স্টাইলিং ফাইল (MegaMiner App Theme)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16", // ব্ল্যাকিশ-ব্লু প্রিমিয়াম থিম
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#111827",
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 4,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 21,
  },
  activeTabButton: {
    backgroundColor: "#1e293b",
  },
  tabText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#f59e0b",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginVertical: 25,
    height: 170,
  },
  podiumColumn: {
    alignItems: "center",
    width: "30%",
  },
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarLarge: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
    borderColor: "#1e293b",
  },
  avatarGold: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderColor: "#f59e0b",
    borderWidth: 3,
  },
  crownIcon: {
    position: "absolute",
    top: -22,
    zIndex: 5,
  },
  podiumBadge: {
    position: "absolute",
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  podiumBadgeText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "bold",
  },
  podiumName: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
  podiumCoins: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#111827",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingtop: 10,
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#192231",
    padding: 12,
    borderRadius: 15,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  rankBadgeZone: {
    width: 30,
    alignItems: "center",
  },
  rankText: {
    color: "#64748b",
    fontWeight: "bold",
    fontSize: 14,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  streakBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  streakText: {
    color: "#94a3b8",
    fontSize: 11,
    marginLeft: 4,
  },
  userCoins: {
    color: "#f59e0b",
    fontWeight: "bold",
    fontSize: 15,
  },
});