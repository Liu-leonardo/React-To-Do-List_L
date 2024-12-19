module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'], // 使用 Expo 的 Babel 预设
      plugins: [
        'react-native-reanimated/plugin', // 确保插件放在最后
      ],
    };
  };
  