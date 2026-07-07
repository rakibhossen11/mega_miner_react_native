import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  User,
  Wallet,
  History,
  ArrowRightLeft,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Crown
} from "lucide-react-native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  // ইউজার ডাটা (রিয়েল অ্যাপে এটি Redux বা API থেকে আসবে)
  const userData = {
    name: "Alex Mercer",
    email: "alex.mercer@miner.com",
    tag: "PRO MEMBER",
    joinDate: "Joined Nov 2025"
  };

  // প্রোফাইল মেনু অপশন ডাটা লিস্ট
  const menuOptions = [
    { id: "edit", title: "Edit Profile", icon: User, color: "#3b82f6", action: () => navigation.navigate("EditProfile") },
    { id: "withdraw", title: "Withdraw", icon: Wallet, color: "#10b981", action: () => navigation.navigate("Finance") }, 
    { id: "history", title: "Withdraw History", icon: History, color: "#f59e0b", action: () => navigation.navigate("WithdrawHistory") },
    { id: "transaction", title: "Transaction", icon: ArrowRightLeft, color: "#ec4899", action: () => navigation.navigate("Transaction") },
    { id: "support", title: "Support", icon: MessageSquare, color: "#06b6d4", action: () => navigation.navigate("Support") },
    { id: "faq", title: "FAQ", icon: HelpCircle, color: "#8b5cf6", action: () => navigation.navigate("FAQ") },
    { id: "privacy", title: "Privacy Policy", icon: ShieldCheck, color: "#64748b", action: () => navigation.navigate("PrivacyPolicy") },
  ];

  // 🚪 লগআউট ফাংশน
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout from MegaMinerApp?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Logged Out", "Successfully logged out!");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 👤 ১. টপ প্রোফাইল কার্ড */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBig}>
              <Text style={styles.avatarTextBig}>{userData.name[0]}</Text>
            </View>
            <View style={styles.crownBadge}>
              <Crown color="#fff" size={12} fill="#fff" />
            </View>
          </View>
          
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
          
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{userData.tag}</Text>
          </View>
        </View>

        {/* 🛠️ ২. মেনু অপশন লিস্ট */}
        <View style={styles.menuContainer}>
          {menuOptions.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={item.id} style={styles.menuRow} onPress={item.action}>
                <View style={styles.menuLeft}>
                  <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                    <IconComponent color={item.color} size={20} />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <ChevronRight color="#475569" size={18} />
              </TouchableOpacity>
            );
          })}

          {/* 🚪 লাল রঙের ডেঞ্জার জোন লগআউট বাটন (স্টাইল ফিক্সড) */}
          <TouchableOpacity style={[styles.menuRow, styles.logoutRow]} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#ef444415" }]}>
                <LogOut color="#ef4444" size={20} />
              </View>
              <Text style={[styles.menuTitle, { color: "#ef4444" }]}>Logout</Text>
            </View>
            <ChevronRight color="#ef444450" size={18} />
          </TouchableOpacity>
        </View>

        {/* 📜 ফুটারে জয়েন ডেট */}
        <Text style={styles.footerText}>{userData.joinDate}</Text>
        <Text style={styles.versionText}>Version 1.0.0 (Beta)</Text>

      </ScrollView>
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
    paddingBottom: 140,
  },
  profileHeaderCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 25,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  avatarTextBig: {
    color: "#f59e0b",
    fontSize: 32,
    fontWeight: "bold",
  },
  crownBadge: {
    position: "absolute",
    bottom: 0,
    right: 2,
    backgroundColor: "#f59e0b",
    padding: 6,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#111827",
  },
  profileName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileEmail: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 2,
  },
  tagBadge: {
    backgroundColor: "#f59e0b15",
    borderWidth: 0.5,
    borderColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 12,
  },
  tagText: {
    color: "#f59e0b",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  menuContainer: {
    backgroundColor: "#111827",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e293b",
  },
  logoutRow: {
    borderBottomWidth: 0, // শেষ অপশনে বর্ডার রিমুভ নিশ্চিত করা হলো
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
    marginRight: 14,
  },
  menuTitle: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "600",
  },
  footerText: {
    color: "#475569",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
    fontWeight: "600",
  },
  versionText: {
    color: "#334155",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
});