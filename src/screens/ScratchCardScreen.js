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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🔑 ফিক্সড ইমপোর্ট
import { Ticket, Coins, Sparkles, RefreshCw, Info } from "lucide-react-native";

export default function ScratchCardScreen() {
  const [isScratched, setIsScratched] = useState(false);
  const [wonCoins, setWonCoins] = useState(0);
  const [cardsLeft, setCardsLeft] = useState(3); 
  const DAILY_LIMIT = 3;

  useEffect(() => {
    loadScratchCardsCount();
  }, []);

  const loadScratchCardsCount = async () => {
    try {
      const savedDate = await AsyncStorage.getItem("last_scratch_date");
      const savedCount = await AsyncStorage.getItem("scratch_count_today");
      
      const todayStr = new Date().toDateString();

      if (savedDate === todayStr) {
        const count = savedCount ? parseInt(savedCount, 10) : 0;
        setCardsLeft(DAILY_LIMIT - count);
      } else {
        await AsyncStorage.setItem("last_scratch_date", todayStr);
        await AsyncStorage.setItem("scratch_count_today", "0");
        setCardsLeft(DAILY_LIMIT);
      }
    } catch (error) {
      console.log("Error loading scratch data:", error);
    }
  };

  const handleScratch = async () => {
    if (cardsLeft <= 0) {
      Alert.alert("Limit Reached", "No cards left for today! Come back tomorrow.");
      return;
    }
    if (isScratched) return;

    const randomCoins = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    setWonCoins(randomCoins);
    setIsScratched(true);

    try {
      const todayCount = DAILY_LIMIT - cardsLeft;
      const nextCount = todayCount + 1;
      await AsyncStorage.setItem("scratch_count_today", nextCount.toString());
      setCardsLeft(DAILY_LIMIT - nextCount);

      Alert.alert("🎉 Congratulations!", `You won +${randomCoins} Coins from this scratch card!`);
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleNextCard = () => {
    setIsScratched(false);
    setWonCoins(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.mainCard}>
          <View style={styles.iconWrapper}>
            <Ticket color="#f59e0b" size={50} />
          </View>
          <Text style={styles.title}>Scratch & Win</Text>
          <Text style={styles.subtitle}>
            Tap on the golden card below to scratch and reveal your lucky prize!
          </Text>
        </View>

        <View style={styles.limitBox}>
          <Text style={styles.limitText}>
            Remaining Cards Today: <Text style={{ color: "#f59e0b" }}>{cardsLeft}</Text>
          </Text>
        </View>

        <View style={styles.cardContainer}>
          {!isScratched ? (
            <TouchableOpacity 
              style={styles.goldenCard} 
              onPress={handleScratch}
              activeOpacity={0.8}
              disabled={cardsLeft <= 0}
            >
              <Sparkles color="#fff" size={40} style={styles.sparkleIcon} />
              <Text style={styles.scratchPrompt}>TAP TO SCRATCH</Text>
              <Text style={styles.winUpTo}>Win up to 100 Coins</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.revealedCard}>
              <Sparkles color="#f59e0b" size={30} />
              <Text style={styles.youWonText}>YOU WON</Text>
              <View style={styles.coinRewardBox}>
                <Coins color="#f59e0b" size={32} fill="#f59e0b" />
                <Text style={styles.rewardAmountText}>{wonCoins}</Text>
              </View>
              <Text style={styles.coinsUnitText}>Coins</Text>
            </View>
          )}
        </View>

        {isScratched && cardsLeft > 0 && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextCard}>
            <RefreshCw color="#fff" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.nextButtonText}>Scratch Next Card</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoContainer}>
          <Info color="#475569" size={14} style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>Cards reset automatically every midnight.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120, alignItems: "center" },
  mainCard: { width: "100%", alignItems: "center", marginTop: 20, marginBottom: 20, backgroundColor: "#111827", padding: 24, borderRadius: 24, borderWidth: 1, borderColor: "#1e293b" },
  iconWrapper: { backgroundColor: "#f59e0b15", padding: 20, borderRadius: 50, marginBottom: 15 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 18 },
  limitBox: { backgroundColor: "#111827", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#1e293b", marginBottom: 25 },
  limitText: { color: "#94a3b8", fontSize: 14, fontWeight: "600" },
  cardContainer: { width: "85%", height: 200, marginVertical: 10, borderRadius: 24, elevation: 10, shadowColor: "#f59e0b", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 12 },
  goldenCard: { flex: 1, backgroundColor: "#f59e0b", borderRadius: 24, justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: "#fff" },
  sparkleIcon: { marginBottom: 10, opacity: 0.9 },
  scratchPrompt: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  winUpTo: { color: "#fff", fontSize: 12, fontWeight: "600", marginTop: 5, opacity: 0.8 },
  revealedCard: { flex: 1, backgroundColor: "#111827", borderRadius: 24, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#1e293b" },
  youWonText: { color: "#64748b", fontSize: 14, fontWeight: "bold", letterSpacing: 1, marginTop: 5 },
  coinRewardBox: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  rewardAmountText: { color: "#fff", fontSize: 36, fontWeight: "900", marginLeft: 10 },
  coinsUnitText: { color: "#f59e0b", fontSize: 14, fontWeight: "700", marginTop: 2 },
  nextButton: { backgroundColor: "#1e293b", borderColor: "#334155", borderWidth: 1, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 30, width: "85%" },
  nextButtonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  infoContainer: { flexDirection: "row", alignItems: "center", marginTop: 25 },
  infoText: { color: "#475569", fontSize: 12 }
});