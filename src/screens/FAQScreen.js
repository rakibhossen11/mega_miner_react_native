import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react-native";

export default function FAQScreen() {
  const [faqs, setFaqs] = useState([
    { id: 1, q: "How do I earn coins?", a: "You can earn coins by completing daily check-ins, watching reward ads, playing quizzes, scratching cards, and inviting friends!", open: false },
    { id: 2, q: "What is the minimum withdrawal amount?", a: "The minimum withdrawal limit is $10 USD (equivalent to 1,000 Coins).", open: false },
    { id: 3, q: "How long does it take to get paid?", a: "Withdrawals are processed automatically and usually take between 24 to 48 hours to arrive in your wallet.", open: false },
    { id: 4, q: "Can I create multiple accounts?", a: "No, multiple accounts from the same device or IP address are strictly prohibited and will result in a permanent ban.", open: false }
  ]);

  const toggleFAQ = (id) => {
    setFaqs(faqs.map(item => item.id === id ? { ...item, open: !item.open } : item));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerCard}>
          <HelpCircle color="#8b5cf6" size={40} style={{ marginBottom: 10 }} />
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>Find instant answers to the most common questions below.</Text>
        </View>

        {faqs.map(item => (
          <TouchableOpacity key={item.id} style={styles.faqBox} onPress={() => toggleFAQ(item.id)} activeOpacity={0.8}>
            <View style={styles.questionRow}>
              <Text style={styles.questionText}>{item.q}</Text>
              {item.open ? <ChevronUp color="#8b5cf6" size={18} /> : <ChevronDown color="#475569" size={18} />}
            </View>
            {item.open && <Text style={styles.answerText}>{item.a}</Text>}
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  headerCard: { alignItems: "center", marginTop: 20, marginBottom: 20, backgroundColor: "#111827", padding: 20, borderRadius: 20, borderWidth: 1, borderColor: "#1e293b" },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  subtitle: { color: "#64748b", fontSize: 12, textAlign: "center", marginTop: 6 },
  faqBox: { backgroundColor: "#111827", borderRadius: 14, padding: 16, marginVertical: 6, borderWidth: 1, borderColor: "#1e293b" },
  questionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  questionText: { color: "#fff", fontSize: 14, fontWeight: "700", flex: 1, marginRight: 10 },
  answerText: { color: "#94a3b8", fontSize: 13, marginTop: 10, lineHeight: 18, borderTopWidth: 0.5, borderTopColor: "#1e293b", paddingTop: 10 }
});