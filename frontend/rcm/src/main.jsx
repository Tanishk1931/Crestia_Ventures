import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ServicesShowcase } from './ServicesShowcase.jsx';
import './showcase.css';

const el = document.getElementById('services-root');
if (el) {
  createRoot(el).render(
    <StrictMode>
      <ServicesShowcase />
    </StrictMode>
  );
}
