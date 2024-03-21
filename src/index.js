import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import '@mantine/core/styles.css';

import BirthdayProvider from './components/BirthdayProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider>
      <DatesProvider settings={{ locale: 'en' }}>
        <BirthdayProvider>
          <App />
        </BirthdayProvider>
      </DatesProvider>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
