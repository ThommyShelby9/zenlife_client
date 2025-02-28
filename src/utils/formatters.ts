import { format, formatDistance, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ref } from 'vue';

/**
 * Format date as day month year
 */
// Fonction améliorée de formatage de date
export const formatDate = (date: string | Date | number[], pattern = 'dd MMM yyyy'): string => {
  try {
    let dateObj: Date;

    if (Array.isArray(date)) {
      // Format [année, mois, jour]
      const [year, month, day] = date;
      dateObj = new Date(year, month - 1, day); // Ajustez l'index du mois
    } else if (typeof date === 'string') {
      // Essayer de parser une chaîne
      dateObj = new Date(date);
    } else {
      // Objet Date
      dateObj = date;
    }

    return format(dateObj, pattern, { locale: fr });
  } catch (error) {
    console.error('Date format error:', error);
    return String(date);
  }
};

/**
 * Format time as hours:minutes
 */
export const formatTime = (date: string | Date, pattern = 'HH:mm'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern, { locale: fr });
  } catch (error) {
    console.error('Time format error:', error);
    return String(date);
  }
};

/**
 * Format date as day name (Monday, Tuesday, etc.)
 */
export const formatDayName = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'EEEE', { locale: fr });
  } catch (error) {
    console.error('Day name format error:', error);
    return String(date);
  }
};

/**
 * Format date as month name and year (January 2023, etc.)
 */
export const formatMonthYear = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error('Month year format error:', error);
    return String(date);
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  const currencyPreference = ref(localStorage.getItem('userCurrency') || 'EUR');

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyPreference.value,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimalPlaces = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Format relative time (e.g. "il y a 5 minutes", "dans 3 jours")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: fr
    });
  } catch (error) {
    console.error('Relative time format error:', error);
    return String(date);
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * Format duration in seconds to minutes:seconds
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
