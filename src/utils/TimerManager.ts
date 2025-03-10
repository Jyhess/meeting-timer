import { Alert, TimerState } from '../types/timer';
import { SettingsManager } from './SettingsManager';

type TimerEventType = 'stateChange' | 'timeChange' | 'alert' | 'alertChange';
type TimerEventListener = (data: any) => void;

export class TimerManager {
  private state: TimerState = 'idle';
  private timeLeft: number;
  private duration: number;
  private effectDuration: number;
  private startTime: number | null = null;
  private lastTick: number | null = null;
  private isManualStop: boolean = false;
  private listeners: Map<TimerEventType, Set<TimerEventListener>> = new Map();
  private timer: number | null = null;

  private beforeAlert: Alert;
  private endAlert: Alert;
  private afterAlert: Alert;

  constructor() {
    const settings = SettingsManager.getInstance();
    
    // Utiliser la durée par défaut des paramètres
    this.duration = settings.getDefaultTimerMinutes() * 60;
    this.timeLeft = this.duration;
    this.effectDuration = settings.getDefaultAlertDuration();
    // Initialiser les alertes avec les valeurs par défaut des paramètres
    this.beforeAlert = settings.getBeforeAlert();
    this.endAlert = settings.getEndAlert();
    this.afterAlert = settings.getAfterAlert();

    console.log(`[TimerManager] 🕒 Création avec durée: ${this.duration}s`);
  }

  // Getters pour les alertes
  getBeforeAlert(): Alert {
    return this.beforeAlert;
  }

  getEndAlert(): Alert {
    return this.endAlert;
  }

  getAfterAlert(): Alert {
    return this.afterAlert;
  }

  getEffectDuration(): number {
    return this.effectDuration;
  }

  // Mise à jour des alertes
  updateAlert(alert: Alert) {
    switch (alert.id) {
      case 'before':
        this.beforeAlert = alert;
        break;
      case 'end':
        this.endAlert = alert;
        break;
      case 'after':
        this.afterAlert = alert;
        break;
    }
    this.emit('alertChange', { id: alert.id, alert });
  }

  // Mise à jour de la configuration
  updateConfig(newDuration: number) {
    console.log(`[TimerManager] 🔄 Mise à jour de la configuration - nouvelle durée: ${newDuration}s`);
    const wasRunning = this.state === 'running';
    
    // Arrêt du timer si en cours
    if (wasRunning) {
      this.clearTimer();
    }

    // Mise à jour de la configuration
    this.duration = newDuration;

    // Mise à jour du temps restant si le timer n'est pas en cours
    if (!this.isRunning()) {
      this.timeLeft = newDuration;
      this.emit('timeChange', this.timeLeft);
    }

    // Redémarrage du timer si nécessaire
    if (wasRunning) {
      this.start();
    }
  }

  // Gestion des événements
  addEventListener(type: TimerEventType, listener: TimerEventListener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(listener);
  }

  removeEventListener(type: TimerEventType, listener: TimerEventListener) {
    this.listeners.get(type)?.delete(listener);
  }

  private emit(type: TimerEventType, data: any) {
    this.listeners.get(type)?.forEach(listener => listener(data));
  }

  // Getters
  getState(): TimerState {
    return this.state;
  }

  getTimeLeft(): number {
    return this.timeLeft;
  }

  isRunning(): boolean {
    return this.state !== 'idle' && this.state !== 'finished';
  }

  // Actions
  start() {
    console.log('[TimerManager] ▶️ Démarrage du timer');
    
    if (this.state === 'finished') {
      this.timeLeft = this.duration;
      this.state = 'idle';
      this.emit('stateChange', this.state);
      this.emit('timeChange', this.timeLeft);
    }

    if (this.state !== 'running') {
      console.log('[TimerManager] ▶️ Activation du timer');
      this.isManualStop = false;
      this.startTime = Date.now() - ((this.duration - this.timeLeft) * 1000);
      this.lastTick = Date.now();
      this.state = 'running';
      this.emit('stateChange', this.state);

      // Démarrer l'intervalle
      if (!this.timer) {
        this.timer = window.setInterval(() => { this.updateTimeLeft() }, 100);
      }
    }
  }

  pause() {
    console.log('[TimerManager] ⏸️ Mise en pause du timer');
    this.clearTimer();
    this.state = 'paused';
    this.emit('stateChange', this.state);
  }

  resume() {
    console.log('[TimerManager] ▶️ Reprise du timer');
    this.start();
  }

  reset() {
    console.log('[TimerManager] 🔄 Réinitialisation du timer');
    this.isManualStop = true;
    this.clearTimer();
    this.state = 'idle';
    this.timeLeft = this.duration;
    this.startTime = null;
    this.lastTick = null;
    this.emit('stateChange', this.state);
    this.emit('timeChange', this.timeLeft);
  }

  restart() {
    console.log('[TimerManager] 🔄 Redémarrage du timer');
    this.clearTimer();
    this.timeLeft = this.duration;
    this.startTime = Date.now();
    this.lastTick = Date.now();
    this.state = 'running';
    this.emit('stateChange', this.state);
    this.emit('timeChange', this.timeLeft);

    // Démarrer l'intervalle
    if (!this.timer) {
      this.timer = window.setInterval(() => { this.updateTimeLeft() }, 100);
    }
  }

  setTimeLeft(newTime: number) {
    console.log(`[TimerManager] ⌨️ Mise à jour manuelle: ${newTime}s`);
    this.timeLeft = newTime;
    this.emit('timeChange', this.timeLeft);
  }

  // Méthodes privées
  private clearTimer() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.startTime !== null) {
      this.startTime = null;
      this.lastTick = null;
    }
  }

  updateTimeLeft() {
    if (!this.startTime || !this.lastTick || this.state !== 'running') return;

    const now = Date.now();
    const elapsed = now - this.startTime;
    const newTimeLeft = this.duration - Math.floor(elapsed / 1000);

    if (newTimeLeft !== this.timeLeft) {
      console.log(`[TimerManager] 🕒 updateTimeLeft: ${elapsed} -> ${newTimeLeft}s`);
      this.timeLeft = newTimeLeft;
      this.lastTick = now;
      this.emit('timeChange', this.timeLeft);

      // Gestion des alertes
      if (this.state === 'running') {
        if (this.beforeAlert.enabled && newTimeLeft === this.beforeAlert.timeOffset * 60) {
          this.emit('alert', { type: 'before', sound: this.beforeAlert.sound });
        }
        if (this.endAlert.enabled && newTimeLeft === 0 && !this.isManualStop) {
          this.emit('alert', { type: 'end', sound: this.endAlert.sound });
        }
        if (this.afterAlert.enabled && newTimeLeft < 0 && Math.abs(newTimeLeft) === this.afterAlert.timeOffset * 60) {
          this.emit('alert', { type: 'after', sound: this.afterAlert.sound });
        }
      }
    }
  }

  // Nettoyage
  dispose() {
    console.log('[TimerManager] 🧹 Nettoyage des ressources');
    this.clearTimer();
    this.listeners.clear();
  }
} 