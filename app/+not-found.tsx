import React, { useEffect } from 'react';
import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotFoundScreen() {
  const pathname = usePathname();

  useEffect(() => {
    console.warn('Route non trouvée:', {
      pathname,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Native',
    });
  }, [pathname]);

  return (
    <>
      <Stack.Screen options={{ title: 'Page non trouvée' }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          style={styles.gradient}
        >
          <Text style={styles.title}>404</Text>
          <Text style={styles.subtitle}>Page non trouvée</Text>
          <Text style={styles.text}>
            Désolé, la page que vous recherchez n'existe pas.
          </Text>
          <Link href="/" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Retour à l'accueil</Text>
            </Pressable>
          </Link>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 