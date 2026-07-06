module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // 🔑 এই লাইনের নিচে Reanimated প্লাগইনটি যোগ করো:
    // plugins: ['react-native-reanimated/plugin'],
  };
};

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//   };
// };
