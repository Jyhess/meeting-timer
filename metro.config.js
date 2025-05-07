const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration des extensions
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'];

module.exports = config; 