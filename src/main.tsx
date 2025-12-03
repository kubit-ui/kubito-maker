import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import KubitoEditor from './KubitoEditor.tsx';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <>
    <Analytics />
    <SpeedInsights />
    <KubitoEditor />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
      }}
    />
  </>
);
