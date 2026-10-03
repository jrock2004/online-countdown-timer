import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Overlay } from './Overlay';
import { parseOverlay } from './lib/overlay';

const overlay = parseOverlay(window.location.search);

createRoot(document.getElementById('root')!).render(
  <StrictMode>{overlay ? <Overlay {...overlay} /> : <App />}</StrictMode>,
);
