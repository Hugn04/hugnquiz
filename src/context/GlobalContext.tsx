import { createContext } from 'react';
import type { ToastOptions } from 'react-toastify';
import type { PopupWarningOptions, ToastPromiseReturn } from '../types/global';

interface GlobalContextType {
    showToast: (message: string, props?: ToastOptions) => void;
    toastPromise: (message?: string) => ToastPromiseReturn;
    popupWarning: (options: PopupWarningOptions) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
