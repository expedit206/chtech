import { useAlertStore } from '../stores/alert';

export function useAlert() {
  const alertStore = useAlertStore();

  const success = (options) => {
    alertStore.showAlert({ ...options, type: 'success', title: options.title || 'Succès' });
  };

  const error = (options) => {
    alertStore.showAlert({ ...options, type: 'error', title: options.title || 'Erreur' });
  };

  const warning = (options) => {
    alertStore.showAlert({ ...options, type: 'warning', title: options.title || 'Attention' });
  };

  const info = (options) => {
    alertStore.showAlert({ ...options, type: 'info', title: options.title || 'Info' });
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

  return {
    success,
    error,
    warning,
    info,
    confirm,
    close: alertStore.close
  };
}
