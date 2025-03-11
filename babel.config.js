module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './src/tamagui.config.js',
        }
      ],
      'react-native-reanimated/plugin',
      'transform-inline-environment-variables',
      '@babel/plugin-transform-export-namespace-from'
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
}; 