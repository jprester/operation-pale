import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const Page = import.meta.env.DEV && window.location.pathname === '/dev/models'
  ? React.lazy(() => import('./dev/ModelInspector'))
  : App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><React.Suspense fallback={null}><Page/></React.Suspense></React.StrictMode>
);
