module.exports = {
  expo: {
    name: 'Meeting Timer',
    slug: 'meeting-timer',
    owner: 'jyhess',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'meetingtimer',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "5488530f-6320-46ad-b0b9-5532f24ee751"
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
      },
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-localization',
      'expo-dev-client',
    ],
    experiments: {
      typedRoutes: true
    },
    assetBundlePatterns: [
      "assets/sounds/*",
      "assets/images/*"
    ],
    updates: {
      url: "https://u.expo.dev/5488530f-6320-46ad-b0b9-5532f24ee751"
    },
    version: "1.0.2",
    runtimeVersion: {
      policy: "fingerprint"
    }
  }
};