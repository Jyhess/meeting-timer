# Prompt pour recréer CoachTimer from scratch

## Description du projet

Je souhaite créer une application mobile appelée "CoachTimer" - un outil professionnel de gestion du temps pour les coachs, formateurs et présentateurs. L'application doit offrir une interface élégante avec un thème sombre et des fonctionnalités avancées de minuterie.

## Fonctionnalités principales

1. **Minuterie intuitive**
   - Saisie rapide du temps via un pavé numérique
   - Affichage clair du temps restant
   - Contrôles de lecture/pause/arrêt
   - Gestion du dépassement de temps

2. **Système d'alertes personnalisables**
   - Alertes avant la fin du temps (configurable en minutes)
   - Alerte de fin de temps
   - Alertes de dépassement (configurable en minutes)
   - Chaque alerte peut être activée/désactivée individuellement

3. **Sons d'alertes variés**
   - Gong
   - Cloche
   - Carillon
   - Alarme
   - Sons personnalisés (importés par l'utilisateur)

4. **Effets visuels**
   - Flash
   - Pulsation
   - Vibration

5. **Sauvegarde des configurations**
   - Enregistrement automatique des derniers timers utilisés
   - Affichage des timers récents sur l'écran d'accueil

6. **Paramètres avancés**
   - Durée par défaut des timers
   - Durée des vibrations
   - Durée des effets visuels
   - Gestion des sons personnalisés

## Spécifications techniques

- Utiliser React Native avec Expo (SDK 52+)
- Expo Router pour la navigation
- Structure à trois onglets:
  - Onglet "Timers" pour afficher les configurations sauvegardées
  - Onglet "Nouveau" pour créer/configurer un nouveau timer
  - Onglet "Préférences" pour les paramètres globaux
- Utiliser React Native Reanimated pour les animations
- Utiliser AsyncStorage pour la persistance des données
- Utiliser Expo AV pour la gestion des sons
- Utiliser Expo Document Picker pour l'importation de sons personnalisés
- Utiliser des icônes PNG personnalisées (pas de bibliothèque d'icônes)
- Styles dans des fichiers séparés

## Design

- Thème sombre avec dégradés (fond noir/gris foncé)
- Interface minimaliste et professionnelle
- Grands chiffres pour l'affichage du temps
- Effets de flou pour les modales et les conteneurs
- Couleurs d'accent:
  - Vert (#4CAF50) pour les actions positives
  - Orange (#FF9800) pour les alertes/pauses
  - Rouge (#f44336) pour les arrêts/erreurs

## Structure des données

```typescript
// Types pour les alertes
type AlertEffect = 'flash' | 'pulse' | 'shake';
type AlertSound = 'gong' | 'bell' | 'chime' | 'alarm' | 'custom';

// Structure d'une alerte
type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: AlertSound;
  effects: AlertEffect[]; // Tableau d'effets
  vibrationDuration?: number; // Durée de vibration en secondes
  effectDuration?: number; // Durée des effets visuels en secondes
  customSoundUri?: string; // URI du son personnalisé
  lastTriggered?: number;
};

// Structure d'une configuration de timer
type TimerPreset = {
  id: string;
  name: string;
  minutes: number;
  alerts: Alert[];
  created_at: string;
};

// Structure d'un son personnalisé
type CustomSound = {
  id: string;
  name: string;
  uri: string;
  type: string;
};
```

## Comportement des alertes

- Alerte "avant la fin": se déclenche X minutes avant la fin du timer
- Alerte "fin": se déclenche exactement à la fin du timer
- Alerte "après la fin": se déclenche X minutes après la fin du timer

## Ressources

- Inclure des sons pour chaque type d'alerte
- Utiliser des icônes PNG personnalisées pour tous les boutons et indicateurs
- Stocker les ressources dans un dossier assets organisé

## Compatibilité

- L'application doit fonctionner sur iOS, Android et Web
- Implémenter des alternatives pour les fonctionnalités spécifiques à certaines plateformes
- Gestion spéciale des sons sur le web (utilisation de l'API Audio native)

## Priorités de développement

1. Créer l'interface de base avec la navigation par onglets
2. Implémenter la logique de minuterie avec les contrôles de base
3. Ajouter le système d'alertes avec sons et effets visuels
4. Implémenter la sauvegarde et le chargement des configurations
5. Ajouter la gestion des sons personnalisés
6. Peaufiner l'interface utilisateur et les animations
7. Optimiser pour différentes plateformes

Merci de développer cette application en suivant ces spécifications tout en gardant le code propre, bien organisé et maintenable.