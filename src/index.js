import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/assets/css/animate.min.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { WebappProvider } from './context/telegram';
import { AppProvider } from './context/AppContext'; // Corrected import
import { Toaster } from 'react-hot-toast';
import i18n from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WebappProvider>
    <AppProvider>
      <React.StrictMode>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(41, 41, 41, 0.9)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#29dbdf',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff453a',
                secondary: '#000',
              },
            },
          }}
        />
        <App />
      </React.StrictMode>
    </AppProvider>
  </WebappProvider>
);

// Add this after initializing i18n
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});
