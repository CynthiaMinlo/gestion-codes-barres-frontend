import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App/>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius:'12px', fontSize:'13px', fontWeight:'500', boxShadow:'0 4px 20px rgba(0,0,0,0.12)' },
            success: { iconTheme: { primary:'#185FA5', secondary:'#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
