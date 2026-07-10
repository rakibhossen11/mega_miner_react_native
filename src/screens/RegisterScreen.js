import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/authSlice';
import { authService } from '../api/authService';
import { useNavigation } from '@react-navigation/native'; // 🛠️ ১. এই ইমপোর্টটি মিসিং ছিল
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const dispatch = useDispatch();
  console.log(dispatch);
  const navigation = useNavigation(); // ⚡ এখন এটি পারফেক্টলি কাজ করবে
  
  // Redux থেকে স্টেট নেওয়া
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  // লোকাল স্টেট
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error দেখানোর জন্য
  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // রেজিস্ট্রেশন সফল হলে নেভিগেট করা
  React.useEffect(() => {
    if (isAuthenticated) {
      Alert.alert(
        'Success 🎉',
        'Account created successfully!',
        [
          {
            text: 'Continue',
            onPress: () => {
              // ফর্ম রিসেট করা
              setFullName('');
              setUsername('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              
              // 🛠️ ২. রিডাক্সে isAuthenticated ট্রু হলে AppNavigator নিজে থেকেই বটম বারে নিয়ে যাবে। 
              // তাই এখানে আলাদা করে replace করার প্রয়োজন নেই, ব্যাক করে লগইন বা স্ট্যাকে রাখা ভালো।
              // অথবা চাইলে সরাসরি আপনার হোম ট্যাবে পাঠাতে পারেন: navigation.navigate('HomeTab');
            }
          }
        ]
      );
    }
  }, [isAuthenticated]);

  const handleRegister = async () => {
    // বেসিক ফ্রন্টএন্ড ভ্যালিডেশন
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Username validation
    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long.');
      return;
    }

    // Redux Action Dispatch
    const userData = {
      full_name: fullName,
      username: username,
      email: email,
      password: password
    };
    console.log("reg page",userData);

    try {
      await authService.register(userData);
      // সফল হলে App.js-এর কন্ডিশন চেক করে অটোমেটিক হোম স্ক্রিনে রিডাইরেক্ট হবে
      Alert.alert("Success", "Account created successfully! 🎉");
    } catch (err) {
      // ব্যাকএন্ড বা নেটওয়ার্ক থেকে আসা এরর মেসেজ ডিসপ্লে করা
      const errorMessage = err.response?.data?.error || "Registration failed. Try again.";
      Alert.alert("Registration Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <ArrowLeft color="#94a3b8" size={24} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconGlow}>
                <UserPlus color="#f59e0b" size={32} />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Start your mining journey today</Text>
            </View>

            {/* Full Name Input */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User color="#64748b" size={18} style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="John Doe" 
                placeholderTextColor="#475569"
                value={fullName}
                onChangeText={setFullName}
                editable={!loading}
              />
            </View>

            {/* Username Input */}
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <User color="#64748b" size={18} style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="miner_john" 
                placeholderTextColor="#475569"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Email Input */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail color="#64748b" size={18} style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="john@example.com" 
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock color="#64748b" size={18} style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="Min 6 characters" 
                placeholderTextColor="#475569"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.eyeIcon}
                disabled={loading}
              >
                {showPassword ? 
                  <EyeOff color="#64748b" size={18} /> : 
                  <Eye color="#64748b" size={18} />
                }
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Lock color="#64748b" size={18} style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="Confirm your password" 
                placeholderTextColor="#475569"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={styles.eyeIcon}
                disabled={loading}
              >
                {showConfirmPassword ? 
                  <EyeOff color="#64748b" size={18} /> : 
                  <Eye color="#64748b" size={18} />
                }
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.btn, loading && styles.disabledBtn]} 
              onPress={handleRegister} 
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#090d16" size="small" />
              ) : (
                <Text style={styles.btnText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')} // 🛠️ স্ট্যাক নেভিগেশন এখন ঠিকঠাক কাজ করবে
                disabled={loading}
              >
                <Text style={styles.loginLink}>Login Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// আপনার বাকি নিখুঁত Stylesheet কোড নিচে অপরিবর্তিত থাকবে...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#111827',
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  header: { alignItems: "center", marginBottom: 28, marginTop: 10 },
  iconGlow: {
    backgroundColor: "#f59e0b10",
    padding: 14,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f59e0b20",
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 0.5, marginBottom: 4 },
  subtitle: { color: "#64748b", fontSize: 13, fontWeight: "500", marginTop: 4, textAlign: "center" },
  inputLabel: { color: "#94a3b8", fontSize: 12, fontWeight: "700", marginBottom: 8, marginLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#020617", borderWidth: 1, borderColor: "#1e293b", borderRadius: 14, paddingHorizontal: 14, height: 54, marginBottom: 16 },
  icon: { marginRight: 12 },
  input: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "500", paddingVertical: 12 },
  eyeIcon: { padding: 4 },
  btn: { backgroundColor: "#f59e0b", height: 54, borderRadius: 14, justifyContent: "center", alignItems: "center", marginTop: 10, shadowColor: "#f59e0b", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  disabledBtn: { backgroundColor: "#d97706", opacity: 0.6 },
  btnText: { color: "#090d16", fontSize: 15, fontWeight: "900", letterSpacing: 1 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20, alignItems: "center" },
  footerText: { color: "#64748b", fontSize: 14 },
  loginLink: { color: "#f59e0b", fontSize: 14, fontWeight: "600", textDecorationLine: "underline" },
});