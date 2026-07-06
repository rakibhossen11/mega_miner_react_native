import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateBalances } from "../store/walletSlice";
import { ArrowRightLeft, Send } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function WithdrawScreen() {
  const dispatch = useDispatch();
  const { totalCoin, totalDollar } = useSelector((state) => state.wallet);
  
  const [convertInput, setConvertInput] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleConvert = async () => {
    const coins = Math.floor(parseFloat(convertInput));
    if (!coins || coins < 1000) {
      Toast.show({ type: "error", text1: "Failed", text2: "Minimum conversion 1,000 Coins" });
      return;
    }
    try {
      const res = await fetch("https://your-live-domain.com/api/dashboard/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coinsToMinus: coins })
      });
      const json = await res.json();
      if (json.success) {
        dispatch(updateBalances({ newTotalCoin: json.newTotalCoin, newTotalDollar: json.newTotalDollar }));
        setConvertInput("");
        Toast.show({ type: "success", text1: "Success", text2: json.message });
      }
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "Conversion pipeline blocking." });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.tileGrid}>
        <View style={styles.tile}><Text style={styles.tileLbl}>Mined Balance</Text><Text style={styles.tileVal}>{totalCoin.toFixed(2)}</Text></View>
        <View style={styles.tile}><Text style={styles.tileLbl}>USD Asset</Text><Text style={[styles.tileVal, {color: "#10b981"}]}>${totalDollar.toFixed(2)}</Text></View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}><ArrowRightLeft color="#f59e0b" size={16} /><Text style={styles.cardTitle}>Converter Subsystem</Text></View>
        <TextInput
          placeholder="Enter volume (Min 1,000)"
          placeholderTextColor="#475569"
          keyboardType="numeric"
          style={styles.input}
          value={convertInput}
          onChangeText={setConvertInput}
        />
        <TouchableOpacity style={styles.btnGold} onPress={handleConvert}><Text style={styles.btnGoldTxt}>CONVERT ASSETS</Text></TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}><Send color="#06b6d4" size={16} /><Text style={styles.cardTitle}>Secure USD Withdrawal</Text></View>
        <TextInput placeholder="bKash/Nagad Number" placeholderTextColor="#475569" keyboardType="phone-pad" style={styles.input} value={accountNumber} onChangeText={setAccountNumber} />
        <TextInput placeholder="Amount (USD)" placeholderTextColor="#475569" keyboardType="numeric" style={styles.input} value={withdrawAmount} onChangeText={setWithdrawAmount} />
        <TouchableOpacity style={styles.btnCyan} onPress={() => Toast.show({ type: "success", text1: "Fired", text2: "Request sent!" })}><Text style={styles.btnCyanTxt}>FIRE PAYOUT PIPELINE</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  tileGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
  tile: { flex: 1, backgroundColor: "#111827", padding: 14, borderRadius: 12, borderWith: 1, borderColor: "#1e293b" },
  tileLbl: { color: "#64748b", fontSize: 9, fontWeight: "bold", uppercase: true },
  tileVal: { color: "#f59e0b", fontSize: 16, fontWeight: "900", fontFamily: "monospace", marginTop: 4 },
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 16, marginBottom: 16 },
  cardHead: { flexDirection: "row", items: "center", gap: 8, marginBottom: 12 },
  cardTitle: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  input: { backgroundColor: "#020617", color: "#fff", padding: 12, borderRadius: 10, fontSize: 12, borderWidth: 1, borderColor: "#1e293b", marginBottom: 12, fontFamily: "monospace" },
  btnGold: { backgroundColor: "#f59e0b", padding: 14, borderRadius: 10, alignItems: "center" },
  btnGoldTxt: { color: "#090d16", fontWeight: "900", fontSize: 11 },
  btnCyan: { backgroundColor: "#06b6d4", padding: 14, borderRadius: 10, alignItems: "center" },
  btnCyanTxt: { color: "#090d16", fontWeight: "900", fontSize: 11 }
});