import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import router from '@/router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();

// Création de l'instance Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Compteur pour les tentatives de requête
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];
let isRefreshing = false;

// Fonction pour traiter la file d'attente des requêtes échouées
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;

    // Si pas de réponse, c'est une erreur réseau
    if (!response) {
      toast.error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
      return Promise.reject(error);
    }

    const { status } = response;
    const originalRequest = config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Gestion spécifique des erreurs d'authentification
    if (status === 401) {
      // Si la requête tente de sauvegarder un planner, n'effaçons pas le token immédiatement
      if (originalRequest.url?.includes('/planner/save')) {
        // Informer l'utilisateur du problème d'authentification sans le déconnecter
        toast.warning("Problème d'authentification temporaire. Veuillez réessayer dans quelques instants.");
        return Promise.reject(error);
      }

      // Pour les autres requêtes 401, on peut implémenter un refresh token
      // si le backend le supporte

      // Exemple de refresh token (à adapter selon votre backend)
      const authStore = useAuthStore();

      if (!originalRequest._retry) {
        // Si nous sommes déjà en train de rafraîchir le token
        if (isRefreshing) {
          // Mettre la requête en file d'attente
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        // Marquer la requête comme ayant été tentée une fois
        originalRequest._retry = true;
        isRefreshing = true;

        // Ici vous pourriez implémenter l'appel pour rafraîchir le token
        // Exemple:
        /*
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await apiClient.post('/auth/refresh-token', { refreshToken });
            if (response.data.token) {
              authStore.setToken(response.data.token);

              // Traiter la file d'attente
              processQueue(null, response.data.token);

              // Répéter la requête d'origine avec le nouveau token
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshError) {
          // Le rafraîchissement a échoué, traiter la file d'attente avec l'erreur
          processQueue(refreshError as AxiosError);

          // Déconnexion en dernier recours
          authStore.logout();
          router.push('/auth/login');
          toast.error('Votre session a expiré, veuillez vous reconnecter.');

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
        */

        // Si pas de refresh token, déconnecter plus doucement
        toast.error('Votre session a expiré, veuillez vous reconnecter.');

        // Pour éviter une redirection immédiate et permettre à l'utilisateur
        // de voir la notification, utilisons un délai
        setTimeout(() => {
          authStore.logout();
          router.push('/auth/login');
        }, 2000);
      }
    }

    // Handle 403 Forbidden - User doesn't have permission
    if (status === 403) {
      toast.error('Vous n\'avez pas la permission d\'effectuer cette action.');
    }

    // Handle 404 Not Found
    if (status === 404) {
      console.log('La ressource demandée n\'existe pas.');

    }

    // Handle 500 Server Error
    if (status >= 500) {
      toast.error('Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
