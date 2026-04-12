import { useAlertStore } from '../stores/alert';
import { useFlash } from './useFlash';

export function useAlert() {
  const alertStore = useAlertStore();
  const flash = useFlash();

  const success = (options) => {
    // Si c'est juste un string, l'encapsuler (fallback)
    const message = typeof options === 'string' ? options : options.message;
    flash.success(message);
  };

  const error = (options) => {
    const message = typeof options === 'string' ? options : options.message;
    flash.error(message);
  };

  const warning = (options) => {
    const message = typeof options === 'string' ? options : options.message;
    flash.warning(message);
  };

  const info = (options) => {
    const message = typeof options === 'string' ? options : options.message;
    flash.info(message);
  };

  const confirm = (options) => {
    alertStore.showAlert({ 
      ...options, 
      type: 'warning', 
      showCancel: true,
      title: options.title || 'Confirmation',
      confirmText: options.confirmText || 'Confirmer',
      cancelText: options.cancelText || 'Annuler'
    });
  };

  const promptLogin = (router, redirectPath = null) => {
    alertStore.showAlert({
      title: 'Accès Restreint',
      message: 'Vous devez être connecté pour accéder à cette fonctionnalité.',
      type: 'warning',
      showCancel: true,
      confirmText: 'Se connecter',
      cancelText: 'Annuler',
      onConfirm: () => {
        router.push({
          name: 'Login',
          query: redirectPath ? { redirect: redirectPath } : {}
        });
      }
    });
  };

  return {
    success,
    error,
    warning,
    info,
    confirm,
    promptLogin,
    close: alertStore.close
  };
}
