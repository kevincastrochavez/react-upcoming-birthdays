import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import BirthdayProvider from './components/BirthdayProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider>
      <BirthdayProvider>
        <App />
      </BirthdayProvider>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
