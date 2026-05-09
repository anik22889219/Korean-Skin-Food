/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for products (Proxy to Google Sheets / Apps Script)
  app.get('/api/products', async (req, res) => {
    const url = process.env.VITE_APPS_SCRIPT_URL;
    if (!url) {
      return res.status(500).json({ error: 'VITE_APPS_SCRIPT_URL is not set in environment variables' });
    }
    
    // Append all query parameters from the request
    try {
      console.log(`Proxying GET request to: ${url} with params:`, req.query);
      const targetUrl = new URL(url);
      Object.keys(req.query).forEach(key => {
        targetUrl.searchParams.append(key, req.query[key] as string);
      });

      const response = await axios.get(targetUrl.toString(), {
        timeout: 30000,
        maxRedirects: 10,
        validateStatus: (status) => status >= 200 && status < 400
      });
      
      res.json(response.data);
    } catch (error: any) {
      console.error('Proxy GET error:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      res.status(500).json({ error: 'Failed to fetch data from Google Sheets', details: error.message });
    }
  });

  app.post('/api/products', async (req, res) => {
    const url = process.env.VITE_APPS_SCRIPT_URL;
    if (!url) {
      return res.status(500).json({ error: 'VITE_APPS_SCRIPT_URL is not set in environment variables' });
    }

    try {
      console.log(`Proxying POST request to: ${url} with body action:`, req.body?.action);
      const response = await axios.post(url, req.body, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
        maxRedirects: 10
      });
      res.json(response.data);
    } catch (error: any) {
      console.error('Proxy POST error:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      res.status(500).json({ error: 'Failed to send data to Google Sheets', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
