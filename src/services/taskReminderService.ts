// src/services/taskReminderService.ts
import { useNotificationStore } from '@/stores/notification';
import { usePlannerStore } from '@/stores/planner';
import type { PlannerTask } from '@/types/planner';
import type { NotificationPayload } from '@/types/notification';

export class TaskReminderService {
  private static instance: TaskReminderService;
  private intervalId: number | null = null;
  private notifiedTasks: Map<string, Set<number>> = new Map(); // Map pour suivre les tâches déjà notifiées
  private checkInterval = 60000; // Vérifier toutes les minutes (60000 ms)
  private reminderTimes = [20, 15, 10, 5]; // Minutes avant l'échéance pour les rappels

  private constructor() {}

  public static getInstance(): TaskReminderService {
    if (!TaskReminderService.instance) {
      TaskReminderService.instance = new TaskReminderService();
    }
    return TaskReminderService.instance;
  }

  /**
   * Démarrer le service de rappel des tâches
   */
  public start(): void {
    if (this.intervalId !== null) {
      console.warn('Le service de rappel des tâches est déjà en cours d\'exécution');
      return;
    }

    console.log('Démarrage du service de rappel des tâches');

    // Vérifier immédiatement les tâches du jour
    this.checkTasks();

    // Puis vérifier périodiquement
    this.intervalId = window.setInterval(() => {
      this.checkTasks();
    }, this.checkInterval);
  }

