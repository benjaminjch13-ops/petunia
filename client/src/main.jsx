import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProviders } from './context/AppProviders.jsx';

import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/cards.css';
import './styles/mascot.css';
import './styles/pages.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
);
