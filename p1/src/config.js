// Centralized environment configuration
export const API_BASE_URL = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname.startsWith('192.168.') || 
  window.location.hostname.startsWith('10.') || 
  window.location.hostname.startsWith('172.')
    ? `http://${window.location.hostname}:5000`
    : 'https://mentalhealth-backend-sa09.onrender.com';
