
import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-success' : 'bg-error';
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    return (
        <div className={`fixed bottom-5 right-5 flex items-center gap-3 p-4 rounded-lg text-white shadow-lg z-[1000] animate-slideInRight ${bgColor}`}>
            <i className={`fas ${iconClass}`}></i>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
