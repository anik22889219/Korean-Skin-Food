import axios from 'axios';

// All requests go directly to Google Apps Script Web App.
const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

if (!SCRIPT_URL) {
  console.error('[KSF API] VITE_APPS_SCRIPT_URL is not set. Check your .env file.');
}

export const get = (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  return axios.get(`${SCRIPT_URL}?${query}`);
};

export const post = (body: Record<string, unknown>) => {
  const API_KEY = import.meta.env.VITE_API_KEY as string;
  
  // Attach API Key to body for secure operations
  const secureBody = {
    ...body,
    ...(API_KEY ? { api_key: API_KEY } : {})
  };

  // Google Apps Script requires text/plain to bypass CORS preflight issues on POST requests
  return axios.post(SCRIPT_URL, JSON.stringify(secureBody), {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  });
};
