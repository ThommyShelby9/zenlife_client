import { precacheAndRoute } from 'workbox-precaching';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

// Créer un plugin de synchronisation en arrière-plan
const bgSyncPlugin = new BackgroundSyncPlugin('zenlife-sync-queue', {
  maxRetentionTime: 24 * 60 // Réessayer pendant 24 heures (en minutes)
});

// Enregistrer une route pour capturer les requêtes POST/PUT/DELETE échouées
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);
