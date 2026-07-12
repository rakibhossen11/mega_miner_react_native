import apiClient from './apiClient';

export const userService = {
  // লগইন থাকা ইউজারের প্রোফাইল ডাটা সার্ভার থেকে আনা
  getUserProfile: async () => {
    try {
      // 💡 লক্ষ্য করো: এখানে কোনো আইডি বা টোকেন পাস করতে হচ্ছে না!
      // apiClient-এর ইন্টারসেপ্টর অটোমেটিক টোকেন হেডার যোগ করে দেবে।
      const response = await apiClient.get('/profile');
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  }
};