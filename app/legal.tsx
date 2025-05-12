import React from 'react';
import { ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/src/components/common/Icon';
import Constants from 'expo-constants';
import { theme } from '@/src/theme';
import { styles } from '@/src/styles/Legal.styles';
import { useTranslation } from '@/src/hooks/useTranslation';

const CustomHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Pressable onPress={onClose} style={styles.closeButton}>
      <Icon name="close" size={24} color={theme.colors.white} />
    </Pressable>
  </View>
);

export default function LegalScreen() {
  const { t } = useTranslation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:jyhess@gmail.com');
  };

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/jyhess/meeting-timer');
  };

  const handleIssuesPress = () => {
    Linking.openURL('https://github.com/jyhess/meeting-timer/issues');
  };

  const handleLicensePress = () => {
    Linking.openURL('https://github.com/jyhess/meeting-timer/blob/main/LICENSE');
  };

  const handleClose = () => {
    router.back();
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <>
      <Stack.Screen 
        options={{ 
          header: () => <CustomHeader title={t('legal.title')} onClose={handleClose} />,
          headerShown: true,
        }} 
      />
      <LinearGradient
        colors={[theme.colors.background.primary, theme.colors.background.secondary]}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.title}>{t('legal.legalNotice')}</Text>
            <Text style={styles.text}>
              {t('legal.description')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{t('legal.version')}</Text>
            <Text style={styles.text}>
              {t('legal.versionNumber').replace('{{version}}', appVersion)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{t('legal.contact')}</Text>
            <Text style={styles.text}>
              {t('legal.contactDescription')}
            </Text>
            <Pressable style={styles.linkContainer} onPress={handleEmailPress}>
              <Text style={styles.linkText}>jyhess@gmail.com</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <Text style={styles.text}>
              {t('legal.issuesDescription')}
            </Text>
            <Pressable style={styles.linkContainer} onPress={handleIssuesPress}>
              <Text style={styles.linkText}>https://github.com/jyhess/meeting-timer/issues</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{t('legal.privacyPolicy')}</Text>
            <Text style={styles.text}>
              {t('legal.privacyDescription')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{t('legal.termsOfUse')}</Text>
            <Text style={styles.text}>
              {t('legal.termsDescription')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{t('legal.credits')}</Text>
            <Text style={styles.text}>
              {t('legal.creditsDescription')}
            </Text>
            <Pressable style={styles.linkContainer} onPress={handleGitHubPress}>
              <Text style={styles.linkText}>https://github.com/jyhess/meeting-timer</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <Pressable style={styles.linkContainer} onPress={handleLicensePress}>
              <Text style={styles.linkText}>{t('legal.licenseDetails')}</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{t('legal.updates')}</Text>
            <Text style={styles.text}>
              {t('legal.updatesDescription')}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
} 