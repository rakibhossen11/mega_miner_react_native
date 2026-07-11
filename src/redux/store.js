import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';

// ১. পারসিস্ট কনফিগারেশন সেটআপ
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // 👈 শুধুমাত্র auth স্লাইসের ডাটা (টোকেন ও ইউজার) সেভ থাকবে
};

// ২. সব রিডিউসারকে একসাথে কম্বাইন করা
const rootReducer = combineReducers({
  auth: authReducer,
});

// ৩. পারসিস্টেড রিডিউসার তৈরি
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ৪. স্টোর কনফিগার করা
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // রেডাক্স পারসিস্টের ইন্টারনাল অ্যাকশনগুলোকে এরর দেখানো থেকে ইগনোর করা
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ৫. পারসিস্টর এক্সপোর্ট (এটি অ্যাপ রি-লোড টাইমে ডাটা ফিরিয়ে আনবে)
export const persistor = persistStore(store);


// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });