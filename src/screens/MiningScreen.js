import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchWalletData, claimMiningRewards, syncToVault } from "../store/walletSlice";
import Toast from "react-native-toast-message";
import { SafeAreaView } from 'react-native-safe-area-context';

// 🚀 রিঅ্যাক্ট নেটিভ প্রিমিয়াম সাইবার আইকন কিট
import { 
  Cpu, 
  Wallet, 
  Zap, 
  Flame, 
  RefreshCw, 
  CircleDollarSign, 
  TrendingUp, 
  Layers 
} from "lucide-react-native";

export default function MiningScreen() {
  const dispatch = useDispatch();
  
  // 🎯 সেন্ট্রাল রিডাক্স স্টোর থেকে রিয়েল-টাইম গ্লোবাল স্টেট রিড
  const { 
    dbMiningWallet, 
    totalCoin, 
    miningSpeed, 
    boostPower, 
    username, 
    userEmail,
    userId 
  } = useSelector((state) => state.wallet);
  
  // 🔒 লোকাল রিঅ্যাক্টিভ স্টেটস
  const [coins, setCoins] = useState(0.0);
  const [isHybrid, setIsHybrid] = useState(false);
  const [isBoost, setIsBoost] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 📡 প্রথমবার মাউন্ট হওয়ার সময় ডাটাবেজ থেকে ওয়ালেট ডাটা সিঙ্ক
  useEffect(() => {
    dispatch(fetchWalletData());
  }, [dispatch]);

  // ⚡ হাই-পারফরম্যান্স ৬টি ডেসিমেল লাইভ কাউন্টার ইঞ্জিন (১০০ms লুপ)
  useEffect(() => {
    const interval = setInterval(() => {
      // প্রতি ঘণ্টায় মাইনিং স্পিডকে ৩৬,০০০ দিয়ে ভাগ করে প্রতি ১০০ms এর রেট বের করা হয়েছে
      const currentBaseSpeed = (miningSpeed / 36000); 
      let multiplier = 1.0;
      
      // ডাইনামিক স্পিড ক্যালকুলেশন ম্যাট্রিক্স
      if (isHybrid && isBoost) multiplier = 1.5 * (boostPower > 1 ? boostPower : 2.0);
      else if (isBoost) multiplier = (boostPower > 1 ? boostPower : 2.0);
      else if (isHybrid) multiplier = 1.5;

      setCoins((prev) => parseFloat((prev + currentBaseSpeed * multiplier).toFixed(8)));
    }, 100); 

    return () => clearInterval(interval); // মেমোরি লিক প্রোটেকশন
  }, [miningSpeed, boostPower, isHybrid, isBoost]);

  // 💰 কন্ডিশন ১: লাইভ কয়েন লোকাল মাইনিং ওয়ালেটে ক্লেইম করা
  const handleCollectCoins = async () => {
    if (coins <= 0 || actionLoading) return;
    
    setActionLoading(true);
    try {
      await dispatch(claimMiningRewards(coins)).unwrap();
      setCoins(0.0); // সফল ক্লেইম শেষে লাইভ কাউন্টার রিসেট
    } catch (err) {
      Toast.show({ type: "error", text1: "Collection Failed", text2: err || "Database rejected." });
    } finally {
      setActionLoading(false);
    }
  };

  // 🔄 কন্ডিশন ২: মাইনিং ওয়ালেট মেইন সেন্ট্রাল ভল্টে সিঙ্ক করা
  const handleSyncVault = async () => {
    if (dbMiningWallet <= 0 || actionLoading) return;

    setActionLoading(true);
    try {
      await dispatch(syncToVault()).unwrap();
    } catch (err) {
      Toast.show({ type: "error", text1: "Sync Failed", text2: err || "Connection blocked." });
    } finally {
      setActionLoading(false);
    }
  };

  // ডাইনামিক লাইভ স্পিড লেবেল জেনারেটর
  const getCurrentSpeedLabel = () => {
    let factor = 1.0;
    const effectiveBoost = boostPower > 1 ? boostPower : 2.0;
    if (isHybrid && isBoost) factor = 1.5 * effectiveBoost;
    else if (isBoost) factor = effectiveBoost;
    else if (isHybrid) factor = 1.5;
    
    return `+${(miningSpeed * factor).toFixed(2)} D/hr`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* 👤 ইউজার নোড প্রোফাইল টার্মিনাল */}
        <View style={styles.headerCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>
                {username ? username.substring(0, 2).toUpperCase() : "MN"}
              </Text>
            </View>
            <View>
              <Text style={styles.userTitle}>{username}</Text>
              <Text style={styles.userSub} numberOfLines={1}>{userEmail || "node_secure@crypto.net"}</Text>
              <Text style={styles.nodeIdBadge}>NODE ID: {userId || "00000"}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.syncBtn, dbMiningWallet <= 0 && styles.disabledBtn]} 
            onPress={handleSyncVault}
            disabled={dbMiningWallet <= 0 || actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color="#090d16" />
            ) : (
              <>
                <RefreshCw color="#090d16" size={12} />
                <Text style={styles.syncBtnTxt}>SYNC VAULT</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ⛏️ রিয়েল-টাইম মাইনিং ওয়ালেট কাউন্টার */}
        <View style={styles.counterCard}>
          <View style={styles.counterHeader}>
            <Cpu color="#f59e0b" size={16} />
            <Text style={styles.counterLabel}>MINING COUNTER</Text>
          </View>
          <Text style={styles.counterValue}>
            {dbMiningWallet.toFixed(8)} <Text style={styles.coinUnit}>COIN</Text>
          </Text>
        </View>

        {/* 💰 সিকিউরড মেইন ভল্ট ব্যালেন্স কার্ড */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceLeft}>
            <Wallet color="#10b981" size={16} />
            <Text style={styles.balanceLabel}>Secured Vault Balance</Text>
          </View>
          <Text style={styles.balanceVal}>
            {totalCoin.toFixed(8)} <Text style={styles.vaultUnit}>D</Text>
          </Text>
        </View>

        {/* 🛠️ সাইবার কন্ট্রোল মোড প্যানেল */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.modeBtn, isHybrid && styles.activeHybrid]} 
            onPress={() => setIsHybrid(!isHybrid)}
          >
            <Layers color={isHybrid ? "#090d16" : "#64748b"} size={14} />
            <Text style={[styles.modeBtnTxt, isHybrid && styles.activeTxt]}>
              {isHybrid ? "Hybrid 1.5X" : "Hybrid Mode"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeBtn, isBrowse => isBoost && styles.activeBoost]} 
            onPress={() => setIsBoost(!isBoost)}
          >
            <Flame color={isBoost ? "#090d16" : "#64748b"} size={14} />
            <Text style={[styles.modeBtnTxt, isBoost && styles.activeTxt]}>
              {isBoost ? `Turbo ${boostPower}X` : "Turbo Boost"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔮 সেন্ট্রাল গ্লোয়িং কোর ইঞ্জিন */}
        <View style={styles.coreContainer}>
          <View style={[
            styles.outerCore, 
            isBoost && styles.coreCyan, 
            isHybrid && !isBoost && styles.coreOrange
          ]}>
            <View style={styles.innerCore}>
              <CircleDollarSign 
                color={isBoost ? "#06b6d4" : isHybrid ? "#f97316" : "#f59e0b"} 
                size={40} 
              />
            </View>
          </View>
        </View>

        {/* 📊 লাইভ ক্রিপ্টো লিট কাউন্টার */}
        <View style={styles.liveWrapper}>
          <Text style={styles.liveVal}>{coins.toFixed(8)}</Text>
          <View style={styles.badgeRow}>
            <Text style={styles.liveBadge}>LIVE NODE</Text>
            <View style={styles.speedBadge}>
              <TrendingUp color="#f59e0b" size={10} />
              <Text style={styles.speedBadgeTxt}>{getCurrentSpeedLabel()}</Text>
            </View>
          </View>
        </View>

        {/* 📥 ক্লেইম সাবমিট বাটন */}
        <TouchableOpacity 
          style={[styles.claimBtn, coins <= 0 && styles.disabledClaimBtn]} 
          onPress={handleCollectCoins}
          disabled={coins <= 0 || actionLoading}
        >
          <Text style={styles.claimBtnTxt}>
            {actionLoading ? "SYNCING BLOCK..." : "💰 COLLECT MINED COINS"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 রিঅ্যাক্ট নেটিভ হাই-ফিডেলিটি স্টাইলশীট (১০০% অ্যান্ডরয়েড ও ব্রাউজার ফ্রেন্ডলি)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  scrollContainer: { padding: 16, pb: 32 },
  
  // প্রোফাইল হেডার কার্ড
  headerCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#1e293b", marginBottom: 14 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, marginRight: 8 },
  avatar: { width: 40, height: 40, backgroundColor: "#f59e0b", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  avatarTxt: { fontWeight: "900", color: "#090d16", fontSize: 14 },
  userTitle: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  userSub: { color: "#64748b", fontSize: 11, marginTop: 1 },
  nodeIdBadge: { color: "#f59e0b", fontSize: 9, fontFamily: "monospace", fontWeight: "bold", marginTop: 3 },
  
  // অ্যাকশন বাটনসমূহ
  syncBtn: { backgroundColor: "#f59e0b", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 6 },
  syncBtnTxt: { color: "#090d16", fontSize: 10, fontWeight: "900" },
  disabledBtn: { opacity: 0.4 },
  
  // কাউন্টার ও ওয়ালেট কার্ড
  counterCard: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#1e293b", marginBottom: 12 },
  counterHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  counterLabel: { color: "#94a3b8", fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },
  counterValue: { color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "monospace" },
  coinUnit: { fontSize: 11, color: "#f59e0b", fontWeight: "bold" },
  
  // ভল্ট ব্যালেন্স রো
  balanceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(16,185,129,0.04)", borderWidth: 1, borderColor: "rgba(16,185,129,0.15)", borderRadius: 12, padding: 14, marginBottom: 16 },
  balanceLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  balanceLabel: { color: "#94a3b8", fontSize: 12, fontWeight: "500" },
  balanceVal: { color: "#10b981", fontWeight: "bold", fontFamily: "monospace", fontSize: 14 },
  vaultUnit: { color: "#64748b", fontSize: 11, fontWeight: "normal" },
  
  // মোড কন্ট্রোলারস গ্রিড
  buttonGroup: { flexDirection: "row", gap: 12, marginBottom: 16 },
  modeBtn: { flex: 1, backgroundColor: "#111827", padding: 12, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#1e293b", flexDirection: "row", gap: 6 },
  activeHybrid: { backgroundColor: "#f97316", borderColor: "#f97316" },
  activeBoost: { backgroundColor: "#06b6d4", borderColor: "#06b6d4" },
  modeBtnTxt: { color: "#64748b", fontSize: 12, fontWeight: "bold" },
  activeTxt: { color: "#090d16", fontWeight: "900" },
  
  // সেন্ট্রাল ইঞ্জিন শ্যাডো শাটল
  coreContainer: { marginVertical: 20, alignItems: "center", justifyContent: "center" },
  outerCore: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: "#f59e0b", justifyContent: "center", alignItems: "center", boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.25)" },
  coreCyan: { borderColor: "#06b6d4", boxShadow: "0px 0px 20px rgba(6, 182, 212, 0.35)" },
  coreOrange: { borderColor: "#f97316", boxShadow: "0px 0px 20px rgba(249, 115, 22, 0.3)" },
  innerCore: { width: 112, height: 112, borderRadius: 56, backgroundColor: "#020617", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  
  // লাইভ কাউন্টার লেবেল
  liveWrapper: { alignItems: "center", marginBottom: 28 },
  liveVal: { color: "#fff", fontSize: 36, fontWeight: "bold", fontFamily: "monospace", trackingWith: -0.5 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  liveBadge: { color: "#10b981", backgroundColor: "rgba(16,185,129,0.1)", fontSize: 9, fontWeight: "900", borderWidth: 1, borderColor: "rgba(16,185,129,0.2)", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  speedBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(245,158,11,0.08)", borderWidth: 1, borderColor: "rgba(245,158,11,0.15)", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  speedBadgeTxt: { color: "#f59e0b", fontSize: 9, fontWeight: "bold" },
  
  // বিগ ক্লেইম বাটন
  claimBtn: { backgroundColor: "#f59e0b", padding: 16, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: "#f59e0b", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  disabledClaimBtn: { backgroundColor: "#1e293b", shadowOpacity: 0 },
  claimBtnTxt: { color: "#090d16", fontSize: 13, fontWeight: "900", letterSpacing: 0.5 }
});