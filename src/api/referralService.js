import apiClient from './apiClient';

export const referralService = {
  // ১. ইউজারের লাইভ টিম লিস্ট ও রেফারেল কোড স্ট্যাটাস আনা
  getReferralStats: async () => {
    const response = await apiClient.get('/referral/stats');
    return response.data;
  },
  // ২. নতুন কোনো রেফারেল কোড সাবমিট করা (প্রয়োজন হলে)
  applyReferral: async (referrerId, referredUserId) => {
    const response = await apiClient.post('/referral/process', {
      referrer_id: referrerId,
      referred_user_id: referredUserId
    });
    return response.data;
  }
};