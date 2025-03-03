<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="installPWA"
      class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
    >
      <span>Installer ZenLife</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';

interface ExtendedWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MSStream?: any;
}

// Fonction de détection iOS sécurisée
function detectIOS(): boolean {
  const userAgent = navigator.userAgent;
  const extWindow = window as ExtendedWindow;
  return /iPad|iPhone|iPod/.test(userAgent) && !extWindow.MSStream;
}

// Définir une interface pour le navigator de Safari qui inclut standalone
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

// Propriétés du composant
const props = defineProps({
  deferredPrompt: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Object as any,
    default: null
  }
});

// Émettre des événements
const emit = defineEmits(['close']);

// Fonction pour installer la PWA
const installPWA = async () => {
  console.log('installPWA called, deferredPrompt:', props.deferredPrompt);

  if (props.deferredPrompt) {
    // Pour les navigateurs basés sur Chromium
    props.deferredPrompt.prompt();
    const { outcome } = await props.deferredPrompt.userChoice;
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'declined'} the install prompt`);

    // Informer le parent que l'installation est terminée
    emit('close');
  } else {
    // Pour Safari iOS
    const isIOS = detectIOS();
    if (isIOS) {
      // Utiliser SweetAlert2 pour des instructions visuelles
      await Swal.fire({
        title: 'Installer ZenLife',
        html: `
          <div class="text-left">
            <p>Pour installer ZenLife sur votre appareil iOS :</p>
            <ol class="mt-4 ml-5 list-decimal">
              <li class="mb-2">Appuyez sur le bouton <strong>Partager</strong> <span class="text-blue-500">⬆️</span> en bas de l'écran</li>
              <li class="mb-2">Faites défiler et choisissez <strong>"Sur l'écran d'accueil"</strong></li>
              <li class="mb-2">Appuyez sur <strong>Ajouter</strong> en haut à droite</li>
            </ol>
          </div>
        `,
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
