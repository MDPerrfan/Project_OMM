const listeners = new Set();

const emit = (type, message) => {
  const payload = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    message,
  };
  listeners.forEach((listener) => listener(payload));
};

export const toast = {
  success: (message) => emit("success", message),
  error: (message) => emit("error", message),
  warning: (message) => emit("warning", message),
  info: (message) => emit("info", message),
};

export const subscribeToToast = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

