import { useMemo, useState, type ReactNode } from 'react';
import { toast, ToastContainer, type ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popup from 'reactjs-popup';
import Button from '../components/Button';
import 'react-toastify/dist/ReactToastify.css';
import type { PopupWarningOptions, ToastPromiseReturn } from '../types/global';
import { GlobalContext } from '../context/GlobalContext';
interface GlobalProviderProps {
    children: ReactNode;
}

interface PopupState {
    state: boolean;
    message: ReactNode;
    next: () => void;
    accecpt: () => void;
    cancel: () => void;
    accecptM: string;
    cancelM: string;
}
export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [popup, setPopup] = useState<PopupState>({
        state: false,
        message: '123',
        next: () => {},
        accecpt: () => {},
        cancel: () => {},
        accecptM: 'Chấp nhận',
        cancelM: 'Hủy',
    });

    const showToast = (message: string, props: ToastOptions = {}) => {
        toast.error(message, { autoClose: 2000, ...props });
    };

    const toastPromise = (message = 'Waiting promise...'): ToastPromiseReturn => {
        const toastId = toast.loading(message);
        return {
            success(msg = 'success', props: ToastOptions = {}) {
                toast.update(toastId, {
                    render: msg,
                    type: 'success',
                    isLoading: false,
                    autoClose: 1000,
                    ...props,
                });
                return toastId as unknown as number;
            },
            error(msg = 'Something went wrong', props: ToastOptions = {}) {
                toast.update(toastId, { render: msg, type: 'error', isLoading: false, autoClose: 1000, ...props });
            },
        };
    };

    const popupWarning = ({
        accecptM = 'Chấp nhận',
        cancelM = 'Hủy',
        message,
        next = () => {},
        accecpt = () => {},
        cancel = () => {},
    }: PopupWarningOptions) => {
        const event = { next, accecpt, cancel, cancelM, accecptM, message };
        setPopup((prev) => ({ ...prev, state: true, ...event }));
    };

    const value = useMemo(() => ({ showToast, popupWarning, toastPromise }), []);

    return (
        <>
            <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
            <ToastContainer draggable />
            <Popup
                open={popup.state}
                onClose={() => {
                    popup.next();
                    setPopup((prev) => ({ ...prev, state: false }));
                }}
            >
                {popup.message}
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setPopup((prev) => ({ ...prev, state: false }));
                            popup.next();
                            popup.accecpt();
                        }}
                    >
                        {popup.accecptM}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setPopup((prev) => ({ ...prev, state: false }));
                            popup.next();
                            popup.cancel();
                        }}
                    >
                        {popup.cancelM}
                    </Button>
                </div>
            </Popup>
        </>
    );
};
