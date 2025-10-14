import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'normalize.css';
import App from './App.tsx';
import GlobalStyle from './components/GlobalStyle';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { SocketProvider } from './context/SocketContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalStyle>
            <SocketProvider>
                <Provider store={store}>
                    <App />
                </Provider>
            </SocketProvider>
        </GlobalStyle>
    </StrictMode>,
);
