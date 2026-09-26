import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '420px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none',
        }}
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const typeStyles = {
            success: { border: '1px solid #10b981', bg: '#061c14', text: '#34d399', icon: '✓' },
            error: { border: '1px solid #ef4444', bg: '#200b0f', text: '#f87171', icon: '✕' },
            warning: { border: '1px solid #f59e0b', bg: '#221504', text: '#fbbf24', icon: '⚠' },
            info: { border: '1px solid #fee500', bg: '#171603', text: '#fee500', icon: '⚡' },
          }[toast.type] || { border: '1px solid #fee500', bg: '#171603', text: '#fee500', icon: '⚡' };

          return (
            <div
              key={toast.id}
              className="toast-item"
              style={{
                pointerEvents: 'auto',
                padding: '12px 16px',
                background: typeStyles.bg,
                border: typeStyles.border,
                borderRadius: '6px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(254, 229, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                animation: 'slideUp 200ms ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    color: typeStyles.text,
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                  }}
                >
                  {typeStyles.icon}
                </span>
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  lineHeight: 1,
                  padding: '2px',
                }}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
