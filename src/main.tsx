import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { disableInspect } from './lib/disableInspect';
import { applyColorScheme } from './lib/themeManager';

disableInspect();
applyColorScheme();
createRoot(document.getElementById("root")!).render(<App />);