import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-[calc(100vw-40px)] w-80">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            relative overflow-hidden group
                            px-4 py-3.5 rounded-2xl shadow-2xl border
                            flex items-center gap-3
                            animate-slide-in backdrop-blur-xl transition-all duration-300
                            ${toast.type === 'success' 
                                ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                                : toast.type === 'error'
                                    ? 'bg-rose-500/15 border-rose-500/20 text-rose-400'
                                    : 'bg-zinc-800/80 border-white/10 text-white'
                            }
                        `}
                    >
                        {/* Status Icon */}
                        <div className={`
                            w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                            ${toast.type === 'success' 
                                ? 'bg-emerald-500/20 text-emerald-500' 
                                : toast.type === 'error'
                                    ? 'bg-rose-500/20 text-rose-500'
                                    : 'bg-zinc-700 text-zinc-400'
                            }
                        `}>
                            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-tight truncate-multiline">
                                {toast.message }
                            </p>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Progress Bar Animation */}
                        <div className={`
                            absolute bottom-0 left-0 h-0.5 animate-toast-progress
                            ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'}
                        `} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useCustomToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useCustomToast must be used within a ToastProvider');
    }
    return context.showToast;
};
