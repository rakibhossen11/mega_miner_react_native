import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { MessageSquare, Mail, Send, ShieldQuestion, ArrowUpRight } from "lucide-react-native";

export default function SupportScreen() {
  
  // ✈️ টেলিগ্রাম চ্যানেলে নিয়ে যাওয়ার ফাংশন
  const handleTelegramSupport = () => {
    const telegramUrl = "https://t.me/your_telegram_channel"; // 👈 এখানে তোমার আসল টেলিগ্রাম লিংক দেবে
    Linking.canOpenURL(telegramUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(telegramUrl);
        } else {
          Alert.alert("Error", "Can't open Telegram. Please install the app.");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  // ✉️ সরাসরি জিমেইল অ্যাপ ওপেন করার ফাংশন
  const handleEmailSupport = () => {
    const email = "support@megaminerapp.com"; // 👈 এখানে তোমার অফিশিয়াল ইমেইল দেবে
    const subject = "MegaMinerApp Support Request";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open email client.");
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 🎧 টপ ব্যানার */}
        <View style={styles.headerCard}>
          <View style={styles.iconWrapper}>
            <MessageSquare color="#06b6d4" size={48} />
          </View>
          <Text style={styles.title}>24/7 Help & Support</Text>
          <Text style={styles.subtitle}>
            Having trouble with mining or withdrawal? Contact us through any of the channels below.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Contact Channels</Text>

        {/* ✈️ ১. টেলিগ্রাম চ্যানেল বাটন */}
        <TouchableOpacity style={styles.supportButton} onPress={handleTelegramSupport}>
          <View style={styles.buttonLeft}>
            <View style={[styles.channelIconBox, { backgroundColor: "#06b6d415" }]}>
              <Send color="#06b6d4" size={22} style={{ marginRight: 2, marginTop: -2 }} /> 
            </View>
            <View>
              <Text style={styles.channelTitle}>Join Telegram Channel</Text>
              <Text style={styles.channelSubtitle}>Get instant updates & chat support</Text>
            </View>
          </View>
          <ArrowUpRight color="#475569" size={18} />
        </TouchableOpacity>

        {/* ✉️ ২. ইমেইল সাপোর্ট বাটন */}
        <TouchableOpacity style={styles.supportButton} onPress={handleEmailSupport}>
          <View style={styles.buttonLeft}>
            <View style={[styles.channelIconBox, { backgroundColor: "#10b98115" }]}>
              <Mail color="#10b981" size={22} />
            </View>
            <View>
              <Text style={styles.channelTitle}>Email Support</Text>
              <Text style={styles.channelSubtitle}>Response within 12-24 hours</Text>
            </View>
          </View>
          <ArrowUpRight color="#475569" size={18} />
        </TouchableOpacity>

        {/* 💬 ৩. ইন-অ্যাপ চ্যাট বাটন (সিমুলেশন) */}
        <TouchableOpacity style={styles.supportButton} onPress={() => Alert.alert("Live Chat", "Live Chat agent is currently offline. Please use Telegram!")}>
          <View style={styles.buttonLeft}>
            <View style={[styles.channelIconBox, { backgroundColor: "#8b5cf615" }]}>
              <MessageSquare color="#8b5cf6" size={22} />
            </View>
            <View>
              <Text style={styles.channelTitle}>Live Chat Agent</Text>
              <Text style={styles.channelSubtitle}>Talk directly with our admin</Text>
            </View>
          </View>
          <ArrowUpRight color="#475569" size={18} />
        </TouchableOpacity>

        {/* 💡 নোট বক্স */}
        <View style={styles.noteBox}>
          <ShieldQuestion color="#475569" size={16} style={{ marginRight: 6, marginTop: 2 }} />
          <Text style={styles.noteText}>
            Please include your registered email address and username while submitting a ticket so we can help you faster.
          </Text>
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
    paddingBottom: 140,
  },
  headerCard: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: "#111827",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  iconWrapper: {
    backgroundColor: "#06b6d415",
    padding: 16,
    borderRadius: 50,
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
  },
  supportButton: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  buttonLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  channelIconBox: {
    padding: 12,
    borderRadius: 14,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
    width: 46,
    height: 46,
  },
  channelTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  channelSubtitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 3,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 25,
    backgroundColor: "#11182705",
    paddingHorizontal: 5,
  },
  noteText: {
    color: "#475569",
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});