import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/helpers';

const ToastContext = React.createContext(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((options) => {
    if (typeof options === 'string') {
      return addToast({ message: options, variant: 'default' });
    }
    return addToast(options);
  }, [addToast]);

  toast.success = React.useCallback((message, options = {}) => {
    return addToast({ message, variant: 'success', ...options });
  }, [addToast]);

  toast.error = React.useCallback((message, options = {}) => {
    return addToast({ message, variant: 'error', ...options });
  }, [addToast]);

  toast.warning = React.useCallback((message, options = {}) => {
    return addToast({ message, variant: 'warning', ...options });
  }, [addToast]);

  toast.info = React.useCallback((message, options = {}) => {
    return addToast({ message, variant: 'info', ...options });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const variants = {
    default: {
      bg: 'bg-background border-border',
      icon: <Info className="w-5 h-5 text-primary" />
    },
    success: {
      bg: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
    },
    error: {
      bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    }
  };

  const variant = variants[toast.variant] || variants.default;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in',
        variant.bg
      )}
    >
      {variant.icon}
      <div className="flex-1">
        {toast.title && (
          <h4 className="font-semibold text-sm mb-1">{toast.title}</h4>
        )}
        <p className="text-sm">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export { Toast, ToastContainer };
