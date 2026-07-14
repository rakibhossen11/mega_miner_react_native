import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Coins, Trophy, RefreshCw } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { spinService } from "../api/spinService"; // 👈 এপিআই সার্ভিস ইমপোর্ট

const { width } = Dimensions.get("window");
const WHEEL_SIZE = width * 0.8;

// চাকার পুরস্কারের লিস্ট (আপনার ডিগ্রী ম্যাপ অনুযায়ী সাজানো)
// ব্যাকএন্ডের spinOptions ইণ্ডেক্স = [10, 20, 0, 50, 5, 15, 30, 100] এর সাথে এটি মিলতে হবে
const PRIZES = [
  { name: "10 Coins", deg: 0, index: 0 },
  { name: "20 Coins", deg: 45, index: 1 },
  { name: "Try Again", deg: 90, index: 2 },
  { name: "50 Coins", deg: 135, index: 3 },
  { name: "5 Coins", deg: 180, index: 4 },
  { name: "15 Coins", deg: 225, index: 5 },
  { name: "30 Coins", deg: 270, index: 6 },
  { name: "100 Coins", deg: 315, index: 7 },
];

export default function SpinScreen() {
  const [loading, setLoading] = useState(true); // পেজ লোডিং স্টেট
  const [isSpinning, setIsSpinning] = useState(false);
  const [availableSpins, setAvailableSpins] = useState(3); // ডাটাবেজ থেকে লাইভ আপডেট হবে
  const spinValue = useRef(new Animated.Value(0)).current;

  // 📡 স্ক্রিন ওপেন হলে ডাটাবেজ থেকে বাকি স্পিন সংখ্যা নিয়ে আসা
  const loadSpinStatus = async () => {
    try {
      const res = await spinService.getSpinStatus();
      if (res.success) {
        setAvailableSpins(res.spinsLeft);
      }
    } catch (error) {
      console.log("Error loading spin status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpinStatus();
  }, []);

  const startSpin = async () => {
    if (isSpinning) return;
    
    if (availableSpins <= 0) {
      Toast.show({
        type: "error",
        text1: "No Spins Left!",
        text2: "Come back tomorrow for more spins.",
      });
      return;
    }

    setIsSpinning(true);
    spinValue.setValue(0); // আগের রোটেশন রিসেট

    try {
      // 📡 ১. ব্যাকএন্ডে হিট করে উইনিং রিওয়ার্ড এবং ইনডেক্স রিসিভ করা
      const res = await spinService.playSpin();

      if (res.success) {
        const { winningIndex, message } = res;

        // ২. আমাদের PRIZES অ্যারে থেকে সার্ভারের উইনিং ইনডেক্স অনুযায়ী অবজেক্ট খুঁজে বের করা
        const selectedPrize = PRIZES.find(p => p.index === winningIndex) || PRIZES[2];

        // ৩. ক্যালকুলেশন: চাকাটি ৫ বার ফুল ঘুরে নির্দিষ্ট পুরস্কারের ডিগ্রীতে উল্টো দিকে থামবে 
        const fullRotations = 360 * 5;
        const finalTargetDeg = fullRotations + (360 - selectedPrize.deg);

        // ৪. অ্যানিমেশন রান করা
        Animated.timing(spinValue, {
          toValue: finalTargetDeg,
          duration: 4000, // ৪ সেকেন্ড ঘুরবে
          easing: Easing.out(Easing.quad), 
          useNativeDriver: true,
        }).start(() => {
          setIsSpinning(false);
          // ডাটাবেজে কাউন্ট কমে গেছে তাই লোড স্ট্যাটাস আবার রিফ্রেশ করা হলো
          loadSpinStatus();

          // ৫. পুরস্কার অনুযায়ী প্রফেশনাল টোস্ট মেসেজ
          Toast.show({
            type: selectedPrize.name.includes("Try Again") ? "info" : "success",
            text1: selectedPrize.name.includes("Try Again") ? "Better Luck Next Time!" : "Congratulations! 🎉",
            text2: message,
          });

          spinValue.setValue(finalTargetDeg % 360);
        });
      }
    } catch (error) {
      setIsSpinning(false);
      const msg = error.response?.data?.error || "Spin process failed.";
      Alert.alert("Error", msg);
    }
  };

  // Animated Value-কে ডিগ্রীতে কনভার্ট করা
  const spinRotation = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Top Header stats */}
        <View style={styles.header}>
          <View style={styles.statBox}>
            <Trophy color="#f59e0b" size={18} />
            <Text style={styles.statText}>Lucky Wheel</Text>
          </View>
          <View style={styles.statBox}>
            <RefreshCw color="#1db954" size={16} />
            <Text style={styles.statText}>{availableSpins} Spins Left</Text>
          </View>
        </View>

        <Text style={styles.title}>Test Your Luck!</Text>
        <Text style={styles.subtitle}>Spin the wheel and win mega rewards daily.</Text>

        {/* 🎡 Wheel Area */}
        <View style={styles.wheelContainer}>
          {/* চাকার ওপরের নির্দেশক বা তীর (Pointer) */}
          <View style={styles.pointer} />

          {/* আসল চাকাটি */}
          <Animated.View style={[styles.wheel, { transform: [{ rotate: spinRotation }] }]}>
            {PRIZES.map((prize, index) => {
              const rotationDeg = index * (360 / PRIZES.length);
              return (
                <View
                  key={index}
                  style={[styles.prizeSector, { transform: [{ rotate: `${rotationDeg}deg` }] }]}
                >
                  <Text style={styles.prizeText}>{prize.name}</Text>
                </View>
              );
            })}
            {/* চাকার মাঝখানের বৃত্ত */}
            <View style={styles.centerCircle} />
          </Animated.View>
        </View>

        {/* 🔘 Spin Button */}
        <TouchableOpacity
          style={[styles.spinButton, (isSpinning || availableSpins <= 0) && styles.disabledButton]}
          onPress={startSpin}
          disabled={isSpinning || availableSpins <= 0}
        >
          <Coins color="#000" size={22} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{isSpinning ? "SPINNING..." : "SPIN NOW"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16", 
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  statText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  wheelContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#f59e0b", 
    position: "absolute",
    top: -20,
    zIndex: 10,
    transform: [{ rotate: "180deg" }],
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 8,
    borderColor: "#1e293b",
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  prizeSector: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 25,
  },
  prizeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  centerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1e293b",
    position: "absolute",
    borderWidth: 4,
    borderColor: "#f59e0b",
  },
  spinButton: {
    backgroundColor: "#f59e0b", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    height: 56,
    borderRadius: 28,
    marginBottom: 20,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#334155",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});


// import React, { useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Animated,
//   Easing,
//   SafeAreaView,
//   Dimensions,
//   ScrollView,
// } from "react-native";
// import { Coins, Trophy, RefreshCw } from "lucide-react-native";
// import Toast from "react-native-toast-message";

// const { width } = Dimensions.get("window");
// const WHEEL_SIZE = width * 0.8;

// // চাকার পুরস্কারের লিস্ট (ডিগ্রী অনুযায়ী সাজানো)
// const PRIZES = [
//   { name: "10 Coins", deg: 0 },
//   { name: "Try Again", deg: 60 },
//   { name: "50 Coins", deg: 120 },
//   { name: "Jackpot 💎", deg: 180 },
//   { name: "5 Coins", deg: 240 },
//   { name: "100 Coins", deg: 300 },
// ];

// export default function SpinScreen() {
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [availableSpins, setAvailableSpins] = useState(3); // ইউজারের ডেইলি স্পিন লিমিট
//   const spinValue = useRef(new Animated.Value(0)).current;

//   const startSpin = () => {
//     if (isSpinning) return;
//     if (availableSpins <= 0) {
//       Toast.show({
//         type: "error",
//         text1: "No Spins Left!",
//         text2: "Come back tomorrow for more spins.",
//       });
//       return;
//     }

//     setIsSpinning(true);
//     setAvailableSpins((prev) => prev - 1);

//     // র‍্যান্ডম একটি পুরস্কার সিলেক্ট করা
//     const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
//     const selectedPrize = PRIZES[randomPrizeIndex];

//     // চাকাটি ৩ থেকে ৫ বার পুরো ঘুরবে, তারপর নির্দিষ্ট পুরস্কারে গিয়ে থামবে
//     const fullRotations = 360 * 5;
//     const finalTargetDeg = fullRotations + (360 - selectedPrize.deg);

//     // অ্যানিমেশন কনফিগারেশন
//     Animated.timing(spinValue, {
//       toValue: finalTargetDeg,
//       duration: 4000, // ৪ সেকেন্ড ঘুরবে
//       easing: Easing.out(Easing.quad), // শেষে এসে আস্তে থামবে (Smooth easing)
//       useNativeDriver: true,
//     }).start(() => {
//       setIsSpinning(false);

//       // পুরস্কার অনুযায়ী টোস্ট মেসেজ বা রেওয়ার্ড দেওয়া
//       Toast.show({
//         type: selectedPrize.name.includes("Try Again") ? "info" : "success",
//         text1: selectedPrize.name.includes("Try Again") ? "Better Luck Next Time!" : "Congratulations! 🎉",
//         text2: `You won ${selectedPrize.name}`,
//       });

//       // অ্যানিমেশন রিসেট করা যাতে পরের বার আবার ঘোড়ানো যায়
//       // নতুন ভ্যালু হবে (finalTargetDeg % 360) যাতে চাকাটি যেখান থামার কথা সেখানেই স্থির দেখায়
//       spinValue.setValue(finalTargetDeg % 360);
//     });
//   };

//   // Animated Value-কে ডিগ্রীতে কনভার্ট করা
//   const spinRotation = spinValue.interpolate({
//     inputRange: [0, 360],
//     outputRange: ["0deg", "360deg"],
//   });

//   return (
//     <ScrollView showsVerticalScrollIndicator={false}>
//       <SafeAreaView style={styles.container}>
//         {/* Top Header stats */}
//         <View style={styles.header}>
//           <View style={styles.statBox}>
//             <Trophy color="#f59e0b" size={18} />
//             <Text style={styles.statText}>Lucky Wheel</Text>
//           </View>
//           <View style={styles.statBox}>
//             <RefreshCw color="#1db954" size={16} />
//             <Text style={styles.statText}>{availableSpins} Spins Left</Text>
//           </View>
//         </View>

//         <Text style={styles.title}>Test Your Luck!</Text>
//         <Text style={styles.subtitle}>Spin the wheel and win mega rewards daily.</Text>

//         {/* 🎡 Wheel Area */}
//         <View style={styles.wheelContainer}>
//           {/* চাকার ওপরের নির্দেশক বা তীর (Pointer) */}
//           <View style={styles.pointer} />

//           {/* আসল চাকাটি */}
//           <Animated.View style={[styles.wheel, { transform: [{ rotate: spinRotation }] }]}>
//             {PRIZES.map((prize, index) => {
//               // প্রতিটি টেক্সটকে গোল চাকায় কোণাকুণি পজিশন করার জন্য ক্যালকুলেশন
//               const rotationDeg = index * (360 / PRIZES.length);
//               return (
//                 <View
//                   key={index}
//                   style={[styles.prizeSector, { transform: [{ rotate: `${rotationDeg}deg` }] }]}
//                 >
//                   <Text style={styles.prizeText}>{prize.name}</Text>
//                 </View>
//               );
//             })}
//             {/* চাকার মাঝখানের বৃত্ত */}
//             <View style={styles.centerCircle} />
//           </Animated.View>
//         </View>

//         {/* 🔘 Spin Button */}
//         <TouchableOpacity
//           style={[styles.spinButton, isSpinning && styles.disabledButton]}
//           onPress={startSpin}
//           disabled={isSpinning}
//         >
//           <Coins color="#000" size={22} style={{ marginRight: 8 }} />
//           <Text style={styles.buttonText}>{isSpinning ? "SPINNING..." : "SPIN NOW"}</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </ScrollView>
//   );
// }

// // 🎨 প্রিমিয়াম ডার্ক ও ইউজার-অ্যাক্টিভ স্টাইল
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#090d16", // তোমার মেইন স্টেটাসবারের কালার থিম
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 40,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "90%",
//     marginTop: 10,
//   },
//   statBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#111827",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#1e293b",
//   },
//   statText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "600",
//     marginLeft: 6,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#64748b",
//     textAlign: "center",
//     paddingHorizontal: 40,
//     marginBottom: 20,
//   },
//   wheelContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 20,
//   },
//   pointer: {
//     width: 0,
//     height: 0,
//     backgroundColor: "transparent",
//     borderStyle: "solid",
//     borderLeftWidth: 15,
//     borderRightWidth: 15,
//     borderBottomWidth: 30,
//     borderLeftColor: "transparent",
//     borderRightColor: "transparent",
//     borderBottomColor: "#f59e0b", // গোল্ডেন রঙের পয়েন্টার
//     position: "absolute",
//     top: -20,
//     zIndex: 10,
//     transform: [{ rotate: "180deg" }],
//   },
//   wheel: {
//     width: WHEEL_SIZE,
//     height: WHEEL_SIZE,
//     borderRadius: WHEEL_SIZE / 2,
//     borderWidth: 8,
//     borderColor: "#1e293b",
//     backgroundColor: "#111827",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },
//   prizeSector: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     paddingTop: 25,
//   },
//   prizeText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   centerCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#1e293b",
//     position: "absolute",
//     borderWidth: 4,
//     borderColor: "#f59e0b",
//   },
//   spinButton: {
//     backgroundColor: "#f59e0b", // প্রিমিয়াম গোল্ডেন কালার
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "85%",
//     height: 56,
//     borderRadius: 28,
//     marginBottom: 20,
//     shadowColor: "#f59e0b",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   disabledButton: {
//     backgroundColor: "#334155",
//     shadowOpacity: 0,
//     elevation: 0,
//   },
//   buttonText: {
//     color: "#000",
//     fontSize: 16,
//     fontWeight: "bold",
//     letterSpacing: 1,
//   },
// });