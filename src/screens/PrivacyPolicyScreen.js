import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ShieldCheck, Eye, Lock, RefreshCw } from "lucide-react-native";

export default function PrivacyPolicyScreen() {
  const lastUpdated = "July 2026"; // কারেন্ট ডেট অনুযায়ী আপডেট

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🛡️ টপ ব্যানার */}
        <View style={styles.headerCard}>
          <View style={styles.iconWrapper}>
            <ShieldCheck color="#64748b" size={48} />
          </View>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>Last Updated: {lastUpdated}</Text>
        </View>

        {/* 📜 পলিসি টেক্সট সেকশনসমূহ */}
        <View style={styles.contentCard}>
          
          {/* ১. ডাটা কালেকশন */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Eye color="#64748b" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            </View>
            <Text style={styles.bodyText}>
              We collect minimal information to provide you with a secure mining experience. This includes your account username, email address, and device identification logs to prevent fraudulent multiple accounts.
            </Text>
          </View>

          {/* ২. ডাটা সিকিউরিটি */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock color="#64748b" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>2. How We Protect Your Data</Text>
            </View>
            <Text style={styles.bodyText}>
              Your security is our priority. All balances, transaction history, and account credentials are encrypted and stored securely. We do not sell or share your data with third-party advertisers.
            </Text>
          </View>

          {/* ৩. নিয়ম ও শর্তাবলী */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <RefreshCw color="#64748b" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>3. Policy Changes</Text>
            </View>
            <Text style={styles.bodyText}>
              We reserve the right to modify this privacy policy at any time. Any updates will be reflected directly on this page with a revised "Last Updated" date. Continued use of MegaMinerApp constitutes acceptance of these terms.
            </Text>
          </View>

        </View>

        <Text style={styles.footerNote}>Thank you for trusting MegaMinerApp.</Text>

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
    marginBottom: 20,
    backgroundColor: "#111827",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  iconWrapper: {
    backgroundColor: "#64748b15",
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
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  contentCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  bodyText: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "justify",
  },
  footerNote: {
    color: "#475569",
    fontSize: 12,
    textAlign: "center",
    marginTop: 25,
    fontWeight: "600",
  },
});