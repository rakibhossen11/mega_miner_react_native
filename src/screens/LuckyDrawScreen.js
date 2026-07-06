import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ticket, Coins, Trophy, Calendar, CheckCircle2, AlertCircle } from "lucide-react-native";

export default function LuckyDrawScreen() {
  const [loading, setLoading] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const TICKET_COST = 50; // ১টি টিকেটের মূল্য ৫০ কয়েন
  const MEGA_PRIZE = 5000; // মেগা ড্রর প্রাইজ ৫০০০ কয়েন
  const DRAW_DATE = "Sunday, Midnight"; // ড্র হওয়ার ডেট

  useEffect(() => {
    loadDrawStatus();
  }, []);

  const loadDrawStatus = async () => {
    try {
      const savedTicket = await AsyncStorage.getItem("lucky_draw_ticket");
      if (savedTicket) {
        setTicketNumber(savedTicket);
        setHasEntered(true);
      }
    } catch (error) {
      console.log("Error loading draw status:", error);
    }
  };

  // 🎫 লাকি ড্রতে জয়েন করার ফাংশন
  const handleEnterDraw = async () => {
    if (hasEntered) return;

    Alert.alert(
      "Confirm Entry",
      `Joining the Lucky Draw will cost ${TICKET_COST} Coins. Do you want to proceed?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join Now",
          onPress: async () => {
            setLoading(true);

            // ৫ অংকের একটি ইউনিক র্যান্ডম টিকিট নম্বর জেনারেট করা (যেমন: MM-48291)
            setTimeout(async () => {
              const randomNumber = Math.floor(10000 + Math.random() * 90000);
              const generatedTicket = `MM-${randomNumber}`;

              try {
                await AsyncStorage.setItem("lucky_draw_ticket", generatedTicket);
                setTicketNumber(generatedTicket);
                setHasEntered(true);
                setLoading(false);

                Alert.alert(
                  "🎉 Successfully Entered!",
                  `Your Lucky Draw Ticket Number is: ${generatedTicket}. Winner will be announced soon!`
                );
              } catch (error) {
                setLoading(false);
                Alert.alert("Error", "Something went wrong.");
              }
            }, 1500); // ১.৫ সেকেন্ডের ডামি বুকিং এনিমেশন
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 🏆 মেগা প্রাইজ ব্যানার */}
        <View style={styles.prizeCard}>
          <Trophy color="#f59e0b" size={54} fill="#f59e0b20" style={styles.trophyIcon} />
          <Text style={styles.prizeTitle}>Mega Lucky Draw</Text>
          <View style={styles.rewardPoolBox}>
            <Coins color="#f59e0b" size={24} fill="#f59e0b" />
            <Text style={styles.rewardPoolText}>{MEGA_PRIZE} Coins Pool</Text>
          </View>
          <Text style={styles.prizeSubtitle}>One lucky winner takes it all!</Text>
        </View>

        {/* 📅 ড্র ইনফো বক্স */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Calendar color="#3b82f6" size={18} />
            <Text style={styles.infoBoxTitle}>Draw Date</Text>
            <Text style={styles.infoBoxValue}>{DRAW_DATE}</Text>
          </View>
          <View style={styles.infoBox}>
            <Coins color="#ec4899" size={18} />
            <Text style={styles.infoBoxTitle}>Entry Fee</Text>
            <Text style={styles.infoBoxValue}>{TICKET_COST} Coins</Text>
          </View>
        </View>

        {/* 🎴 টিকেট স্ট্যাটাস জোন */}
        <View style={styles.ticketSection}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text style={styles.loadingText}>Generating Your Ticket...</Text>
            </View>
          ) : hasEntered ? (
            // ✅ যদি অলরেডি টিকিট কেটে থাকে
            <View style={styles.activeTicketBox}>
              <CheckCircle2 color="#10b981" size={24} style={{ marginBottom: 10 }} />
              <Text style={styles.ticketStatusText}>You are in this week's draw!</Text>
              <View style={styles.ticketDesign}>
                <Ticket color="#090d16" size={32} />
                <Text style={styles.ticketNumberText}>{ticketNumber}</Text>
              </View>
              <Text style={styles.keepSafeText}>Keep this ticket number safe</Text>
            </View>
          ) : (
            // 🎫 যদি টিকিট না কেটে থাকে
            <View style={styles.noTicketBox}>
              <AlertCircle color="#64748b" size={32} style={{ marginBottom: 10 }} />
              <Text style={styles.noTicketText}>You haven't participated yet</Text>
              <TouchableOpacity style={styles.buyButton} onPress={handleEnterDraw}>
                <Ticket color="#fff" size={20} style={{ marginRight: 8 }} />
                <Text style={styles.buyButtonText}>Buy Draw Ticket</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 📜 কন্ডিশনাল গাইডলাইন */}
        <View style={styles.rulesBox}>
          <Text style={styles.rulesHeading}>Terms & Conditions</Text>
          <Text style={styles.ruleItem}>• You can buy only 1 ticket per weekly draw pool.</Text>
          <Text style={styles.ruleItem}>• Ticket cost is non-refundable once deducted.</Text>
          <Text style={styles.ruleItem}>• Winners are picked randomly via an automated secure system.</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  prizeCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  trophyIcon: {
    marginBottom: 10,
  },
  prizeTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  rewardPoolBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b10",
    borderWidth: 1,
    borderColor: "#f59e0b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginVertical: 12,
  },
  rewardPoolText: {
    color: "#f59e0b",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  prizeSubtitle: {
    color: "#64748b",
    fontSize: 13,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  infoBox: {
    backgroundColor: "#111827",
    width: "48%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  infoBoxTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },
  infoBoxValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
  ticketSection: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    minHeight: 180,
    justifyContent: "center",
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 12,
  },
  activeTicketBox: {
    alignItems: "center",
  },
  ticketStatusText: {
    color: "#10b981",
    fontSize: 15,
    fontWeight: "700",
  },
  ticketDesign: {
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 15,
    width: "90%",
    justifyContent: "center",
  },
  ticketNumberText: {
    color: "#090d16",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 10,
    letterSpacing: 1,
  },
  keepSafeText: {
    color: "#475569",
    fontSize: 12,
    marginTop: 10,
  },
  noTicketBox: {
    alignItems: "center",
  },
  noTicketText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  buyButton: {
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 16,
    width: "80%",
  },
  buyButtonText: {
    color: "#090d16",
    fontSize: 15,
    fontWeight: "bold",
  },
  rulesBox: {
    marginTop: 25,
    paddingHorizontal: 5,
  },
  rulesHeading: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  ruleItem: {
    color: "#475569",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});