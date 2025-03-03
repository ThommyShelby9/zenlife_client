<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div v-if="showInstallButton" class="fixed bottom-4 right-4 z-50">
    <button
      @click="installPWA"
      class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
    >
      <span>Installer ZenLife</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';

// Étendre l'interface Window pour inclure MSStream
interface ExtendedWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MSStream?: any;
}

// Étendre Navigator pour Safari standalone
interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

// Casting de window pour utiliser notre interface étendue
const extWindow = window as ExtendedWindow;

const showInstallButton = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deferredPrompt = ref<any>(null);

onMounted(() => {
  const handleBeforeInstallPrompt = (e: Event) => {
    // Empêcher le navigateur d'afficher son propre prompt
    e.preventDefault();
    // Stocker l'événement pour pouvoir le déclencher plus tard
    deferredPrompt.value = e;
    // Afficher notre bouton d'installation personnalisé
    showInstallButton.value = true;
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

  // Vérifier si nous sommes sur iOS (méthode sécurisée en TypeScript)
  const isIOS = detectIOS();
  const safariNavigator = window.navigator as SafariNavigator;
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                            safariNavigator.standalone;

  // Sur iOS, nous montrons toujours le bouton car il n'y a pas d'événement beforeinstallprompt
  if (isIOS && !isInStandaloneMode) {
    showInstallButton.value = true;
  }

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
  });
});

// Fonction de détection iOS plus sûre avec TypeScript
function detectIOS(): boolean {
  const userAgent = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(userAgent) &&
         !(extWindow.MSStream); // utilise notre window étendu
}

const installPWA = async () => {
  if (deferredPrompt.value) {
    // Pour les navigateurs basés sur Chromium
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'declined'} the install prompt`);
    deferredPrompt.value = null;
    showInstallButton.value = false;
  } else {
    // Pour Safari iOS
    const isIOS = detectIOS();
    if (isIOS) {
      // Utiliser SweetAlert2 pour une alerte plus jolie
      await Swal.fire({
        title: 'Installer ZenLife',
        html: `
          <div class="text-left">
            <p>Pour installer ZenLife sur votre appareil :</p>
            <ol class="mt-4 ml-5 list-decimal">
              <li class="mb-2">Appuyez sur le bouton <strong>Partager</strong> <span class="text-blue-500">⬆️</span> en bas de l'écran</li>
              <li class="mb-2">Faites défiler et choisissez <strong>"Sur l'écran d'accueil"</strong></li>
              <li class="mb-2">Appuyez sur <strong>Ajouter</strong> en haut à droite</li>
            </ol>
          </div>
        `,
        imageUrl: 'img/ios-install-guide.png', // Ajoutez une image d'instruction si disponible
        imageAlt: 'Guide d\'installation iOS',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#4f46e5',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      });
    } else {
      // Pour autres navigateurs où le prompt n'est pas disponible
      await Swal.fire({
        title: 'Installer ZenLife',
        text: 'Recherchez l\'icône d\'installation dans la barre d\'adresse ou le menu de votre navigateur.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5'
      });
    }
  }
};
</script>
