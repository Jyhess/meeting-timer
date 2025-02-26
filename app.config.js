module.exports = {
  expo: {
    name: 'CoachTimer',
    slug: 'coach-timer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'coachtimer',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.coachtimer.app'
    },
    android: {
      package: 'com.coachtimer.app',
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#1a1a1a'
      }
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png'
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true
    },
    assetBundlePatterns: [
      "assets/sounds/*",
      "assets/images/*"
    ]
  }
};