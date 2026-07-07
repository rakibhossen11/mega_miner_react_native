import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Wallet, Coins, Smartphone, ShieldCheck, ArrowRight } from "lucide-react-native";

export default function WithdrawScreen() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userCoins, setUserCoins] = useState(2500); // ডিফল্ট ব্যালেন্স
  const [selectedMethod, setSelectedMethod] = useState("bKash"); // ডিফল্ট মেথড
  const [accountNumber, setAccountNumber] = useState("");
  const [amountCoins, setAmountCoins] = useState("");

  const MIN_WITHDRAW_COINS = 1000; // সর্বনিম্ন ১০০০ কয়েন (ধরা যাক $১০)

  // 🔄 স্ক্রিন ওপেন হলেই লোকাল স্টোরেজ থেকে ইউজারের কয়েন ব্যালেন্স লোড হবে
  useEffect(() => {
    loadUserBalance();
  }, []);

  const loadUserBalance = async () => {
    try {
      const savedCoins = await AsyncStorage.getItem("user_total_coins");
      if (savedCoins) {
        setUserCoins(parseInt(savedCoins, 10));
      } else {
        // প্রথমবার ওপেন হলে ডিফল্ট ২৫০০ কয়েন স্টোরেজে সেভ হবে
        await AsyncStorage.setItem("user_total_coins", "2500");
      }
    } catch (error) {
      console.log("Balance load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 💸 উইথড্র সাবমিট করার মেইন লজিক
  const handleWithdrawSubmit = async () => {
    const coinsToWithdraw = parseInt(amountCoins, 10);

    if (!accountNumber.trim() || !amountCoins.trim()) {
      Alert.alert("Required Fields ❌", "Please fill up all the fields properly.");
      return;
    }

    if (isNaN(coinsToWithdraw) || coinsToWithdraw < MIN_WITHDRAW_COINS) {
      Alert.alert("Minimum Limit ⚠️", `Minimum withdrawal amount is ${MIN_WITHDRAW_COINS} Coins.`);
      return;
    }

    if (coinsToWithdraw > userCoins) {
      Alert.alert("Insufficient Balance ❌", "You do not have enough coins in your wallet.");
      return;
    }

    Alert.alert(
      "Confirm Withdrawal",
      `Are you sure you want to withdraw ${coinsToWithdraw} Coins to your ${selectedMethod} account?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setSubmitting(true);
            
            // ১.৫ সেকেন্ডের ডামি ট্রানজেকশন প্রসেসিং এনিমেশন
            setTimeout(async () => {
              try {
                const updatedBalance = userCoins - coinsToWithdraw;
                
                // 💾 লোকাল স্টোরেজে নতুন ব্যালেন্স সেভ করা
                await AsyncStorage.setItem("user_total_coins", updatedBalance.toString());
                
                setUserCoins(updatedBalance);
                setAccountNumber("");
                setAmountCoins("");
                setSubmitting(false);

                Alert.alert(
                  "🎉 Request Submitted!",
                  "Your withdrawal request has been placed successfully. It will be reviewed within 24 hours."
                );
              } catch (error) {
                setSubmitting(false);
                Alert.alert("Error", "Something went wrong.");
              }
            }, 1500);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 💳 ওয়ালেট ব্যালেন্স কার্ড */}
        <View style={styles.walletCard}>
          <Wallet color="#f59e0b" size={36} style={{ marginBottom: 10 }} />
          <Text style={styles.walletLabel}>Available Balance</Text>
          <View style={styles.coinRow}>
            <Coins color="#f59e0b" size={24} fill="#f59e0b" style={{ marginRight: 8 }} />
            <Text style={styles.coinText}>{userCoins} Coins</Text>
          </View>
          <Text style={styles.walletSubText}>100 Coins = $1.00 USD (Approx)</Text>
        </View>

        {/* 🎯 মেথড সিলেকশন */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.methodRow}>
          {["bKash", "Nagad", "USDT"].map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.methodButton, selectedMethod === method ? styles.activeMethod : null]}
              onPress={() => setSelectedMethod(method)}
            >
              <Text style={[styles.methodText, selectedMethod === method ? styles.activeMethodText : null]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 📝 ফর্ম ইনপুট সেকশন */}
        <View style={styles.formContainer}>
          
          <Text style={styles.inputLabel}>{selectedMethod} Account Number / Address</Text>
          <View style={styles.inputWrapper}>
            <Smartphone color="#64748b" size={18} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInput}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder={selectedMethod === "USDT" ? "Enter TRC20 Address" : "Enter personal number"}
              placeholderTextColor="#475569"
              keyboardType={selectedMethod === "USDT" ? "default" : "phone-pad"}
            />
          </View>

          <Text style={styles.inputLabel}>Amount of Coins</Text>
          <View style={styles.inputWrapper}>
            <Coins color="#64748b" size={18} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInput}
              value={amountCoins}
              onChangeText={setAmountCoins}
              placeholder="Minimum 1000"
              placeholderTextColor="#475569"
              keyboardType="numeric"
            />
          </View>

        </View>

        {/* 🚀 মেইন উইথড্র বাটন */}
        <TouchableOpacity
          style={[styles.withdrawButton, submitting ? styles.disabledButton : null]}
          onPress={handleWithdrawSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#090d16" />
          ) : (
            <>
              <Text style={styles.withdrawButtonText}>Submit Withdrawal</Text>
              <ArrowRight color="#090d16" size={18} style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>

        {/* 🛡️ সিকিউরিটি নোট */}
        <View style={styles.securityBox}>
          <ShieldCheck color="#10b981" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.securityText}>Secured and encrypted transaction gateway.</Text>
        </View>

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
    paddingBottom: 140,
  },
  walletCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 25,
  },
  walletLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  coinText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  walletSubText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  methodButton: {
    backgroundColor: "#111827",
    width: "31%",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  activeMethod: {
    borderColor: "#f59e0b",
    backgroundColor: "#f59e0b10",
  },
  methodText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
  },
  activeMethodText: {
    color: "#f59e0b",
  },
  formContainer: {
    width: "100%",
  },
  inputLabel: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: "#111827",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  withdrawButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 16,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#1e293b",
    shadowOpacity: 0,
    elevation: 0,
  },
  withdrawButtonText: {
    color: "#090d16",
    fontSize: 16,
    fontWeight: "bold",
  },
  securityBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  securityText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },
});

// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import { updateBalances } from "../store/walletSlice";
// import { ArrowRightLeft, Send } from "lucide-react-native";
// import Toast from "react-native-toast-message";

// export default function WithdrawScreen() {
//   const dispatch = useDispatch();
//   const { totalCoin, totalDollar } = useSelector((state) => state.wallet);
  
//   const [convertInput, setConvertInput] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [withdrawAmount, setWithdrawAmount] = useState("");

//   const handleConvert = async () => {
//     const coins = Math.floor(parseFloat(convertInput));
//     if (!coins || coins < 1000) {
//       Toast.show({ type: "error", text1: "Failed", text2: "Minimum conversion 1,000 Coins" });
//       return;
//     }
//     try {
//       const res = await fetch("https://your-live-domain.com/api/dashboard/convert", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ coinsToMinus: coins })
//       });
//       const json = await res.json();
//       if (json.success) {
//         dispatch(updateBalances({ newTotalCoin: json.newTotalCoin, newTotalDollar: json.newTotalDollar }));
//         setConvertInput("");
//         Toast.show({ type: "success", text1: "Success", text2: json.message });
//       }
//     } catch {
//       Toast.show({ type: "error", text1: "Error", text2: "Conversion pipeline blocking." });
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
//       <View style={styles.tileGrid}>
//         <View style={styles.tile}><Text style={styles.tileLbl}>Mined Balance</Text><Text style={styles.tileVal}>{totalCoin.toFixed(2)}</Text></View>
//         <View style={styles.tile}><Text style={styles.tileLbl}>USD Asset</Text><Text style={[styles.tileVal, {color: "#10b981"}]}>${totalDollar.toFixed(2)}</Text></View>
//       </View>

//       <View style={styles.card}>
//         <View style={styles.cardHead}><ArrowRightLeft color="#f59e0b" size={16} /><Text style={styles.cardTitle}>Converter Subsystem</Text></View>
//         <TextInput
//           placeholder="Enter volume (Min 1,000)"
//           placeholderTextColor="#475569"
//           keyboardType="numeric"
//           style={styles.input}
//           value={convertInput}
//           onChangeText={setConvertInput}
//         />
//         <TouchableOpacity style={styles.btnGold} onPress={handleConvert}><Text style={styles.btnGoldTxt}>CONVERT ASSETS</Text></TouchableOpacity>
//       </View>

//       <View style={styles.card}>
//         <View style={styles.cardHead}><Send color="#06b6d4" size={16} /><Text style={styles.cardTitle}>Secure USD Withdrawal</Text></View>
//         <TextInput placeholder="bKash/Nagad Number" placeholderTextColor="#475569" keyboardType="phone-pad" style={styles.input} value={accountNumber} onChangeText={setAccountNumber} />
//         <TextInput placeholder="Amount (USD)" placeholderTextColor="#475569" keyboardType="numeric" style={styles.input} value={withdrawAmount} onChangeText={setWithdrawAmount} />
//         <TouchableOpacity style={styles.btnCyan} onPress={() => Toast.show({ type: "success", text1: "Fired", text2: "Request sent!" })}><Text style={styles.btnCyanTxt}>FIRE PAYOUT PIPELINE</Text></TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#090d16" },
//   tileGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
//   tile: { flex: 1, backgroundColor: "#111827", padding: 14, borderRadius: 12, borderWith: 1, borderColor: "#1e293b" },
//   tileLbl: { color: "#64748b", fontSize: 9, fontWeight: "bold", uppercase: true },
//   tileVal: { color: "#f59e0b", fontSize: 16, fontWeight: "900", fontFamily: "monospace", marginTop: 4 },
//   card: { backgroundColor: "#111827", padding: 16, borderRadius: 16, marginBottom: 16 },
//   cardHead: { flexDirection: "row", items: "center", gap: 8, marginBottom: 12 },
//   cardTitle: { color: "#fff", fontSize: 12, fontWeight: "bold" },
//   input: { backgroundColor: "#020617", color: "#fff", padding: 12, borderRadius: 10, fontSize: 12, borderWidth: 1, borderColor: "#1e293b", marginBottom: 12, fontFamily: "monospace" },
//   btnGold: { backgroundColor: "#f59e0b", padding: 14, borderRadius: 10, alignItems: "center" },
//   btnGoldTxt: { color: "#090d16", fontWeight: "900", fontSize: 11 },
//   btnCyan: { backgroundColor: "#06b6d4", padding: 14, borderRadius: 10, alignItems: "center" },
//   btnCyanTxt: { color: "#090d16", fontWeight: "900", fontSize: 11 }
// });