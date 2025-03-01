// src/utils/WaterIntakeUtil.ts

/**
 * Utilitaire pour gérer les données d'hydratation et résoudre les problèmes de compatibilité
 */
export class WaterIntakeUtil {
  /**
   * Normalise un objet WaterIntake pour assurer la compatibilité
   * @param intake Objet WaterIntake venant du backend
   * @returns Objet WaterIntake normalisé
   */
  static normalizeIntake(intake: any): any {
    if (!intake) return null;

    // Copier l'objet pour ne pas modifier l'original
    const normalizedIntake = { ...intake };

    // Si timestamp n'existe pas mais intakeTime existe, utiliser intakeTime
    if (!normalizedIntake.timestamp && normalizedIntake.intakeTime) {
      normalizedIntake.timestamp = normalizedIntake.intakeTime;
    }

    // Normaliser la date si elle est présente
    if (normalizedIntake.timestamp) {
      try {
        // S'assurer que la date est au bon format
        const date = new Date(normalizedIntake.timestamp);
        if (!isNaN(date.getTime())) {
          normalizedIntake.timestamp = date.toISOString();
        }
      } catch (error) {
        console.warn('Erreur lors de la normalisation de la date:', error);
      }
    }

    return normalizedIntake;
  }

  /**
   * Vérifie si une date est aujourd'hui
   * @param dateString Chaîne de date à vérifier
   * @returns true si la date est aujourd'hui
   */
  static isToday(dateString: string): boolean {
    if (!dateString) return false;

    try {
      const inputDate = new Date(dateString);
      if (isNaN(inputDate.getTime())) return false;

      const today = new Date();
      return (
        inputDate.getDate() === today.getDate() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getFullYear() === today.getFullYear()
      );
    } catch (error) {
      console.warn('Erreur lors de la vérification de la date:', error);
      return false;
    }
  }

  /**
   * Formate une date au format YYYY-MM-DD
   * @param date Date à formater
   * @returns Chaîne au format YYYY-MM-DD
   */
  static formatDateYYYYMMDD(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Convertit une chaîne de date en objet Date sécurisé
   * @param dateString Chaîne de date à convertir
   * @param fallback Valeur à retourner en cas d'erreur
   * @returns Objet Date ou fallback en cas d'erreur
   */
  static safeParseDate(dateString: string, fallback: Date = new Date()): Date {
    if (!dateString) return fallback;

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? fallback : date;
    } catch (error) {
      console.warn('Erreur lors de la conversion de la date:', error);
      return fallback;
    }
  }
}
