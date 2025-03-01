<template>
  <div class="h-full">
    <div v-if="!processedData || processedData.length === 0 || !hasDataToDisplay" class="flex items-center justify-center h-full">
      <p class="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
    </div>
    <div v-else class="h-full">
      <Bar :data="chartData" :options="chartOptions" :key="chartKey" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'vue-chartjs';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define props
const props = defineProps<{
  data: Array<{
    day: string;
    date: string;
    intake: number;
    goal: number;
    percentage: number;
  }>;
}>();

// Chart reactive state
const chartKey = ref(0);

// Traiter les données pour s'assurer qu'elles sont valides
const processedData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    console.warn('Données non valides ou non définies:', props.data);
    return [];
  }

  return props.data.map(item => {
    // S'assurer que chaque élément a les propriétés requises avec des valeurs par défaut
    return {
      day: item?.day || 'Inconnu',
      date: item?.date || '',
      intake: typeof item?.intake === 'number' ? item.intake : 0,
      goal: typeof item?.goal === 'number' && item.goal > 0 ? item.goal : 2000,
      percentage: typeof item?.percentage === 'number' ? item.percentage : 0
    };
  });
});

// Vérifier s'il y a des données à afficher
const hasDataToDisplay = computed(() => {
  // Vérifier que les données traitées contiennent au moins une entrée avec une consommation > 0
  return processedData.value.some(item => item.intake > 0);
});

// Chart data
const chartData = computed(() => {
  // Utiliser les données traitées
  return {
    labels: processedData.value.map(item => item.day),
    datasets: [
      {
        label: 'Consommation (ml)',
        data: processedData.value.map(item => item.intake),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Objectif (ml)',
        data: processedData.value.map(item => item.goal),
        backgroundColor: 'rgba(209, 213, 219, 0.3)', // Light gray
        borderColor: 'rgba(209, 213, 219, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5]
      }
    ]
  };
});

// Chart options
const chartOptions = computed(() => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: function(tickValue: string | number) {
            const value = Number(tickValue);
            if (value >= 1000) {
              return (value / 1000) + 'L';
            }
            return value + 'ml';
          }
        }
      },
      x: {
        type: 'category' as const,
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} ml`;
          },
          afterLabel: function(context: any) {
            if (context.datasetIndex === 0) {
              const dayIndex = context.dataIndex;
              if (processedData.value[dayIndex]) {
                const percentage = processedData.value[dayIndex].percentage;
                return `Objectif atteint: ${percentage.toFixed(1)}%`;
              }
            }
            return '';
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  };
});

// Theme change watcher
const updateChartOnThemeChange = () => {
  // Force chart update by incrementing the key to re-render component
  chartKey.value++;
};

// Watch for theme changes
const observer = new MutationObserver(() => {
  updateChartOnThemeChange();
});

onMounted(() => {
  console.log('WeeklyIntakeChart monté avec données brutes:', props.data);
  console.log('WeeklyIntakeChart données traitées:', processedData.value);
  console.log('WeeklyIntakeChart a des données à afficher:', hasDataToDisplay.value);

  // Observe dark mode changes through the <html> element's class list
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

// Clean up observer on component unmount
onUnmounted(() => {
  observer.disconnect();
});

// Watch for data changes
watch(() => props.data, (newData) => {
  console.log('Données du graphique mises à jour:', newData);
  console.log('Affichage des données:', hasDataToDisplay.value);
  // Force chart update by incrementing the key
  chartKey.value++;
}, { deep: true });
</script>
