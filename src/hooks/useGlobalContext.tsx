import { useContext } from 'react';
import type { ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from '../context/GlobalContext';
import type { PopupWarningOptions, ToastPromiseReturn } from '../types/global';

interface GlobalContextType {
    showToast: (message: string, props?: ToastOptions) => void;
    toastPromise: (message?: string) => ToastPromiseReturn;
    popupWarning: (options: PopupWarningOptions) => void;
}

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error('useGlobalContext must be used within GlobalProvider');
    return context;
};
