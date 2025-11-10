import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'normalize.css';
import App from './App.tsx';
import GlobalStyle from './components/GlobalStyle';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { SocketProvider } from './context/SocketContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalStyle>
            <SocketProvider>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                        <App />
                    </GoogleOAuthProvider>
                </Provider>
            </SocketProvider>
        </GlobalStyle>
        ,
    </StrictMode>,
);
