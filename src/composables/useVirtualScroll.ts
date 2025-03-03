// src/composables/useVirtualScroll.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useVirtualScroll<T>(items: T[], options = { itemHeight: 50, buffer: 5 }) {
  const containerRef = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const viewportHeight = ref(0);

  const visibleItems = computed(() => {
    if (!containerRef.value) return [];

    const start = Math.floor(scrollTop.value / options.itemHeight) - options.buffer;
    const end = Math.ceil((scrollTop.value + viewportHeight.value) / options.itemHeight) + options.buffer;

    const startIndex = Math.max(0, start);
    const endIndex = Math.min(items.length - 1, end);

    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute',
        top: `${(startIndex + index) * options.itemHeight}px`,
        height: `${options.itemHeight}px`,
        width: '100%'
      }
    }));
  });

  const totalHeight = computed(() => items.length * options.itemHeight);

  const handleScroll = () => {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop;
    }
  };

  const updateViewportHeight = () => {
    if (containerRef.value) {
      viewportHeight.value = containerRef.value.clientHeight;
    }
  };

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', updateViewportHeight);
      updateViewportHeight();
    }
  });

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateViewportHeight);
    }
  });

  return {
    containerRef,
    visibleItems,
    totalHeight
  };
}
