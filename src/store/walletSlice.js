import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

// 🚀 আপনার লাইভ ডেপ্লয় করা ব্যাকএন্ড সার্ভারের ডোমেইন URL এখানে বসাবেন
const API_BASE = "http://192.168.0.109:3000/api/dashboard"; 

export const fetchWalletData = createAsyncThunk(
  "wallet/fetchWalletData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/user-profile`);
      const json = await res.json();
      if (!json.success) return rejectWithValue(json.error);
      return json.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const claimMiningRewards = createAsyncThunk(
  "wallet/claimMiningRewards",
  async (amount, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/sync-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, action: "COLLECT" })
      });
      const json = await res.json();
      if (!json.success) return rejectWithValue(json.error);
      return json;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const syncToVault = createAsyncThunk(
  "wallet/syncToVault",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/sync-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SYNC" })
      });
      const json = await res.json();
      if (!json.success) return rejectWithValue(json.error);
      return json;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    userId: null,
    username: "Miner Node",
    userEmail: "",
    totalCoin: 0.0,
    totalDollar: 0.0,
    dbMiningWallet: 0.0,
    miningSpeed: 1.5,
    boostPower: 1.0,
    loading: false,
    isAuthenticated: false,
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.userId = action.payload.userId;
        state.username = action.payload.username;
        state.userEmail = action.payload.userEmail;
        state.totalCoin = parseFloat(action.payload.totalCoin || 0);
        state.totalDollar = parseFloat(action.payload.totalDollar || 0);
        state.dbMiningWallet = parseFloat(action.payload.miningWallet || 0);
        state.miningSpeed = parseFloat(action.payload.miningSpeed || 1.5);
        state.boostPower = parseFloat(action.payload.boostPower || 1.0);
      })
      .addCase(claimMiningRewards.fulfilled, (state, action) => {
        state.dbMiningWallet = parseFloat(action.payload.newMiningWallet || 0);
        state.totalCoin = parseFloat(action.payload.newTotalCoin || 0);
        Toast.show({ type: "success", text1: "Success", text2: action.payload.message });
      })
      .addCase(syncToVault.fulfilled, (state, action) => {
        state.dbMiningWallet = parseFloat(action.payload.newMiningWallet || 0);
        state.totalCoin = parseFloat(action.payload.newTotalCoin || 0);
        Toast.show({ type: "success", text1: "Vault Synced", text2: action.payload.message });
      });
  }
});

export const { setAuth, logoutUser } = walletSlice.actions;
export default walletSlice.reducer;