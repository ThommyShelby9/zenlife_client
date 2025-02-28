declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }

// Dans un fichier .d.ts
declare module '@heroicons/vue/outline';
declare module '@headlessui/vue'
