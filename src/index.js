import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';         
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 

                    

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <PrimeReactProvider>
        <App />
    </PrimeReactProvider>
);
