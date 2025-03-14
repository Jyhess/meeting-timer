import { StyleSheet, Platform, Dimensions } from 'react-native';

// Calculer la hauteur disponible en enlevant le header et les paddings
const screenHeight = Dimensions.get('window').height;
const headerHeight = 76; // 20px padding top + 36px contenu + 20px padding bottom
const tabBarHeight = 50; // Hauteur de la barre des onglets
const gridPadding = 20; // 10px padding top + 10px padding bottom
const cardGap = 10;
const availableHeight = screenHeight - headerHeight - tabBarHeight - gridPadding;
const cardHeight = (availableHeight - (cardGap * 2)) / 3; // Hauteur pour 3 cartes avec 2 gaps

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: headerHeight,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  presetList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#888',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  grid: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    gap: cardGap,
  },
  presetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  alertIcon: {
    opacity: 0.6,
  },
});