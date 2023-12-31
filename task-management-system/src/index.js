import React from 'react';
import AuthProvider from './context-providers/auth-context';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ToastContainer />
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
