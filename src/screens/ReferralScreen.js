import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Users, Copy, Share2, Coins, ArrowUpRight } from "lucide-react-native";
import { useSelector } from "react-redux";
import { referralService } from "../api/referralService"; // 👈 এপিআই সার্ভিস

export default function ReferralScreen() {
  // 🎯 রেডাক্স স্টোর থেকে লগইন থাকা ইউজারের রিয়েল ডাটা (প্রোফাইলে সেভ থাকা ইউজারনেম কোড হিসেবে কাজ করবে)
  const { user } = useSelector((state) => state.auth);
  const referralCode = user?.username ? user.username.toUpperCase() : "MEGA_MINER";
  
  const REFER_BONUS = 100;

  // 🔄 লোকাল স্টেটসমূহ
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalRefers, setTotalRefers] = useState(0);
  const [myTeam, setMyTeam] = useState([]); // ডাটাবেজ থেকে আসা রিয়েল টিম মেম্বার্স

  // 📡 ডাটাবেজ থেকে রেফারেল ডাটা লোড করার ফাংশন
  const loadReferralData = async () => {
    try {
      const res = await referralService.getReferralStats();
      if (res.success) {
        setTotalRefers(res.total_refers);
        setMyTeam(res.refers || []); // ব্যাকএন্ডের 'refers' অ্যারে সেট হলো
      }
    } catch (error) {
      console.error("Error loading referral stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadReferralData();
  };

  // 📋 কোড কপি করার ফাংশন
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("📋 Copied!", "Referral code copied to clipboard.");
  };

  // 🔗 বন্ধুদের সাথে অ্যাপ শেয়ার করার ফাংশন
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Join MegaMinerApp using my referral code: ${referralCode} and get instant free bonus coins! 🚀 Download Now!`,
      });
    } catch (error) {
      console.log("Error sharing:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06b6d4" />
        }
      >

        {/* 🌐 টপ ইনভাইট কার্ড */}
        <View style={styles.inviteCard}>
          <View style={styles.iconWrapper}>
            <Users color="#06b6d4" size={50} />
          </View>
          <Text style={styles.title}>Invite Friends & Earn</Text>
          <Text style={styles.subtitle}>
            Share your referral code with friends. When they join, both of you get bonus rewards!
          </Text>

          {/* 💰 বোনাস চার্ট বক্স */}
          <View style={styles.bonusBox}>
            <Coins color="#f59e0b" size={20} fill="#f59e0b" />
            <Text style={styles.bonusText}>Earn +{REFER_BONUS} Coins per friend</Text>
          </View>
        </View>

        {/* 🔑 রেফারেল কোড ডিসপ্লে জোন */}
        <Text style={styles.sectionTitle}>Your Referral Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Copy color="#06b6d4" size={20} />
          </TouchableOpacity>
        </View>

        {/* 🚀 মেইন শেয়ার বাটন */}
        <TouchableOpacity style={styles.shareMainButton} onPress={handleShare}>
          <Share2 color="#090d16" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.shareMainButtonText}>Invite Your Friends</Text>
        </TouchableOpacity>

        {/* 👥 মাই নেটওয়ার্ক / টিম সেকশন */}
        <View style={styles.teamHeaderRow}>
          <Text style={styles.sectionTitle}>My Network ({totalRefers})</Text>
          <Text style={styles.activeCountText}>
            {/* ব্যাকএন্ডে স্ট্যাটাস কলাম না থাকলে ডিফল্ট কাউন্ট হ্যান্ডেল করার সেফটি */}
            {myTeam.filter(t => t.status === "Active" || t.status === undefined).length} Joined
          </Text>
        </View>

        {/* টিম লিস্ট জোন */}
        <View style={styles.teamContainer}>
          {myTeam.length === 0 ? (
            <Text style={styles.emptyText}>No friends invited yet. Start sharing! 🚀</Text>
          ) : (
            myTeam.map((member, index) => (
              <View key={member.id || index} style={styles.teamRow}>
                <View style={styles.memberLeft}>
                  <View style={styles.avatarMini}>
                    <Text style={styles.avatarMiniText}>
                      {member.full_name ? member.full_name[0].toUpperCase() : "U"}
                    </Text>
                  </View>
                  <View>
                    {/* 🎯 ব্যাকএন্ড কুয়েরি থেকে আসা u.full_name এবং u.username */}
                    <Text style={styles.memberName}>{member.full_name || "Miner Friend"}</Text>
                    <Text style={styles.memberUsername}>@{member.username || "user"}</Text>
                  </View>
                </View>
                <View style={styles.memberRight}>
                  <ArrowUpRight color="#10b981" size={16} />
                  <Text style={[styles.miningRateText, { color: "#10b981" }]}>
                    +{member.reward_coin || REFER_BONUS} 🪙
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  inviteCard: { backgroundColor: "#111827", borderRadius: 24, padding: 24, alignItems: "center", marginTop: 20, borderWidth: 1, borderColor: "#1e293b", marginBottom: 20 },
  iconWrapper: { backgroundColor: "#06b6d415", padding: 20, borderRadius: 50, marginBottom: 15 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 18 },
  bonusBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#f59e0b10", borderWidth: 0.5, borderColor: "#f59e0b", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, marginTop: 15 },
  bonusText: { color: "#f59e0b", fontSize: 13, fontWeight: "600", marginLeft: 6 },
  sectionTitle: { color: "#fff", fontSize: 15, fontWeight: "bold", marginBottom: 10 },
  codeContainer: { backgroundColor: "#111827", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#1e293b" },
  codeText: { color: "#fff", fontSize: 20, fontWeight: "900", letterSpacing: 3 },
  copyButton: { backgroundColor: "#06b6d415", padding: 10, borderRadius: 12 },
  shareMainButton: { backgroundColor: "#06b6d4", borderRadius: 16, paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 20, shadowColor: "#06b6d4", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 },
  shareMainButtonText: { color: "#090d16", fontSize: 16, fontWeight: "bold" },
  teamHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  activeCountText: { color: "#10b981", fontSize: 13, fontWeight: "700" },
  teamContainer: { backgroundColor: "#111827", borderRadius: 20, borderWidth: 1, borderColor: "#1e293b", paddingHorizontal: 16, paddingVertical: 10 },
  teamRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: "#1e293b" },
  memberLeft: { flexDirection: "row", alignItems: "center" },
  avatarMini: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#1e293b", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarMiniText: { color: "#06b6d4", fontSize: 15, fontWeight: "bold" },
  memberName: { color: "#fff", fontSize: 14, fontWeight: "600" },
  memberUsername: { color: "#64748b", fontSize: 11, marginTop: 1 },
  memberRight: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b30", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  miningRateText: { fontSize: 12, fontWeight: "700", marginLeft: 4 },
  emptyText: { color: '#64748b', textAlign: 'center', paddingVertical: 20, fontSize: 13 }
});


// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   Share,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import * as Clipboard from "expo-clipboard";
// import { Users, Copy, Share2, Coins, ArrowUpRight } from "lucide-react-native";
// import { useSelector } from "react-redux";
// import { referralService } from "../api/referralService"; // 👈 এপিআই সার্ভিস

// export default function ReferralScreen() {
//   // 🎯 রেডাক্স স্টোর থেকে লগইন থাকা ইউজারের রিয়েল ডাটা (প্রোফাইলে সেভ থাকা ইউজারনেম কোড হিসেবে কাজ করবে)
//   const { user } = useSelector((state) => state.auth);
//   const referralCode = user?.username ? user.username.toUpperCase() : "MEGA_MINER";
  
//   const REFER_BONUS = 100;

//   // 🔄 লোকাল স্টেটসমূহ
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [totalRefers, setTotalRefers] = useState(0);
//   const [myTeam, setMyTeam] = useState([]); // ডাটাবেজ থেকে আসা রিয়েল টিম মেম্বার্স

//   // 📡 ডাটাবেজ থেকে রেফারেল ডাটা লোড করার ফাংশন
//   const loadReferralData = async () => {
//     try {
//       const res = await referralService.getReferralStats();
//       if (res.success) {
//         setTotalRefers(res.total_refers);
//         setMyTeam(res.refers || []); // ব্যাকএন্ডের 'refers' অ্যারে সেট হলো
//       }
//     } catch (error) {
//       console.error("Error loading referral stats:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     loadReferralData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadReferralData();
//   };

//   // 📋 কোড কপি করার ফাংশন
//   const copyToClipboard = async () => {
//     await Clipboard.setStringAsync(referralCode);
//     Alert.alert("📋 Copied!", "Referral code copied to clipboard.");
//   };

//   // 🔗 বন্ধুদের সাথে অ্যাপ শেয়ার করার ফাংশন
//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `Hey! Join MegaMinerApp using my referral code: ${referralCode} and get instant free bonus coins! 🚀 Download Now!`,
//       });
//     } catch (error) {
//       console.log("Error sharing:", error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#06b6d4" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#090d16" />
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06b6d4" />
//         }
//       >

//         {/* 🌐 টপ ইনভাইট কার্ড */}
//         <View style={styles.inviteCard}>
//           <View style={styles.iconWrapper}>
//             <Users color="#06b6d4" size={50} />
//           </View>
//           <Text style={styles.title}>Invite Friends & Earn</Text>
//           <Text style={styles.subtitle}>
//             Share your referral code with friends. When they join, both of you get bonus rewards!
//           </Text>

//           {/* 💰 বোনাস চার্ট বক্স */}
//           <View style={styles.bonusBox}>
//             <Coins color="#f59e0b" size={20} fill="#f59e0b" />
//             <Text style={styles.bonusText}>Earn +{REFER_BONUS} Coins per friend</Text>
//           </View>
//         </View>

//         {/* 🔑 রেফারেল কোড ডিসপ্লে জোন */}
//         <Text style={styles.sectionTitle}>Your Referral Code</Text>
//         <View style={styles.codeContainer}>
//           <Text style={styles.codeText}>{referralCode}</Text>
//           <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
//             <Copy color="#06b6d4" size={20} />
//           </TouchableOpacity>
//         </View>

//         {/* 🚀 মেইন শেয়ার বাটন */}
//         <TouchableOpacity style={styles.shareMainButton} onPress={handleShare}>
//           <Share2 color="#090d16" size={20} style={{ marginRight: 8 }} />
//           <Text style={styles.shareMainButtonText}>Invite Your Friends</Text>
//         </TouchableOpacity>

//         {/* 👥 মাই নেটওয়ার্ক / টিম সেকশন */}
//         <View style={styles.teamHeaderRow}>
//           <Text style={styles.sectionTitle}>My Network ({totalRefers})</Text>
//           <Text style={styles.activeCountText}>
//             {/* ব্যাকএন্ডে স্ট্যাটাস কলাম না থাকলে ডিফল্ট কাউন্ট হ্যান্ডেল করার সেফটি */}
//             {myTeam.filter(t => t.status === "Active" || t.status === undefined).length} Joined
//           </Text>
//         </View>

//         {/* টিম লিস্ট জোন */}
//         <View style={styles.teamContainer}>
//           {myTeam.length === 0 ? (
//             <Text style={styles.emptyText}>No friends invited yet. Start sharing! 🚀</Text>
//           ) : (
//             myTeam.map((member, index) => (
//               <View key={member.id || index} style={styles.teamRow}>
//                 <View style={styles.memberLeft}>
//                   <View style={styles.avatarMini}>
//                     <Text style={styles.avatarMiniText}>
//                       {member.full_name ? member.full_name[0].toUpperCase() : "U"}
//                     </Text>
//                   </View>
//                   <View>
//                     {/* 🎯 ব্যাকএন্ড কুয়েরি থেকে আসা u.full_name এবং u.username */}
//                     <Text style={styles.memberName}>{member.full_name || "Miner Friend"}</Text>
//                     <Text style={styles.memberUsername}>@{member.username || "user"}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.memberRight}>
//                   <ArrowUpRight color="#10b981" size={16} />
//                   <Text style={[styles.miningRateText, { color: "#10b981" }]}>
//                     +{member.reward_coin || REFER_BONUS} 🪙
//                   </Text>
//                 </View>
//               </View>
//             ))
//           )}
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#090d16" },
//   scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
//   inviteCard: { backgroundColor: "#111827", borderRadius: 24, padding: 24, alignItems: "center", marginTop: 20, borderWidth: 1, borderColor: "#1e293b", marginBottom: 20 },
//   iconWrapper: { backgroundColor: "#06b6d415", padding: 20, borderRadius: 50, marginBottom: 15 },
//   title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
//   subtitle: { color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 18 },
//   bonusBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#f59e0b10", borderWidth: 0.5, borderColor: "#f59e0b", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, marginTop: 15 },
//   bonusText: { color: "#f59e0b", fontSize: 13, fontWeight: "600", marginLeft: 6 },
//   sectionTitle: { color: "#fff", fontSize: 15, fontWeight: "bold", marginBottom: 10 },
//   codeContainer: { backgroundColor: "#111827", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#1e293b" },
//   codeText: { color: "#fff", fontSize: 20, fontWeight: "900", letterSpacing: 3 },
//   copyButton: { backgroundColor: "#06b6d415", padding: 10, borderRadius: 12 },
//   shareMainButton: { backgroundColor: "#06b6d4", borderRadius: 16, paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 20, shadowColor: "#06b6d4", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 },
//   shareMainButtonText: { color: "#090d16", fontSize: 16, fontWeight: "bold" },
//   teamHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
//   activeCountText: { color: "#10b981", fontSize: 13, fontWeight: "700" },
//   teamContainer: { backgroundColor: "#111827", borderRadius: 20, borderWidth: 1, borderColor: "#1e293b", paddingHorizontal: 16, paddingVertical: 10 },
//   teamRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: "#1e293b" },
//   memberLeft: { flexDirection: "row", alignItems: "center" },
//   avatarMini: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#1e293b", justifyContent: "center", alignItems: "center", marginRight: 12 },
//   avatarMiniText: { color: "#06b6d4", fontSize: 15, fontWeight: "bold" },
//   memberName: { color: "#fff", fontSize: 14, fontWeight: "600" },
//   memberUsername: { color: "#64748b", fontSize: 11, marginTop: 1 },
//   memberRight: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b30", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
//   miningRateText: { fontSize: 12, fontWeight: "700", marginLeft: 4 },
//   emptyText: { color: '#64748b', textAlign: 'center', paddingVertical: 20, fontSize: 13 }
// });


// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   Share,
//   Alert,
// } from "react-native";
// import * as Clipboard from "expo-clipboard"; // কোড কপি করার জন্য এক্সপো লাইব্রেরি
// import { Users, Copy, Share2, Coins, ArrowUpRight, Award } from "lucide-react-native";

// export default function ReferralScreen() {
//   const [referralCode] = useState("MEGA789X"); // ইউজারের ডামি রেফার কোড
//   const REFER_BONUS = 100; // প্রতি রেফারে ১০০ কয়েন বোনাস

//   // 👥 ডামি টিম মেম্বার লিস্ট (যারা ইউজারের কোড ব্যবহার করে জয়েন করেছে)
//   const myTeam = [
//     { id: "1", name: "Rahat Islam", status: "Active", rate: "+2.5x" },
//     { id: "2", name: "Sifatur Rahman", status: "Active", rate: "+2.5x" },
//     { id: "3", name: "Tanvir Ahmed", status: "Inactive", rate: "+0.0x" },
//   ];

//   // 📋 কোড ক্লিপবোর্ডে কপি করার ফাংশন
//   const copyToClipboard = async () => {
//     await Clipboard.setStringAsync(referralCode);
//     Alert.alert("📋 Copied!", "Referral code copied to clipboard.");
//   };

//   // 🔗 বন্ধুদের সাথে অ্যাপ শেয়ার করার ফাংশন
//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `Hey! Join MegaMinerApp using my referral code: ${referralCode} and get instant free bonus coins! 🚀 Download Now!`,
//       });
//     } catch (error) {
//       console.log("Error sharing:", error.message);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#090d16" />
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

//         {/* 🌐 টপ ইনভাইট কার্ড */}
//         <View style={styles.inviteCard}>
//           <View style={styles.iconWrapper}>
//             <Users color="#06b6d4" size={50} />
//           </View>
//           <Text style={styles.title}>Invite Friends & Earn</Text>
//           <Text style={styles.subtitle}>
//             Share your referral code with friends. When they join, both of you get bonus rewards!
//           </Text>

//           {/* 💰 বোনাস চার্ট বক্স */}
//           <View style={styles.bonusBox}>
//             <Coins color="#f59e0b" size={20} fill="#f59e0b" />
//             <Text style={styles.bonusText}>Earn +{REFER_BONUS} Coins per friend</Text>
//           </View>
//         </View>

//         {/* 🔑 রেফারেল কোড ডিসপ্লে জোন */}
//         <Text style={styles.sectionTitle}>Your Referral Code</Text>
//         <View style={styles.codeContainer}>
//           <Text style={styles.codeText}>{referralCode}</Text>
//           <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
//             <Copy color="#06b6d4" size={20} />
//           </TouchableOpacity>
//         </View>

//         {/* 🚀 মেইন শেয়ার বাটন */}
//         <TouchableOpacity style={styles.shareMainButton} onPress={handleShare}>
//           <Share2 color="#090d16" size={20} style={{ marginRight: 8 }} />
//           <Text style={styles.shareMainButtonText}>Invite Your Friends</Text>
//         </TouchableOpacity>

//         {/* 👥 মাই নেটওয়ার্ক / টিম সেকশন */}
//         <View style={styles.teamHeaderRow}>
//           <Text style={styles.sectionTitle}>My Network ({myTeam.length})</Text>
//           <Text style={styles.activeCountText}>
//             {myTeam.filter(t => t.status === "Active").length} Active
//           </Text>
//         </View>

//         {/* টিম লিস্ট জোন */}
//         <View style={styles.teamContainer}>
//           {myTeam.map((member) => (
//             <View key={member.id} style={styles.teamRow}>
//               <View style={styles.memberLeft}>
//                 <View style={styles.avatarMini}>
//                   <Text style={styles.avatarMiniText}>{member.name[0]}</Text>
//                 </View>
//                 <View>
//                   <Text style={styles.memberName}>{member.name}</Text>
//                   <Text style={[
//                     styles.memberStatus, 
//                     member.status === "Active" ? styles.statusActive : styles.statusInactive
//                   ]}>
//                     • {member.status}
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.memberRight}>
//                 <ArrowUpRight color={member.status === "Active" ? "#10b981" : "#64748b"} size={16} />
//                 <Text style={[
//                   styles.miningRateText, 
//                   member.status === "Active" ? { color: "#10b981" } : { color: "#64748b" }
//                 ]}>
//                   {member.rate}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#090d16",
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 120,
//   },
//   inviteCard: {
//     backgroundColor: "#111827",
//     borderRadius: 24,
//     padding: 24,
//     alignItems: "center",
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: "#1e293b",
//     marginBottom: 20,
//   },
//   iconWrapper: {
//     backgroundColor: "#06b6d415",
//     padding: 20,
//     borderRadius: 50,
//     marginBottom: 15,
//   },
//   title: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   subtitle: {
//     color: "#64748b",
//     fontSize: 13,
//     textAlign: "center",
//     marginTop: 6,
//     lineHeight: 18,
//   },
//   bonusBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f59e0b10",
//     borderWidth: 0.5,
//     borderColor: "#f59e0b",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginTop: 15,
//   },
//   bonusText: {
//     color: "#f59e0b",
//     fontSize: 13,
//     fontWeight: "600",
//     marginLeft: 6,
//   },
//   sectionTitle: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   codeContainer: {
//     backgroundColor: "#111827",
//     borderRadius: 16,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#1e293b",
//   },
//   codeText: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "900",
//     letterSpacing: 3,
//   },
//   copyButton: {
//     backgroundColor: "#06b6d415",
//     padding: 10,
//     borderRadius: 12,
//   },
//   shareMainButton: {
//     backgroundColor: "#06b6d4",
//     borderRadius: 16,
//     paddingVertical: 16,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 20,
//     shadowColor: "#06b6d4",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   shareMainButtonText: {
//     color: "#090d16",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   teamHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   activeCountText: {
//     color: "#10b981",
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   teamContainer: {
//     backgroundColor: "#111827",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#1e293b",
//     paddingHorizontal: 16,
//     paddingVertical: 5,
//   },
//   teamRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#1e293b",
//   },
//   memberLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatarMini: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#1e293b",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   avatarMiniText: {
//     color: "#06b6d4",
//     fontSize: 15,
//     fontWeight: "bold",
//   },
//   memberName: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   memberStatus: {
//     fontSize: 11,
//     fontWeight: "600",
//     marginTop: 2,
//   },
//   statusActive: {
//     color: "#10b981",
//   },
//   statusInactive: {
//     color: "#ef4444",
//   },
//   memberRight: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1e293b30",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
//   },
//   miningRateText: {
//     fontSize: 12,
//     fontWeight: "700",
//     marginLeft: 4,
//   },
// });

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Clipboard, TouchableOpacity, ScrollView, FlatList } from "react-native";
// import { useSelector } from "react-redux";
// import { Network, Copy, Check, Users } from "lucide-react-native";
// import Toast from "react-native-toast-message";

// export default function ReferralScreen() {
//   const { totalCoin } = useSelector((state) => state.wallet);
//   const [stats, setStats] = useState({ totalReferrals: 0, referralEarnings: 0, referralLink: "", referredFriends: [] });
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     fetch("https://your-live-domain.com/api/dashboard/referral")
//       .then(res => res.json())
//       .then(json => { if(json.success) setStats(json.data); });
//   }, []);

//   const copyToClipboard = () => {
//     if (!stats.referralLink) return;
//     Clipboard.setString(stats.referralLink);
//     setCopied(true);
//     Toast.show({ type: "success", text1: "Link Copied" });
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Affiliate Node Hub</Text>
//         <Text style={styles.balance}>Vault: {totalCoin.toFixed(2)} D</Text>
//       </View>

//       <View style={styles.linkCard}>
//         <Text style={styles.cardLabel}>Your Invitation System Routing Link</Text>
//         <View style={styles.inputRow}>
//           <Text numberOfLines={1} style={styles.linkText}>{stats.referralLink || "Generating..."}</Text>
//           <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
//             {copied ? <Check color="#10b981" size={16} /> : <Copy color="#090d16" size={16} />}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.historyCard}>
//         <View style={styles.historyHeader}>
//           <Users color="#f59e0b" size={16} />
//           <Text style={styles.historyTitle}>Surface Refinery Linked Nodes ({stats.totalReferrals})</Text>
//         </View>

//         {stats.referredFriends.map((item) => (
//           <View key={item.referral_id} style={styles.row}>
//             <Text style={styles.nodeId}>#{item.referred_id}</Text>
//             <Text style={styles.username}>{item.referred_username}</Text>
//             <Text style={styles.yield}>+{item.referrer_bonus_coins} D</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#090d16" },
//   header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
//   title: { color: "#fff", fontSize: 18, fontWeight: "900" },
//   balance: { color: "#f59e0b", fontWeight: "bold" },
//   linkCard: { backgroundColor: "#111827", padding: 16, borderRadius: 16, marginBottom: 16 },
//   cardLabel: { color: "#64748b", fontSize: 10, fontWeight: "bold", marginBottom: 8 },
//   inputRow: { flexDirection: "row", backgroundColor: "#020617", borderRadius: 10, padding: 12, items: "center" },
//   linkText: { flex: 1, color: "#f59e0b", fontSize: 11, fontFamily: "monospace" },
//   copyBtn: { backgroundColor: "#f59e0b", padding: 8, borderRadius: 6, marginLeft: 8 },
//   historyCard: { backgroundColor: "#111827", padding: 16, borderRadius: 16 },
//   historyHeader: { flexDirection: "row", items: "center", gap: 8, marginBottom: 12 },
//   historyTitle: { color: "#fff", fontSize: 12, fontWeight: "bold" },
//   row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#1e293b" },
//   nodeId: { color: "#f59e0b", fontFamily: "monospace" },
//   username: { color: "#fff", flex: 1, marginLeft: 12 },
//   yield: { color: "#10b981", fontWeight: "bold" }
// });