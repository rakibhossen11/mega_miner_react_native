import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  StatusBar,
  SafeAreaView
} from "react-native";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/walletSlice";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🔑 ইমেল সেভ রাখার জন্য
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 🔄 স্ক্রিন ওপেন হলেই চেক করবে আগে কোনো ইমেইল সেভ করা আছে কি না
    useEffect(() => {
        getSavedEmail();
    }, []);

    const getSavedEmail = async () => {
        try {
            const savedEmail = await AsyncStorage.getItem("saved_user_email");
            if (savedEmail) {
                setEmail(savedEmail); // 🔑 অটোমেটিক ইমেইল বসে যাবে
            }
        } catch (error) {
            console.log("Error fetching saved email:", error);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({ type: "error", text1: "Error", text2: "Please fill all fields" });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://192.168.0.109:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                // 💾 লগইন সফল হলে ইমেইলটি লোকাল স্টোরেজে সেভ করে রাখবে
                await AsyncStorage.setItem("saved_user_email", email);

                dispatch(setAuth({ userId: data.user.userId, username: data.user.username }));
                Toast.show({ type: "success", text1: "Welcome Back", text2: data.message });
            } else {
                Toast.show({ type: "error", text1: "Failed", text2: data.error });
            }
        } catch {
            Toast.show({ type: "error", text1: "Network Error", text2: "Backend server down" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#090d16" />
            
            <View style={styles.card}>
                {/* 🎯 টপ গ্লোয়িং হেডার */}
                <View style={styles.header}>
                    <View style={styles.iconGlow}>
                        <LogIn color="#f59e0b" size={32} />
                    </View>
                    <Text style={styles.title}>Sign In to Account</Text>
                    <Text style={styles.subtitle}>Welcome back! Please enter your details.</Text>
                </View>

                {/* ✉️ ইমেল ইনপুট ফিল্ড */}
                <Text style={styles.inputLabel}>Username or Email</Text>
                <View style={styles.inputWrapper}>
                    <Mail color="#64748b" size={18} style={styles.icon} />
                    <TextInput
                        placeholder="example@miner.com"
                        placeholderTextColor="#475569"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                {/* 🔒 পাসওয়ার্ড ইনপুট ফিল্ড */}
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                    <Lock color="#64748b" size={18} style={styles.icon} />
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#475569"
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        {showPassword ? <EyeOff color="#64748b" size={18} /> : <Eye color="#64748b" size={18} />}
                    </TouchableOpacity>
                </View>

                {/* 🚀 সাইন ইন বাটন */}
                <TouchableOpacity style={[styles.btn, loading ? styles.disabledBtn : null]} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#090d16" />
                    ) : (
                        <View style={styles.btnContent}>
                            <Text style={styles.btnText}>SIGN IN</Text>
                            <Sparkles color="#090d16" size={16} fill="#090d16" style={{ marginLeft: 6 }} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#090d16", 
        justifyContent: "center", 
        padding: 20 
    },
    card: { 
        backgroundColor: "#111827", 
        padding: 26, 
        borderRadius: 28, 
        borderWidth: 1, // 🛠️ borderWith ফিক্স করা হয়েছে
        borderColor: "#1e293b",
        shadowColor: "#f59e0b",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    header: { 
        alignItems: "center", 
        marginBottom: 28, 
        justifyContent: "center" 
    },
    iconGlow: {
        backgroundColor: "#f59e0b10",
        padding: 14,
        borderRadius: 50,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#f59e0b20",
    },
    title: { 
        color: "#fff", 
        fontSize: 22, 
        fontWeight: "900",
        letterSpacing: 0.5,
    },
    subtitle: {
        color: "#64748b",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 4,
        textAlign: "center",
    },
    inputLabel: {
        color: "#94a3b8",
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 8,
        marginLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    inputWrapper: { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#020617", 
        borderWidth: 1, 
        borderColor: "#1e293b", 
        borderRadius: 14, 
        paddingHorizontal: 14, 
        height: 54, 
        marginBottom: 20 
    },
    icon: { 
        marginRight: 12 
    },
    input: { 
        flex: 1, 
        color: "#fff", 
        fontSize: 14,
        fontWeight: "600",
    },
    eyeIcon: {
        padding: 4,
    },
    btn: { 
        backgroundColor: "#f59e0b", 
        height: 54, 
        borderRadius: 14, 
        justifyContent: "center", 
        alignItems: "center", 
        marginTop: 10,
        shadowColor: "#f59e0b",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    disabledBtn: {
        backgroundColor: "#d97706",
        opacity: 0.8,
    },
    btnContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    btnText: { 
        color: "#090d16", 
        fontSize: 15, 
        fontWeight: "900", 
        letterSpacing: 1 
    }
});