  /**
   * Arrêter le service de rappel des tâches
   */
  public stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Service de rappel des tâches arrêté');
    }
  }

  /**
   * Vérifier les tâches pour les rappels
   */
  private async checkTasks(): Promise<void> {
    const plannerStore = usePlannerStore();
    const notificationStore = useNotificationStore();

    try {
      // S'assurer que nous avons le planificateur du jour
      if (!plannerStore.todayPlanner) {
        await plannerStore.getTodayPlanner();
      }

      const tasks = plannerStore.todayPlanner?.tasks || [];

      console.log(`Vérification de ${tasks.length} tâches pour rappels`, tasks);

      if (tasks.length === 0) {
        console.log("Aucune tâche trouvée pour aujourd'hui");
        return;
      }

      // Vérifier chaque tâche
      tasks.forEach((task: PlannerTask) => {
        // Ignorer les tâches déjà terminées ou sans heure d'échéance
        if (task.completed || !task.dueTime) {
          console.log(`Tâche ignorée - ${task.id} - ${task.title} - Terminée: ${task.completed} - Échéance: ${task.dueTime || 'non définie'}`);
          return;
        }

        // Convertir l'heure d'échéance en objet Date
        const [hours, minutes] = task.dueTime.split(':').map(Number);
        const dueDate = new Date();
        dueDate.setHours(hours, minutes, 0, 0);

        // Calculer la différence en minutes
        const now = new Date();
        const diffMs = dueDate.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        console.log(`Tâche: ${task.title} - Échéance: ${task.dueTime} - Minutes restantes: ${diffMinutes}`);

        // Si la tâche est déjà en retard, pas besoin de notification
        if (diffMinutes < 0) {
          console.log(`Tâche en retard - ${task.title}`);
          return;
        }

        // NOUVELLE LOGIQUE : Rappel spécial pour les tâches très proches de l'échéance (≤ 3 minutes)
        if (diffMinutes <= 3 && diffMinutes > 0) {
          // Vérifier si on a déjà notifié pour "dernière minute"
          this.sendLastMinuteReminder(task, diffMinutes, notificationStore);
          return; // Sortir après avoir envoyé ce rappel spécial
        }

        // Vérification standard pour les autres temps de rappel
        this.reminderTimes.forEach(time => {
          // Vérifier si nous sommes entre time et time-1 minutes avant l'échéance
          if (diffMinutes <= time && diffMinutes > time - 1) {
            console.log(`Envoi d'une notification pour ${task.title} (${diffMinutes} minutes restantes)`);
            this.sendTaskReminder(task, time, notificationStore);
          }
        });
      });
    } catch (error) {
      console.error('Erreur lors de la vérification des tâches pour les rappels:', error);
    }
  }

  private sendLastMinuteReminder(task: PlannerTask, minutesLeft: number, notificationStore: any): void {
    // Vérifier si la tâche a un ID valide
    if (!task.id) {
      console.error('Impossible d\'envoyer un rappel pour une tâche sans ID');
      return;
    }

    console.log(`Préparation du rappel URGENT pour la tâche ${task.id} - ${task.title} (${minutesLeft} min)`);

    // Créer une clé spéciale pour ce type de rappel
    const lastMinuteKey = "last_minute";

    // Vérifier si cette notification a déjà été envoyée
    if (!this.notifiedTasks.has(task.id)) {
      this.notifiedTasks.set(task.id, new Set());
    }

    const taskNotifications = this.notifiedTasks.get(task.id)!;

    // Si déjà notifié pour dernière minute, ne pas renvoyer
    if (taskNotifications.has(-1)) { // Utilisation de -1 comme marqueur spécial
      console.log(`Rappel de dernière minute déjà envoyé pour la tâche ${task.id}`);
      return;
    }

    // Message adapté au temps restant
    let message = '';
    if (minutesLeft === 1) {
      message = `URGENT: "${task.title}" - Il ne reste plus qu'1 minute avant l'échéance !`;
    } else {
      message = `URGENT: "${task.title}" - Il ne reste plus que ${minutesLeft} minutes avant l'échéance !`;
    }

    // Créer la notification avec priorité différente
    const notification: NotificationPayload = {
      type: 'warning', // Utiliser warning au lieu de reminder pour un style différent
      content: message,
      link: '/planner/today'
    };

    console.log(`Envoi de la notification URGENTE:`, notification);

    // Envoyer la notification
    notificationStore.createNotification(notification)
      .then(() => {
        console.log(`🚨 Notification URGENTE envoyée avec succès pour ${task.title}`);
        // Marquer comme notifiée avec un marqueur spécial
        taskNotifications.add(-1);
      })
      .catch((error: unknown) => {
        console.error(`❌ Erreur lors de la création de la notification URGENTE pour ${task.title}:`, error);
      });
  }

  /**
   * Envoyer un rappel pour une tâche
   */
  private sendTaskReminder(task: PlannerTask, minutesLeft: number, notificationStore: any): void {
    // Vérifier si la tâche a un ID valide
    if (!task.id) {
      console.error('Impossible d\'envoyer un rappel pour une tâche sans ID');
      return;
    }

    console.log(`Préparation du rappel pour la tâche ${task.id} - ${task.title} (${minutesLeft} min)`);

    // Vérifier si cette notification a déjà été envoyée
    if (!this.notifiedTasks.has(task.id)) {
      this.notifiedTasks.set(task.id, new Set());
      console.log(`Nouvelle entrée créée pour les rappels de la tâche ${task.id}`);
    }

    const taskNotifications = this.notifiedTasks.get(task.id)!;

    // Si déjà notifié pour ce temps, ne pas renvoyer
    if (taskNotifications.has(minutesLeft)) {
      console.log(`Rappel déjà envoyé pour la tâche ${task.id} à ${minutesLeft} minutes`);
      return;
    }

    // Créer la notification
    const notification: NotificationPayload = {
      type: 'reminder',
      content: `Rappel: "${task.title}" - Il vous reste ${minutesLeft} minutes avant l'échéance`,
      link: '/planner/today' // Lien vers le planificateur du jour
    };

    console.log(`Envoi de la notification:`, notification);

    // Envoyer la notification
    notificationStore.createNotification(notification)
    .then(() => {
      console.log(`✅ Notification de rappel envoyée avec succès pour ${task.title}`);
      // Marquer comme notifiée seulement après le succès
      taskNotifications.add(minutesLeft);
    })
    .catch((error: unknown) => {
      // TypeScript exige que nous typions l'erreur comme unknown
      console.error(`❌ Erreur lors de la création de la notification de rappel pour ${task.title}:`, error);
      // On peut ajouter des vérifications de type si nécessaire
      if (error instanceof Error) {
        console.error("Message d'erreur:", error.message);
      }
    });
  }
  /**
   * Vérifier immédiatement les tâches (utile pour les tests)
   */
  public checkTasksNow(): void {
    this.checkTasks();
  }
}

export default TaskReminderService.getInstance();
