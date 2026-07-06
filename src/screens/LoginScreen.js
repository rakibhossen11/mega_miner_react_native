import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/walletSlice";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                dispatch(setAuth({ userId: data.user.userId, username: data.user.username }));
                Toast.show({ type: "success", text1: "Welcome", text2: data.message });
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
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <LogIn color="#f59e0b" size={28} />
                    <Text style={styles.title}>Sign In to Account</Text>
                </View>

                <View style={styles.inputWrapper}>
                    <Mail color="#64748b" size={16} style={styles.icon} />
                    <TextInput
                        placeholder="Username or Email"
                        placeholderTextColor="#475569"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Lock color="#64748b" size={16} style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#475569"
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff color="#64748b" size={16} /> : <Eye color="#64748b" size={16} />}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#090d16" /> : <Text style={styles.btnText}>SIGN IN</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#090d16", justifyContent: "center", padding: 20 },
    card: { backgroundColor: "#111827", padding: 24, borderRadius: 24, borderWith: 1, borderColor: "#1e293b" },
    header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 24, justifyContent: "center" },
    title: { color: "#fff", fontSize: 20, fontWeight: "900" },
    inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#020617", borderWidth: 1, borderColor: "#1e293b", borderRadius: 12, paddingHorizontal: 12, height: 50, marginBottom: 16 },
    icon: { marginRight: 10 },
    input: { flex: 1, color: "#fff", fontSize: 13 },
    btn: { backgroundColor: "#f59e0b", height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 8 },
    btnText: { color: "#090d16", fontSize: 14, fontWeight: "900", trackingWith: 1 }
});