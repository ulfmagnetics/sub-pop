import { ToastOptions } from 'vue3-toastify/index';
import { toast } from 'vue3-toastify';

const defaultToastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  closeButton: true,
  pauseOnHover: true,
};

export function displayToast(message: string) {
  toast(message, defaultToastOptions);
}
