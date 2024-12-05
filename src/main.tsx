import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log("Starting application initialization");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

console.log("Creating React root");
const root = ReactDOM.createRoot(rootElement);

console.log("Rendering React application");
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("React application rendered");