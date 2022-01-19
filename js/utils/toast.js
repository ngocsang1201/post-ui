import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#4caf50',
      },
    }).showToast()
  },

  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#03a9f4',
      },
    }).showToast()
  },

  warning(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#ff9800',
      },
    }).showToast()
  },

  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#ef5350',
      },
    }).showToast()
  },
}
