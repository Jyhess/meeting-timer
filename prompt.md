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

4. **Effets visuels**
   - Flash
   - Vibration

5. **Sauvegarde des configurations**
   - Enregistrement automatique des derniers timers utilisés
   - Affichage des timers récents sur l'écran d'accueil
   - Les timers sont triés dans l'ordre d'utilisation. Les plus récents d'abord

6. **Paramètres**
   - Durée par défaut des timers
   - Configuration par défaut des alertes
   - Durée des effets visuels

## Spécifications techniques

- Utiliser React Native avec Expo (SDK 52+)
- react-navigation pour la navigation
- Structure à trois onglets:
  - Onglet "Timers" pour afficher les configurations sauvegardées
  - Onglet "Nouveau" pour créer/configurer un nouveau timer
  - Onglet "Préférences" pour les paramètres globaux
- Utiliser React Native Reanimated pour les animations
- Utiliser AsyncStorage pour la persistance des données
- Utiliser react-native-sound et react-native-web-sound pour la gestion des sons
- Utiliser des icônes PNG personnalisées (pas de bibliothèque d'icônes)
- Styles dans des fichiers séparés
- Tous les commentaies doivent être en anglais

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
type AlertEffect = 'flash' | 'shake';
type AlertSound = 'gong' | 'bell' | 'chime' | 'alarm';

// Structure d'une alerte
type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: AlertSound;
  effects: AlertEffect[]; // Tableau d'effets
  effectDuration?: number; // Durée des effets en secondes
  lastTriggered?: number;
};

// Structure d'une configuration de timer
type TimerPreset = {
  id: string;
  name: string;
  minutes: number;
  alerts: Alert[];
  last_used: string;
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
5. Peaufiner l'interface utilisateur et les animations
6. Optimiser pour différentes plateformes

Merci de développer cette application en suivant ces spécifications tout en gardant le code propre, bien organisé et maintenable.
