import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  User, Wallet, Users, Crown, Ticket, Tag, HelpCircle, Settings, ShieldCheck, LogOut, ChevronRight
} from 'lucide-react-native';

export default function CustomDrawer(props) {
  const user = {
    name: "Alex Mercer",
    email: "alex.mercer@email.com"
  };

  const menuItems = [
    { text: "Profile", icon: User, color: "#f59e0b", target: "Profile" },
    { text: "Wallet", icon: Wallet, color: "#10b981", target: "Finance" }, // তোমার ফাইনান্স ট্যাবে পাঠাতে পারো
    { text: "Referral", icon: Users, color: "#06b6d4", target: "Network" },
    { text: "Membership", icon: Crown, color: "#e11d48", target: "Membership" },
    { text: "Lucky Draw", icon: Ticket, color: "#8b5cf6", target: "LuckyDraw" },
    { text: "Coupon", icon: Tag, color: "#ec4899", target: "Coupon" },
    { text: "Support", icon: HelpCircle, color: "#3b82f6", target: "Support" },
    { text: "Settings", icon: Settings, color: "#64748b", target: "Settings" },
    { text: "Privacy Policy", icon: ShieldCheck, color: "#14b8a6", target: "Privacy" },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => alert("Logged out!") },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 👤 Header: User Info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User color="#f59e0b" size={28} />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* 📜 Scrollable Menu Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                props.navigation.closeDrawer();
                // যদি এই নামের স্ক্রিন তোমার নেভিগেটরে রেজিস্টার থাকে তবে সেখানে যাবে
                alert(`${item.text} Clicked`);
              }}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.iconBg, { backgroundColor: `${item.color}15` }]}>
                  <Icon color={item.color} size={20} />
                </View>
                <Text style={styles.menuText}>{item.text}</Text>
              </View>
              <ChevronRight color="#334155" size={16} />
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* 🛑 Footer: Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#ef4444" size={20} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  email: { color: '#64748b', fontSize: 13, marginTop: 2 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { padding: 8, borderRadius: 10, marginRight: 14 },
  menuText: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#111827'
  },
  logoutText: { color: '#ef4444', fontSize: 15, fontWeight: 'bold', marginLeft: 12 }
});