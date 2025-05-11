import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../src/components/Timer/Icon';
import { IconName } from '../../src/types/icons';
import { useSettings } from '../../src/hooks/useSettings';
import { styles } from '../../src/styles/Settings.styles';
import { theme } from '../../src/theme';
import { getSoundConfigs } from '../../src/types/sounds';
import { ToggleSlider } from '@/src/components/Timer/ToggleSlider';
import { useAudio } from '@/src/contexts/AudioContext';
import { Link } from 'expo-router';
import { useTranslation } from '../../src/hooks/useTranslation';
import { Language } from '../../src/locales';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import * as Device from 'expo-device';

export default function SettingsScreen() {
  const { t, language, changeLanguage } = useTranslation();
  const { 
    defaultAlertDuration,
    setDefaultAlertDuration,
    availableSounds,
    toggleSound,
  } = useSettings();
    
  const [alertDuration, setAlertDuration] = useState(defaultAlertDuration.toString());
  const { playSound, stopSound, playingSound } = useAudio();
  const [copied, setCopied] = useState(false);

  const applicationId = Application.applicationId || '?ID?';
  const applicationName = Application.applicationName || '?NAME?';
  const version = Application.nativeApplicationVersion || '?.?.?';
  const buildNumber = Application.nativeBuildVersion || '?';
  const sdkVersion = Constants.expoConfig?.sdkVersion || '?';
  const platform = Platform.OS || '?';
  const platformVersion = Platform.Version || '?';
  const lastUpdateTime = Application.getLastUpdateTimeAsync().then((date) => date.toISOString().replace('T', ' ').slice(0, 16)) || '?';

  const handleCopyVersion = async () => {
    const toCopy = `Version ${version} (Build ${buildNumber})` + 
    `\nPlatform: ${platform} ${platformVersion}` +
    `\nDevice: ${Device.manufacturer} - ${Device.modelName}` +
    `\nSDK: ${sdkVersion}` +
    `\n${applicationName} (${applicationId})` +
    `\nUpdated: ${lastUpdateTime}`;
    await Clipboard.setStringAsync(toCopy);
    setCopied(true);
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setAlertDuration(defaultAlertDuration.toString());
  }, [defaultAlertDuration]);

  const handleAlertDurationChange = (text: string) => {
    // Accept only numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setAlertDuration(numericValue);
  };

  const handleAlertDurationBlur = () => {
    const numValue = parseInt(alertDuration, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setDefaultAlertDuration(numValue);
    } else {
      // Reset to previous value if invalid
      setAlertDuration(defaultAlertDuration.toString());
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    changeLanguage(newLanguage);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('common.preferences')}</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('alerts.duration')}</Text>
            <Text style={styles.sectionDescription}>
              {t('alerts.durationDescription')}
            </Text>
            
            <View style={styles.durationContainer}>
              <View style={styles.durationInputContainer}>
                <TextInput
                  style={styles.durationInput}
                  value={alertDuration}
                  onChangeText={handleAlertDurationChange}
                  onBlur={handleAlertDurationBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.durationUnit}>{t('common.seconds')}</Text>
              </View>
              
              <View style={styles.durationControls}>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => {
                    const newValue = Math.max(1, parseInt(alertDuration, 10) - 1);
                    setAlertDuration(newValue.toString());
                    setDefaultAlertDuration(newValue);
                  }}
                >
                  <Icon name="remove" size={24} color="#eee" />
                </Pressable>
                
                <Pressable
                  style={styles.durationButton}
                  onPress={() => {
                    const newValue = Math.min(30, parseInt(alertDuration, 10) + 1);
                    setAlertDuration(newValue.toString());
                    setDefaultAlertDuration(newValue);
                  }}
                >
                  <Icon name="add" size={24} color="#eee" />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('alerts.availableSounds')}</Text>
            <Text style={styles.sectionDescription}>
              {t('alerts.availableSoundsDescription')}
            </Text>
            
            <View style={styles.soundsList}>
              {getSoundConfigs().map((soundConfig) => (
                <View key={soundConfig.id} style={styles.soundItem}>
                  <View style={styles.soundInfo}>
                    <Icon name={soundConfig.icon as IconName} size={24} color={theme.colors.white} />
                    <Text style={styles.soundName}>{t(`sounds.${soundConfig.id}`)}</Text>
                  </View>
                  <View style={styles.soundControls}>
                    <ToggleSlider
                      value={availableSounds.includes(soundConfig.id)}
                      onToggle={() => toggleSound(soundConfig.id, !availableSounds.includes(soundConfig.id))}
                    />
                    <Pressable
                      style={styles.playButton}
                      onPress={() => playingSound === soundConfig.id ? stopSound() : playSound(soundConfig.id)}
                    >
                      <Icon
                        name={playingSound === soundConfig.id ? "stop" : "play_arrow" as IconName}
                        size={24}
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('common.language')}</Text>
            <Text style={styles.sectionDescription}>
              {t('common.languageDescription')}
            </Text>
            
            <View style={styles.languageContainer}>
              <Pressable
                style={[styles.languageButton, language === 'fr' && styles.languageButtonActive]}
                onPress={() => handleLanguageChange('fr')}
              >
                <Text style={[styles.languageText, language === 'fr' && styles.languageTextActive]}>
                  Français
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[styles.languageText, language === 'en' && styles.languageTextActive]}>
                  English
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('common.about')}</Text>
            <Text style={styles.sectionDescription}>{t('common.aboutDescription')}</Text>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Version {version} - Build {buildNumber}</Text>
              <Text style={styles.versionText}>{platform} {platformVersion}</Text>
              <Text style={styles.versionText}>{Device.manufacturer} - {Device.modelName}</Text>
              <Text style={styles.versionText}>SDK {sdkVersion}</Text>
              <Text style={styles.versionText}>{applicationName} ({applicationId})</Text>
              <Text style={styles.versionText}>Updated {lastUpdateTime}</Text>
              <Pressable
                style={[styles.copyButton, copied && styles.copyButtonActive]}
                onPress={handleCopyVersion}
              >
                <Icon
                  name={copied ? "check" : "content_copy"}
                  size={20}
                  color={theme.colors.white}
                />
              </Pressable>
            </View>
            <Link href="/legal" asChild>
              <Pressable style={styles.legalLink}>
                <Text style={styles.legalLinkText}>{t('common.legal')}</Text>
                <Icon name="arrow_back" size={24} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}