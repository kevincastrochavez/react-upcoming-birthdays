import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import BirthdayProvider from './components/BirthdayProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BirthdayProvider>
      <App />
    </BirthdayProvider>
  </React.StrictMode>
);

reportWebVitals();
