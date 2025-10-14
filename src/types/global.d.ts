export interface ToastPromiseReturn {
    success: (message?: string, props?: ToastOptions) => number;
    error: (message?: string, props?: ToastOptions) => void;
}
export interface PopupWarningOptions {
    message: string;
    next?: () => void;
    accecpt?: () => void;
    cancel?: () => void;
    accecptM?: string;
    cancelM?: string;
}
