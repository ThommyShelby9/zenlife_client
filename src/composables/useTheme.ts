// src/composables/useTheme.ts
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';

interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  isDark: boolean;
}

export function useTheme() {
  const userStore = useUserStore();
  const currentTheme = ref<string>(userStore.user?.themePreference || 'light');

  const themes: Record<string, ThemeOption> = {
    light: {
      id: 'light',
      name: 'Clair',
      colors: {
        primary: '#4f46e5',
        secondary: '#10b981',
        accent: '#f97316',
        background: '#ffffff',
        text: '#111827'
      },
      isDark: false
    },
    dark: {
      id: 'dark',
      name: 'Sombre',
      colors: {
        primary: '#6366f1',
        secondary: '#14b8a6',
        accent: '#f97316',
        background: '#111827',
        text: '#f9fafb'
      },
      isDark: true
    },
    // Add more themes
  };

  const applyTheme = (themeId: string) => {
    const theme = themes[themeId] || themes.light;

    // Apply CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply dark mode class
    if (theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save preference
    currentTheme.value = themeId;
    if (userStore.user) {
      userStore.updateThemePreference(themeId);
    } else {
      localStorage.setItem('theme', themeId);
    }
  };

  // Initialize theme
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme);
  }, { immediate: true });

  return {
    currentTheme,
    themes: Object.values(themes),
    applyTheme
  };
}
