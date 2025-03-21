module.exports = {
  expo: {
    name: 'Meeting Timer',
    slug: 'meeting-timer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'meetingtimer',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "27463754-938a-4738-ae20-cedfd653131b"
      }
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.meetingtimer.app'
    },
    android: {
      package: 'com.meetingtimer.app',
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