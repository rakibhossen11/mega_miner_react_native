import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { History, Coins, Clock, CheckCircle2, XCircle, ArrowUpRight } from "lucide-react-native";

export default function WithdrawHistoryScreen() {
  
  // 📊 ডামি ট্রানজেকশন হিস্ট্রি লিস্ট (রিয়েল অ্যাপে এটি API বা Database থেকে আসবে)
  const historyData = [
    {
      id: "TXN-98210",
      method: "bKash",
      account: "017XXXXX432",
      coins: 1500,
      amount: "$15.00",
      date: "05 July 2026",
      status: "Pending",
      color: "#f59e0b",
      icon: Clock,
    },
    {
      id: "TXN-87124",
      method: "Nagad",
      account: "019XXXXX890",
      coins: 1000,
      amount: "$10.00",
      date: "28 June 2026",
      status: "Success",
      color: "#10b981",
      icon: CheckCircle2,
    },
    {
      id: "TXN-76512",
      method: "USDT (TRC20)",
      account: "T9zP...uX7v",
      coins: 2500,
      amount: "$25.00",
      date: "15 June 2026",
      status: "Rejected",
      color: "#ef4444",
      icon: XCircle,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      
      {/* 🔝 টপ সামারি বার */}
      <View style={styles.topSummaryBar}>
        <Text style={styles.summaryLabel}>Total Withdrawals:</Text>
        <Text style={styles.summaryValue}>{historyData.length} Requests</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {historyData.length > 0 ? (
          historyData.map((item) => {
            const StatusIcon = item.icon;
            return (
              <View key={item.id} style={styles.historyCard}>
                
                {/* 💳 কার্ডের ওপরের অংশ (মেথড এবং স্ট্যাটাস) */}
                <View style={styles.cardHeader}>
                  <View style={styles.methodBox}>
                    <History color="#64748b" size={16} style={{ marginRight: 6 }} />
                    <Text style={styles.methodName}>{item.method}</Text>
                  </View>
                  
                  {/* ডাইনামিক স্ট্যাটাস ব্যাজ */}
                  <View style={[styles.statusBadge, { backgroundColor: `${item.color}15`, borderColor: item.color }]}>
                    <StatusIcon color={item.color} size={12} style={{ marginRight: 4 }} />
                    <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
                  </View>
                </View>

                {/* 🔢 কার্ডের মাঝখানের অংশ (অ্যাকাউন্ট এবং আইডি) */}
                <View style={styles.cardBody}>
                  <View>
                    <Text style={styles.accountText}>{item.account}</Text>
                    <Text style={styles.txnIdText}>ID: {item.id}</Text>
                  </View>
                  
                  {/* ডানপাশে অ্যামাউন্ট */}
                  <View style={styles.amountBox}>
                    <Text style={styles.usdAmount}>{item.amount}</Text>
                    <View style={styles.coinRow}>
                      <Coins color="#f59e0b" size={12} fill="#f59e0b" style={{ marginRight: 3 }} />
                      <Text style={styles.coinAmountText}>{item.coins}</Text>
                    </View>
                  </View>
                </View>

                {/* 📅 কার্ডের নিচের অংশ (তারিখ) */}
                <View style={styles.cardFooter}>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>

              </View>
            );
          })
        ) : (
          // 📭 যদি কোনো হিস্ট্রি না থাকে
          <View style={styles.emptyContainer}>
            <History color="#1e293b" size={64} style={{ marginBottom: 15 }} />
            <Text style={styles.emptyTitle}>No History Found</Text>
            <Text style={styles.emptySubtitle}>You haven't made any withdrawal requests yet.</Text>
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
  topSummaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#1e293b",
  },
  summaryLabel: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  summaryValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 140,
  },
  historyCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e293b",
    paddingBottom: 10,
    marginBottom: 12,
  },
  methodBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountText: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "600",
  },
  txnIdText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  amountBox: {
    alignItems: "flex-end",
  },
  usdAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  coinAmountText: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "700",
  },
  cardFooter: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  dateText: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptySubtitle: {
    color: "#475569",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});