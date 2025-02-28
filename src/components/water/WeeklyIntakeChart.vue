<template>
  <div class="h-full">
    <div v-if="!data || data.length === 0" class="flex items-center justify-center h-full">
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

// Chart data
const chartData = computed(() => {
  return {
    labels: props.data.map(item => item.day),
    datasets: [
      {
        label: 'Consommation (ml)',
        data: props.data.map(item => item.intake),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Objectif (ml)',
        data: props.data.map(item => item.goal),
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
              const percentage = props.data[dayIndex].percentage;
              return `Objectif atteint: ${percentage.toFixed(1)}%`;
            }
            return '';
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const // Spécifier comme valeur constante parmi les options valides
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
watch(() => props.data, () => {
  // Force chart update by incrementing the key
  chartKey.value++;
}, { deep: true });
</script>
