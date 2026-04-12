import { useToast } from 'vue-toastification';

export function useFlash() {
  const toast = useToast();

  const success = (message, options = {}) => {
    toast.success(message, {
      timeout: options.timeout || 3000,
      ...options
    });
  };

  const error = (message, options = {}) => {
    toast.error(message, {
      timeout: options.timeout || 5000, // Les erreurs restent un peu plus longtemps
      ...options
    });
  };

  const info = (message, options = {}) => {
    toast.info(message, {
      ...options
    });
  };

  const warning = (message, options = {}) => {
    toast.warning(message, {
      ...options
    });
  };

  return {
    success,
    error,
    info,
    warning
  };
}
