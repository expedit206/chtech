import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAlertStore = defineStore('alert', () => {
    const isVisible = ref(false);
    const message = ref('');
    const title = ref('');
    const type = ref('info'); // info, success, warning, error
    const confirmText = ref('OK');
    const cancelText = ref('Annuler');
    const onConfirm = ref(null);
    const onCancel = ref(null);
    const showCancel = ref(false);

    function showAlert(options) {
        title.value = options.title || 'Notification';
        message.value = options.message || '';
        type.value = options.type || 'info';
        confirmText.value = options.confirmText || 'OK';
        cancelText.value = options.cancelText || 'Annuler';
        showCancel.value = options.showCancel || false;
        onConfirm.value = options.onConfirm || null;
        onCancel.value = options.onCancel || null;
        isVisible.value = true;
    }

    function close() {
        isVisible.value = false;
    }

    function confirm() {
        if (onConfirm.value) onConfirm.value();
        close();
    }

    function cancel() {
        if (onCancel.value) onCancel.value();
        close();
    }

    return {
        isVisible,
        message,
        title,
        type,
        confirmText,
        cancelText,
        showCancel,
        showAlert,
        close,
        confirm,
        cancel
    };
});
