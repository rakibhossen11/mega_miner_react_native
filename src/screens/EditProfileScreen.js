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
import { User, Mail, Phone, Save, Camera } from "lucide-react-native";

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 🔄 স্ক্রিন ওপেন হলেই লোকাল স্টোরেজ থেকে ইউজারের কারেন্ট প্রোফাইল ডাটা লোড হবে
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedName = await AsyncStorage.getItem("user_name");
      const savedEmail = await AsyncStorage.getItem("user_email");
      const savedPhone = await AsyncStorage.getItem("user_phone");

      // যদি আগে কোনো ডাটা সেভ না থাকে, তবে ডিফল্ট ডামি ডাটা সেট হবে
      setName(savedName || "Alex Mercer");
      setEmail(savedEmail || "alex.mercer@miner.com");
      setPhone(savedPhone || "+8801700000000");
    } catch (error) {
      console.log("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 💾 প্রোফাইল ডাটা সেভ করার ফাংশন
  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Required Fields", "Name and Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      await AsyncStorage.setItem("user_name", name);
      await AsyncStorage.setItem("user_email", email);
      await AsyncStorage.setItem("user_phone", phone);

      setTimeout(() => {
        setSaving(false);
        Alert.alert("🎉 Success!", "Your profile profile changes have been saved.");
      }, 1000); // ১ সেকেন্ডের স্মুথ সেভিং এনিমেশন
    } catch (error) {
      setSaving(false);
      Alert.alert("Error", "Something went wrong while saving data.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 📸 প্রোফাইল অবতার ও ক্যামেরা আইকন */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarTextBig}>{name ? name[0].toUpperCase() : "U"}</Text>
          </View>
          <TouchableOpacity style={styles.cameraBadge} onPress={() => Alert.alert("Upload", "Image upload feature coming soon with expo-image-picker!")}>
            <Camera color="#fff" size={14} fill="#fff" />
          </TouchableOpacity>
        </View>

        {/* 📝 ইনপুট ফর্ম সেকশন */}
        <View style={styles.formContainer}>
          
          {/* ১. নাম ইনপুট */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <User color="#64748b" size={18} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#475569"
            />
          </View>

          {/* ২. ইমেল ইনপুট */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail color="#64748b" size={18} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* ৩. ফোন ইনপুট */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Phone color="#64748b" size={18} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#475569"
              keyboardType="phone-pad"
            />
          </View>

        </View>

        {/* 🚀 সেভ চেঞ্জেস বাটন */}
        <TouchableOpacity
          style={[styles.saveButton, saving ? styles.disabledButton : null]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Save color="#090d16" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

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
  avatarSection: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
    position: "relative",
    alignSelf: "center",
  },
  avatarBig: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  avatarTextBig: {
    color: "#3b82f6",
    fontSize: 36,
    fontWeight: "bold",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#090d16",
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
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#1e293b",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: "#090d16",
    fontSize: 16,
    fontWeight: "bold",
  },
});