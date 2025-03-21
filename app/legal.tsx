import React from 'react';
import { ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/src/components/Timer/Icon';
import Constants from 'expo-constants';
import { theme } from '@/src/theme';
import { styles } from '@/src/styles/Legal.styles';

const CustomHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Pressable onPress={onClose} style={styles.closeButton}>
      <Icon name="close" size={24} color={theme.colors.white} />
    </Pressable>
  </View>
);

export default function LegalScreen() {
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
          header: () => <CustomHeader title="Informations légales" onClose={handleClose} />,
          headerShown: true,
        }} 
      />
      <LinearGradient
        colors={[theme.colors.background.primary, theme.colors.background.secondary]}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.title}>Mentions légales</Text>
            <Text style={styles.text}>
              L'application Meeting Timer est une application dédiée à la gestion du temps durant les réunions et les séances de coaching.
              Elle est fournie à titre gratuit et ne nécessite aucun compte utilisateur ni connexion Internet pour fonctionner.
              Elle est développée et maintenue par Jyhess.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Version</Text>
            <Text style={styles.text}>
              Version {appVersion}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Contact</Text>
            <Text style={styles.text}>
               Pour toute question ou demande d'information, vous pouvez nous contacter à :
            </Text>
            <Pressable style={styles.linkContainer} onPress={handleEmailPress}>
              <Text style={styles.linkText}>jyhess@gmail.com</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <Text style={styles.text}>
              Pour les bugs ou les suggestions, merci de créer une issue sur le repository GitHub :
            </Text>
            <Pressable style={styles.linkContainer} onPress={handleIssuesPress}>
              <Text style={styles.linkText}>https://github.com/jyhess/meeting-timer/issues</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Politique de confidentialité</Text>
            <Text style={styles.text}>
            Meeting Timer ne collecte aucune donnée personnelle.
              Toutes les données sont stockées localement sur votre appareil.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Conditions d'utilisation</Text>
            <Text style={styles.text}>
              L'application est fournie "telle quelle", sans garantie d'aucune sorte.
              Nous ne sommes pas responsables des dommages directs ou indirects causés par l'utilisation de l'application.
              L'utilisateur est responsable de l'usage qu'il fait de l'application,
              notamment dans des contextes où la mesure du temps est critique.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Crédits et licences</Text>
            <Text style={styles.text}>
              Cette application est publiée sous licence GLPv3.
              Vous pouvez contribuer au projet à travers son repository GitHub :
            </Text>
            <Pressable style={styles.linkContainer} onPress={handleGitHubPress}>
              <Text style={styles.linkText}>https://github.com/jyhess/meeting-timer</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <Pressable style={styles.linkContainer} onPress={handleLicensePress}>
              <Text style={styles.linkText}>Plus de détails dans le fichier LICENSE.md du repository GitHub</Text>
              <Icon name="arrow_back" size={20} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Modifications et Mise à Jour</Text>
            <Text style={styles.text}>
              L'éditeur se réserve le droit de modifier ces mentions légales à tout moment,
              notamment en cas d'évolution de l'application ou des obligations légales.
            </Text>
          </View>

        </ScrollView>
      </LinearGradient>
    </>
  );
} 