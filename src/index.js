import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import '../src/assets/css/animate.min.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { WebappProvider } from './context/telegram';
import { AppProvider } from './context/AppContext'; // Corrected import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WebappProvider>
    <AppProvider>
      <React.StrictMode>
        <App />
        <ToastContainer />
      </React.StrictMode>
    </AppProvider>
  </WebappProvider>
);
