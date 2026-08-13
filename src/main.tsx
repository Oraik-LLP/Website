import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { ThemeProvider } from './theme/ThemeProvider';
import { ContentProvider } from './engine/ContentProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContentProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ContentProvider>
  </React.StrictMode>,
);
