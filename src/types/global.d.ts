import type React from 'react';

export interface ToastPromiseReturn {
    success: (message?: string, props?: ToastOptions) => number;
    error: (message?: string, props?: ToastOptions) => void;
}
export interface PopupWarningOptions {
    message: string | React.ReactNode;
    next?: () => void;
    accecpt?: () => void;
    cancel?: () => void;
    accecptM?: string;
    cancelM?: string;
}
