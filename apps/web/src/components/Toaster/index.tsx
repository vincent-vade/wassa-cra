import React, { useState, useEffect } from 'react';
import './toaster.css';

type ToastType = 'success' | 'error';

type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

let toastId = 0;
let addToast: (message: string, type: ToastType) => void;

export const Toaster = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    addToast = (message: string, type: ToastType) => {
        const id = toastId++;
        setToasts([...toasts, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000); // Remove toast after 3 seconds
    };

    const removeToast = (id: number) => {
        setToasts(toasts.filter(toast => toast.id !== id));
    };

    return (
        <div className="toaster-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

// Usage example
export const useToaster = () => {
    const [toaster, setToaster] = useState<() => void>(() => () => {});

    useEffect(() => {
        setToaster(() => (message: string, type: ToastType) => {
            const event = new CustomEvent('addToast', { detail: { message, type } });
            window.dispatchEvent(event);
        });
    }, []);

    useEffect(() => {
        const handleAddToast = (event: CustomEvent) => {
            const { message, type } = event.detail;
            addToast(message, type);
        };

        window.addEventListener('addToast', handleAddToast);
        return () => {
            window.removeEventListener('addToast', handleAddToast);
        };
    }, []);

    return toaster;
};