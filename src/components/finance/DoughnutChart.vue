<template>
  <div class="h-full">
    <div v-if="!data || data.length === 0" class="flex items-center justify-center h-full">
      <p class="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
    </div>
    <div v-else class="h-full">
      <Doughnut :data="chartData" :options="chartOptions" :key="chartKey" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define props
const props = defineProps<{
  data: number[];
  colors: string[];
  labels: string[];
}>();

// Chart reactive key for forcing re-renders
const chartKey = ref(0);

// Chart data
const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        data: props.data,
        backgroundColor: props.colors,
        hoverBackgroundColor: props.colors.map(color => {
          // Lighten the color for hover effect
          return color.startsWith('#')
            ? color + 'CC' // Add some transparency
            : color; // Keep as is if it's not a hex color
        }),
        borderWidth: 0
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
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);

            return `${label}: ${value.toLocaleString('fr-FR')} € (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };
});

// Theme change watcher
const updateChartOnThemeChange = () => {
  // Force chart update by incrementing key
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
watch(() => [props.data, props.colors, props.labels], () => {
  // Force chart update by incrementing key
  chartKey.value++;
}, { deep: true });
</script>
