import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import './assets/css/index.css';
import Toast, { POSITION, type PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
// Dans main.ts
import { initServiceWorker } from './registerServiceWorker';
import 'animate.css';
import './firebase/config'; // Cette ligne importe et initialise Firebase

// Toast options
const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker enregistré avec succès:', registration);
    })
    .catch(error => {
      console.error('Erreur lors de l"enregistrement du Service Worker:', error);
    });
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, toastOptions);

app.mount('#app');
initServiceWorker();

