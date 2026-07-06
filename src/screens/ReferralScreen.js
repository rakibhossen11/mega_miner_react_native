import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Clipboard, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Network, Copy, Check, Users } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function ReferralScreen() {
  const { totalCoin } = useSelector((state) => state.wallet);
  const [stats, setStats] = useState({ totalReferrals: 0, referralEarnings: 0, referralLink: "", referredFriends: [] });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("https://your-live-domain.com/api/dashboard/referral")
      .then(res => res.json())
      .then(json => { if(json.success) setStats(json.data); });
  }, []);

  const copyToClipboard = () => {
    if (!stats.referralLink) return;
    Clipboard.setString(stats.referralLink);
    setCopied(true);
    Toast.show({ type: "success", text1: "Link Copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Affiliate Node Hub</Text>
        <Text style={styles.balance}>Vault: {totalCoin.toFixed(2)} D</Text>
      </View>

      <View style={styles.linkCard}>
        <Text style={styles.cardLabel}>Your Invitation System Routing Link</Text>
        <View style={styles.inputRow}>
          <Text numberOfLines={1} style={styles.linkText}>{stats.referralLink || "Generating..."}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
            {copied ? <Check color="#10b981" size={16} /> : <Copy color="#090d16" size={16} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Users color="#f59e0b" size={16} />
          <Text style={styles.historyTitle}>Surface Refinery Linked Nodes ({stats.totalReferrals})</Text>
        </View>

        {stats.referredFriends.map((item) => (
          <View key={item.referral_id} style={styles.row}>
            <Text style={styles.nodeId}>#{item.referred_id}</Text>
            <Text style={styles.username}>{item.referred_username}</Text>
            <Text style={styles.yield}>+{item.referrer_bonus_coins} D</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  title: { color: "#fff", fontSize: 18, fontWeight: "900" },
  balance: { color: "#f59e0b", fontWeight: "bold" },
  linkCard: { backgroundColor: "#111827", padding: 16, borderRadius: 16, marginBottom: 16 },
  cardLabel: { color: "#64748b", fontSize: 10, fontWeight: "bold", marginBottom: 8 },
  inputRow: { flexDirection: "row", backgroundColor: "#020617", borderRadius: 10, padding: 12, items: "center" },
  linkText: { flex: 1, color: "#f59e0b", fontSize: 11, fontFamily: "monospace" },
  copyBtn: { backgroundColor: "#f59e0b", padding: 8, borderRadius: 6, marginLeft: 8 },
  historyCard: { backgroundColor: "#111827", padding: 16, borderRadius: 16 },
  historyHeader: { flexDirection: "row", items: "center", gap: 8, marginBottom: 12 },
  historyTitle: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#1e293b" },
  nodeId: { color: "#f59e0b", fontFamily: "monospace" },
  username: { color: "#fff", flex: 1, marginLeft: 12 },
  yield: { color: "#10b981", fontWeight: "bold" }
});