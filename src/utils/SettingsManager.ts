import { Alert, AlertEffect } from '../types/timer';

const DEFAULT_ALERTS = {
  before: {
    id: 'before',
    name: 'Bientôt fini',
    enabled: true,
    timeOffset: 5,
    sound: 'bell',
    effects: ['flash'] as AlertEffect[],
  },
  end: {
    id: 'end',
    name: 'Temps écoulé',
    enabled: true,
    timeOffset: 0,
    sound: 'gong',
    effects: ['flash'] as AlertEffect[],
  },
  after: {
    id: 'after',
    name: 'Temps dépassé',
    enabled: true,
    timeOffset: 5,
    sound: 'alarm',
    effects: ['shake'] as AlertEffect[],
  },
} as const;

type SettingsEventType = 'defaultTimerMinutesChange' | 'defaultAlertDurationChange' | 'beforeAlertChange' | 'endAlertChange' | 'afterAlertChange';
type SettingsEventListener = (data: any) => void;

export class SettingsManager {
  private static instance: SettingsManager;

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  private defaultTimerMinutes: number = 30;
  private defaultAlertDuration: number = 5;
  private beforeAlert: Alert = { ...DEFAULT_ALERTS.before };
  private endAlert: Alert = { ...DEFAULT_ALERTS.end };
  private afterAlert: Alert = { ...DEFAULT_ALERTS.after };
  private listeners: Map<SettingsEventType, Set<SettingsEventListener>> = new Map();

  private constructor() {
    console.log('[SettingsManager] 🔧 Initialisation');
    this.loadSettings();
  }

  // Gestion des événements
  addEventListener(type: SettingsEventType, listener: SettingsEventListener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(listener);
  }

  removeEventListener(type: SettingsEventType, listener: SettingsEventListener) {
    this.listeners.get(type)?.delete(listener);
  }

  private emit(type: SettingsEventType, data: any) {
    this.listeners.get(type)?.forEach(listener => listener(data));
  }

  // Getters
  getDefaultTimerMinutes(): number {
    return this.defaultTimerMinutes;
  }

  getDefaultAlertDuration(): number {
    return this.defaultAlertDuration;
  }

  getBeforeAlert(): Alert {
    return { ...this.beforeAlert };
  }

  getEndAlert(): Alert {
    return { ...this.endAlert };
  }

  getAfterAlert(): Alert {
    return { ...this.afterAlert };
  }

  // Setters
  setDefaultTimerMinutes(minutes: number) {
    console.log(`[SettingsManager] ⏱️ Mise à jour de la durée par défaut: ${minutes}min`);
    this.defaultTimerMinutes = minutes;
    this.emit('defaultTimerMinutesChange', minutes);
    this.saveSettings();
  }

  setDefaultAlertDuration(duration: number) {
    console.log(`[SettingsManager] ⚡ Mise à jour de la durée des alertes: ${duration}s`);
    this.defaultAlertDuration = duration;
    
    // Mettre à jour la durée pour toutes les alertes
    if (this.beforeAlert.effects.includes('flash')) {
      this.updateBeforeAlert({ ...this.beforeAlert});
    }
    if (this.endAlert.effects.includes('flash')) {
      this.updateEndAlert({ ...this.endAlert});
    }
    if (this.afterAlert.effects.includes('shake')) {
      this.updateAfterAlert({ ...this.afterAlert});
    }

    this.emit('defaultAlertDurationChange', duration);
    this.saveSettings();
  }

  updateBeforeAlert(alert: Alert) {
    console.log('[SettingsManager] 🔔 Mise à jour de l\'alerte "bientôt fini"');
    if (alert.id !== 'before') throw new Error('ID d\'alerte invalide');
    this.beforeAlert = alert;
    this.emit('beforeAlertChange', alert);
    this.saveSettings();
  }

  updateEndAlert(alert: Alert) {
    console.log('[SettingsManager] 🔔 Mise à jour de l\'alerte "temps écoulé"');
    if (alert.id !== 'end') throw new Error('ID d\'alerte invalide');
    this.endAlert = alert;
    this.emit('endAlertChange', alert);
    this.saveSettings();
  }

  updateAfterAlert(alert: Alert) {
    console.log('[SettingsManager] 🔔 Mise à jour de l\'alerte "temps dépassé"');
    if (alert.id !== 'after') throw new Error('ID d\'alerte invalide');
    this.afterAlert = alert;
    this.emit('afterAlertChange', alert);
    this.saveSettings();
  }

  // Persistance
  private async loadSettings() {
    try {
      const settings = localStorage.getItem('settings');
      if (settings) {
        const { defaultTimerMinutes, defaultAlertDuration, beforeAlert, endAlert, afterAlert } = JSON.parse(settings);
        this.defaultTimerMinutes = defaultTimerMinutes ?? 30;
        this.defaultAlertDuration = defaultAlertDuration ?? 5;
        this.beforeAlert = beforeAlert ?? { ...DEFAULT_ALERTS.before };
        this.endAlert = endAlert ?? { ...DEFAULT_ALERTS.end };
        this.afterAlert = afterAlert ?? { ...DEFAULT_ALERTS.after };
      }
    } catch (error) {
      console.error('[SettingsManager] ❌ Erreur lors du chargement des paramètres:', error);
    }
  }

  private saveSettings() {
    try {
      const settings = {
        defaultTimerMinutes: this.defaultTimerMinutes,
        defaultAlertDuration: this.defaultAlertDuration,
        beforeAlert: this.beforeAlert,
        endAlert: this.endAlert,
        afterAlert: this.afterAlert,
      };
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('[SettingsManager] ❌ Erreur lors de la sauvegarde des paramètres:', error);
    }
  }

  // Nettoyage
  dispose() {
    console.log('[SettingsManager] 🧹 Nettoyage des ressources');
    this.listeners.clear();
  }
} 