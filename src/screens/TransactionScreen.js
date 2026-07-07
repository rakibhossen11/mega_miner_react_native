import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ArrowRightLeft, Coins, ArrowUpRight, ArrowDownLeft, Sparkles, Tv, Gift } from "lucide-react-native";

export default function TransactionScreen() {
  
  // 📊 ডামি ট্রানজেকশন হিস্ট্রি লিস্ট (রিয়েল অ্যাপে এটি API বা Database থেকে আসবে)
  const transactionData = [
    {
      id: "TXN-QUIZ-102",
      title: "Quiz Reward",
      desc: "Answered 3 questions correctly",
      coins: 60,
      type: "credit", // credit মানে প্লাস/ইনকাম
      date: "07 July 2026",
      icon: ArrowDownLeft,
      color: "#10b981", // সবুজ
    },
    {
      id: "TXN-DRAW-441",
      title: "Lucky Draw Entry",
      desc: "Weekly Mega Pool Ticket purchased",
      coins: 50,
      type: "debit", // debit মানে মাইনাস/খরচ
      date: "06 July 2026",
      icon: ArrowUpRight,
      color: "#ef4444", // লাল
    },
    {
      id: "TXN-SPIN-892",
      title: "Spin Wheel Win",
      desc: "Lucky Wheel grand prize",
      coins: 100,
      type: "credit",
      date: "05 July 2026",
      icon: Sparkles,
      color: "#10b981",
    },
    {
      id: "TXN-AD-551",
      title: "Video Ad Reward",
      desc: "Watched complete rewarded ad",
      coins: 25,
      type: "credit",
      date: "05 July 2026",
      icon: Tv,
      color: "#10b981",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      
      {/* 🔝 টপ সামারি বার */}
      <View style={styles.topSummaryBar}>
        <Text style={styles.summaryLabel}>Total Records:</Text>
        <Text style={styles.summaryValue}>{transactionData.length} Statements</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {transactionData.length > 0 ? (
          transactionData.map((item) => {
            const IconComponent = item.icon;
            return (
              <View key={item.id} style={styles.txnCard}>
                
                {/* বামপাশের আইকন বক্স (ডাইনামিক কালার) */}
                <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                  <IconComponent color={item.color} size={20} />
                </View>

                {/* মাঝখানের টেক্সট এরিয়া */}
                <View style={styles.textContainer}>
                  <Text style={styles.txnTitle}>{item.title}</Text>
                  <Text style={styles.txnDesc} numberOfLines={1}>{item.desc}</Text>
                  <Text style={styles.txnDate}>{item.date} • {item.id}</Text>
                </View>

                {/* ডানপাশের কয়েন অ্যামাউন্ট */}
                <View style={styles.amountBox}>
                  <View style={styles.coinRow}>
                    <Coins color="#f59e0b" size={14} fill="#f59e0b" style={{ marginRight: 4 }} />
                    <Text style={[styles.coinAmount, { color: item.type === "credit" ? "#10b981" : "#ef4444" }]}>
                      {item.type === "credit" ? "+" : "-"}
                      {item.coins}
                    </Text>
                  </View>
                  <Text style={styles.typeText}>{item.type === "credit" ? "Income" : "Expense"}</Text>
                </View>

              </View>
            );
          })
        ) : (
          // 📭 যদি কোনো ট্রানজেকশন না থাকে
          <View style={styles.emptyContainer}>
            <ArrowRightLeft color="#1e293b" size={64} style={{ marginBottom: 15 }} />
            <Text style={styles.emptyTitle}>No Transactions</Text>
            <Text style={styles.emptySubtitle}>Your earning ledger is currently empty.</Text>
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
  txnCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    padding: 12,
    borderRadius: 14,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  txnTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  txnDesc: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 3,
  },
  txnDate: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },
  amountBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinAmount: {
    fontSize: 16,
    fontWeight: "900",
  },
  typeText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
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