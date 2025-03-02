# Coach Timer - Application Android Native

## Description du Projet
Développer une application de minuterie pour coach sportif en Android natif avec Kotlin. L'application permettra de créer et gérer des séquences d'entraînement personnalisées avec des minuteries.

## Technologies à Utiliser
- Kotlin
- Jetpack Compose pour l'UI
- Material Design 3
- Room Database pour le stockage local
- MediaPlayer pour les sons
- ViewModel et LiveData pour la gestion d'état
- Coroutines pour l'asynchrone
- Hilt pour l'injection de dépendances

## Fonctionnalités Principales

### 1. Navigation (Bottom Navigation)
- Onglet "Timers" : Liste des minuteries sauvegardées
- Onglet "Nouveau" : Création d'une nouvelle minuterie
- Onglet "Préférences" : Paramètres de l'application

### 2. Gestion des Minuteries
- Création de séquences d'exercices avec :
  - Durée de travail
  - Durée de repos
  - Nombre de répétitions
  - Nombre de séries
  - Sons personnalisables pour les transitions
- Support du mode plein écran
- Vibrations pour les transitions
- Lecture en arrière-plan

### 3. Interface Utilisateur
- Thème sombre par défaut
- Animations fluides avec Jetpack Compose
- Support du mode paysage
- Effets de flou (BlurView) pour les overlays
- Indicateurs de progression circulaires
- Gestes pour contrôler la minuterie

### 4. Stockage et Partage
- Sauvegarde locale des minuteries
- Export/Import des configurations
- Backup des paramètres

### 5. Paramètres
- Personnalisation des sons
- Gestion des vibrations
- Paramètres d'affichage
- Options de notification
- Préférences de verrouillage d'écran

## Architecture
- Clean Architecture avec séparation en couches :
  - UI (Compose)
  - Domain (Use Cases)
  - Data (Repository)
- MVVM avec StateFlow
- Repository Pattern
- Single Activity

## Exigences Techniques
- Minimum SDK : API 26 (Android 8.0)
- Target SDK : API 34 (Android 14)
- Support du mode sombre
- Support du mode hors-ligne
- Gestion optimisée de la batterie
- Gestion des interruptions (appels, etc.)

## Bibliothèques Suggérées
```gradle
dependencies {
    // UI
    implementation "androidx.compose.ui:ui:1.6.x"
    implementation "androidx.compose.material3:material3:1.2.x"
    
    // Architecture Components
    implementation "androidx.lifecycle:lifecycle-viewmodel-compose:2.7.x"
    implementation "androidx.room:room-runtime:2.6.x"
    implementation "androidx.room:room-ktx:2.6.x"
    
    // Dependency Injection
    implementation "com.google.dagger:hilt-android:2.50"
    
    // Navigation
    implementation "androidx.navigation:navigation-compose:2.7.x"
    
    // Media
    implementation "androidx.media3:media3-exoplayer:1.2.x"
    
    // Background Processing
    implementation "androidx.work:work-runtime-ktx:2.9.x"
}
```

## Structure des Packages
```
com.coachtimer/
├── data/
│   ├── local/
│   ├── repository/
│   └── models/
├── domain/
│   ├── usecases/
│   ├── models/
│   └── repository/
├── ui/
│   ├── theme/
│   ├── components/
│   └── screens/
│       ├── timers/
│       ├── creation/
│       └── settings/
└── utils/
```

## Points d'Attention Particuliers
1. Gestion efficace du cycle de vie des composants
2. Optimisation de la consommation de batterie
3. Gestion des permissions (vibration, stockage)
4. Tests unitaires et d'intégration
5. Support des différentes tailles d'écran
6. Gestion des configurations en mode paysage
7. Sauvegarde et restauration d'état
8. Gestion des erreurs et feedback utilisateur

## Fonctionnalités Bonus
1. Widgets pour l'écran d'accueil
2. Support Wear OS
3. Intégration Google Fit
4. Mode tablette optimisé
5. Backup dans Google Drive
6. Partage de minuteries entre utilisateurs
7. Statistiques d'utilisation
8. Thèmes personnalisables 