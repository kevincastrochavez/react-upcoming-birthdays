import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { BrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';

import BirthdayProvider from './components/BirthdayProvider';
import './i18n/config';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider>
      <DatesProvider settings={{ locale: 'en' }}>
        <BirthdayProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BirthdayProvider>
      </DatesProvider>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
