import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CalendarCheck, Lock, CheckCircle } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { dailyService } from "../api/dailyService";

export default function DailyCheckInScreen() {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  
  // ব্যাকএন্ড থেকে আসা লাইভ স্টেট
  const [status, setStatus] = useState({
    canClaimToday: true,
    currentStreak: 0,
    nextClaimDay: 1,
    lastClaimedDay: 0
  });

  const loadStatus = async () => {
    try {
      const data = await dailyService.getCheckInStatus();
      console.log("daily page",data);
      if (data.success) {
        setStatus(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleClaim = async () => {
    if (!status.canClaimToday) {
      Toast.show({ type: 'error', text1: 'Already Claimed', text2: 'Come back tomorrow!' });
      return;
    }

    setBtnLoading(true);
    try {
      const res = await dailyService.claimTodayReward();
      if (res.success) {
        Toast.show({ type: 'success', text1: 'Success 🎉', text2: res.message });
        loadStatus(); // ক্লেম সফল হলে স্ক্রিন ডাটা রিফ্রেশ করা হলো
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Claim failed.";
      Alert.alert("Error", msg);
    } finally {
      setBtnLoading(false);
    }
  };

  // UI-এর ৭ দিনের ডাটা ম্যাপ
  const rewardDays = [
    { day: 1, coins: "+10" },
    { day: 2, coins: "+20" },
    { day: 3, coins: "+30" },
    { day: 4, coins: "+50" },
    { day: 5, coins: "+60" },
    { day: 6, coins: "+80" },
    { day: 7, coins: "+150" },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Top Streak Header Box */}
      <View style={styles.streakBox}>
        <View style={styles.calendarIconWrapper}>
          <CalendarCheck color="#3b82f6" size={32} />
        </View>
        <Text style={styles.streakTitle}>Daily Rewards</Text>
        <Text style={styles.streakSub}>Current Streak: <Text style={{ color: '#f59e0b', fontWeight: 'bold' }}>{status.currentStreak} Days</Text></Text>
      </View>

      {/* Grid container for Day 1 to Day 6 */}
      <View style={styles.gridContainer}>
        {rewardDays.slice(0, 6).map((item) => {
          // কন্ডিশনাল স্টাইলিং (ক্লেমড, কারেন্ট একটিভ, ফিউচার লকড)
          const isClaimed = item.day <= status.lastClaimedDay;
          const isCurrentActive = status.canClaimToday && item.day === status.nextClaimDay;

          return (
            <View 
              key={item.day} 
              style={[
                styles.gridItem, 
                isCurrentActive && styles.activeGridItem,
                isClaimed && styles.claimedGridItem
              ]}
            >
              <Text style={styles.dayText}>Day {item.day}</Text>
              <Text style={styles.coinText}>{item.coins}</Text>
              
              <View style={styles.statusIconZone}>
                {isClaimed ? (
                  <CheckCircle color="#10b981" size={16} fill="#10b98120" />
                ) : (
                  <Lock color={isCurrentActive ? "#f59e0b" : "#475569"} size={16} />
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Day 7 Full Width Card */}
      <View style={[
        styles.day7Card, 
        (!status.canClaimToday && status.lastClaimedDay === 7) && styles.claimedGridItem,
        (status.canClaimToday && status.nextClaimDay === 7) && styles.activeGridItem
      ]}>
        <Text style={styles.dayText}>Day 7</Text>
        <Text style={styles.coinText}>{rewardDays[6].coins}</Text>
        {status.lastClaimedDay === 7 ? (
          <CheckCircle color="#10b981" size={18} />
        ) : (
          <Lock color={status.nextClaimDay === 7 ? "#f59e0b" : "#475569"} size={18} />
        )}
      </View>

      {/* Dynamic Claim Action Button */}
      <TouchableOpacity 
        style={[styles.claimButton, !status.canClaimToday && styles.disabledButton]} 
        onPress={handleClaim}
        disabled={!status.canClaimToday || btnLoading}
      >
        {btnLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.claimButtonText}>
            {status.canClaimToday ? "Claim Today's Reward" : "Already Claimed Today"}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16", padding: 20 },
  streakBox: { backgroundColor: "#111827", borderRadius: 24, padding: 25, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: "#1e293b", marginBottom: 20 },
  calendarIconWrapper: { backgroundColor: '#3b82f615', padding: 15, borderRadius: 20, marginBottom: 12 },
  streakTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  streakSub: { color: '#64748b', fontSize: 13, marginTop: 4 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridItem: { backgroundColor: "#111827", width: "48%", borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: "#1e293b", alignItems: 'center' },
  activeGridItem: { borderColor: '#f59e0b', borderWidth: 1.5, shadowColor: '#f59e0b', shadowOpacity: 0.2, elevation: 4 },
  claimedGridItem: { opacity: 0.5, backgroundColor: '#0f172a' },
  dayText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  coinText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
  statusIconZone: { marginTop: 2 },
  day7Card: { backgroundColor: "#111827", borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: "#1e293b", marginTop: 5 },
  claimButton: { backgroundColor: "#3b82f6", borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 30, left: 20, right: 20 },
  disabledButton: { backgroundColor: '#1e293b', opacity: 0.6 },
  claimButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
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
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { CalendarCheck, Coins, CheckCircle2, Lock, Unlock } from "lucide-react-native";

// export default function DailyCheckInScreen() {
//   const [loading, setLoading] = useState(true);
//   const [currentStreak, setCurrentStreak] = useState(0); // ইউজার পরপর কয়দিন ক্লেম করেছে (0 থেকে 6)
//   const [isClaimedToday, setIsClaimedToday] = useState(false); // আজ ক্লেম করেছে কি না

//   // ৭ দিনের ফিক্সড রিওয়ার্ড চার্ট
//   const rewardsConfig = [
//     { day: 1, coins: 10, label: "Day 1" },
//     { day: 2, coins: 20, label: "Day 2" },
//     { day: 3, coins: 30, label: "Day 3" },
//     { day: 4, coins: 50, label: "Day 4" },
//     { day: 5, coins: 60, label: "Day 5" },
//     { day: 6, coins: 80, label: "Day 6" },
//     { day: 7, coins: 150, label: "Day 7" }, // মেগা বোনাস
//   ];

//   // 🔄 অ্যাপ ওপেন হলেই লোকাল স্টোরেজ থেকে লাস্ট ক্লেম হিস্ট্রি লোড হবে
//   useEffect(() => {
//     loadCheckInStatus();
//   }, []);

//   const loadCheckInStatus = async () => {
//     try {
//       setLoading(true);
//       const lastTimestamp = await AsyncStorage.getItem("last_check_in_time");
//       const savedStreak = await AsyncStorage.getItem("current_streak");

//       const streak = savedStreak ? parseInt(savedStreak, 10) : 0;
//       setCurrentStreak(streak);

//       if (lastTimestamp) {
//         const lastDate = new Date(parseInt(lastTimestamp, 10));
//         const today = new Date();

//         // তারিখ চেক করার লজিক (বছরের দিন ও সাল একই কি না)
//         const isSameDay =
//           lastDate.getDate() === today.getDate() &&
//           lastDate.getMonth() === today.getMonth() &&
//           lastDate.getFullYear() === today.getFullYear();

//         if (isSameDay) {
//           setIsClaimedToday(true);
//         } else {
//           // যদি আগের দিন বা তার আগে ক্লেম করে থাকে
//           const oneDayInMs = 24 * 60 * 60 * 1000;
//           const timeDiff = today.setHours(0,0,0,0) - lastDate.setHours(0,0,0,0);

//           // যদি ২৪ ঘণ্টার বেশি (১ দিনের বেশি) গ্যাপ হয়ে যায়, তবে স্ট্রিক রিসেট হয়ে যাবে
//           if (timeDiff > oneDayInMs) {
//             setCurrentStreak(0);
//             await AsyncStorage.setItem("current_streak", "0");
//           }
//           setIsClaimedToday(false);
//         }
//       }
//     } catch (error) {
//       console.log("Error loading check-in data: ", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🚀 ক্লেম বাটনে ক্লিক করলে যা হবে
//   const handleClaimReward = async () => {
//     if (isClaimedToday) return;

//     try {
//       const today = new Date();
//       let nextStreak = currentStreak + 1;

//       // যদি ৭ দিন পার হয়ে যায়, আবার ১ম দিন থেকে শুরু হবে
//       if (nextStreak > 7) {
//         nextStreak = 1;
//       }

//       const rewardedCoins = rewardsConfig[nextStreak - 1].coins;

//       // 💾 লোকাল স্টোরেজে নতুন ডাটা সেভ করা
//       await AsyncStorage.setItem("last_check_in_time", today.getTime().toString());
//       await AsyncStorage.setItem("current_streak", nextStreak.toString());

//       // অ্যাপের কারেন্ট স্টেট আপডেট
//       setCurrentStreak(nextStreak);
//       setIsClaimedToday(true);

//       Alert.alert(
//         "🎉 Success!",
//         `You have successfully claimed your Day ${nextStreak} reward of +${rewardedCoins} Coins!`
//       );
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong while claiming reward.");
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" color="#3b82f6" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#090d16" />
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
//         {/* 🎁 টপ ব্যানার কার্ড */}
//         <View style={styles.headerCard}>
//           <View style={styles.iconWrapper}>
//             <CalendarCheck color="#3b82f6" size={50} />
//           </View>
//           <Text style={styles.title}>Daily Rewards</Text>
//           <Text style={styles.subtitle}>
//             Current Streak: <Text style={{ color: "#f59e0b", fontWeight: "bold" }}>{currentStreak} Days</Text>
//           </Text>
//         </View>

//         {/* 📅 ৭ দিনের ইন্টারঅ্যাক্টিভ গ্রিড */}
//         <View style={styles.gridContainer}>
//           {rewardsConfig.map((item) => {
//             // ১ থেকে ৭ দিনের কন্ডিশনাল স্ট্যাটাস চেক
//             const isClaimed = item.day <= currentStreak; 
//             const isCurrentAvailable = item.day === currentStreak + 1 && !isClaimedToday;
//             const isLocked = item.day > currentStreak + (isClaimedToday ? 0 : 1);

//             return (
//               <View
//                 key={item.day}
//                 style={[
//                   styles.dayCard,
//                   item.day === 7 ? styles.megaDayCard : null,
//                   isClaimed ? styles.claimedCard : null,
//                   isCurrentAvailable ? styles.activeCard : null,
//                 ]}
//               >
//                 <Text style={[styles.dayLabel, isCurrentAvailable ? { color: "#fff" } : null]}>
//                   {item.label}
//                 </Text>
                
//                 <View style={styles.coinBox}>
//                   <Coins 
//                     color={isClaimed ? "#64748b" : isCurrentAvailable ? "#f59e0b" : "#475569"} 
//                     size={20} 
//                     fill={isClaimed ? "#64748b" : isCurrentAvailable ? "#f59e0b" : "transparent"} 
//                   />
//                   <Text style={[
//                     styles.coinText, 
//                     isClaimed ? styles.claimedText : isCurrentAvailable ? { color: "#fff" } : { color: "#475569" }
//                   ]}>
//                     +{item.coins}
//                   </Text>
//                 </View>

//                 {/* ডাইনামিক স্ট্যাটাস আইকন */}
//                 <View style={styles.statusIcon}>
//                   {isClaimed ? (
//                     <CheckCircle2 color="#10b981" size={18} fill="#10b98120" />
//                   ) : isCurrentAvailable ? (
//                     <Unlock color="#f59e0b" size={16} />
//                   ) : (
//                     <Lock color="#334155" size={16} />
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>

//         {/* 🚀 মেইন ক্লেইম বাটন */}
//         <TouchableOpacity
//           style={[styles.claimButton, isClaimedToday ? styles.disabledButton : null]}
//           onPress={handleClaimReward}
//           disabled={isClaimedToday}
//         >
//           <Text style={styles.claimButtonText}>
//             {isClaimedToday ? "Already Claimed Today" : "Claim Today's Reward"}
//           </Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#090d16",
//   },
//   center: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 120,
//   },
//   headerCard: {
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 30,
//     backgroundColor: "#111827",
//     padding: 24,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#1e293b",
//   },
//   iconWrapper: {
//     backgroundColor: "#3b82f615",
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
//     color: "#94a3b8",
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 6,
//   },
//   gridContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   dayCard: {
//     backgroundColor: "#111827",
//     width: "30%",
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#1e293b",
//     alignItems: "center",
//   },
//   megaDayCard: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 18,
//   },
//   activeCard: {
//     borderColor: "#f59e0b",
//     backgroundColor: "#f59e0b10",
//   },
//   claimedCard: {
//     backgroundColor: "#0d131f",
//     borderColor: "#1e293b",
//     opacity: 0.6,
//   },
//   dayLabel: {
//     color: "#64748b",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   coinBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   coinText: {
//     fontSize: 14,
//     fontWeight: "700",
//     marginLeft: 4,
//   },
//   claimedText: {
//     color: "#64748b",
//     textDecorationLine: "line-through",
//   },
//   statusIcon: {
//     marginTop: 8,
//   },
//   claimButton: {
//     backgroundColor: "#3b82f6",
//     borderRadius: 16,
//     paddingVertical: 16,
//     alignItems: "center",
//     marginTop: 20,
//     shadowColor: "#3b82f6",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   disabledButton: {
//     backgroundColor: "#1e293b",
//     shadowOpacity: 0,
//     elevation: 0,
//   },
//   claimButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });