import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const APPS_SCRIPT_URL = process.env.VITE_APPS_SCRIPT_URL;

async function fetchData(action: string) {
  console.log(`Fetching ${action}...`);
  try {
    const response = await axios.get(`${APPS_SCRIPT_URL}?action=${action}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${action}:`, error);
    return null;
  }
}

async function exportAll() {
  const actions = [
    'getProducts',
    'getAllOrders',
    'getAllUsers',
    'getSettings',
    'getInventoryLogs',
    'getAnalytics'
  ];

  const dataDir = path.join(process.cwd(), 'scratch', 'migration_data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (const action of actions) {
    const data = await fetchData(action);
    if (data) {
      const fileName = `${action}.json`;
      fs.writeFileSync(path.join(dataDir, fileName), JSON.stringify(data, null, 2));
      console.log(`Saved ${fileName}`);
    }
  }

  // Also fetch users (this requires phone numbers in the current API, but maybe we can get them from orders)
  // For now, let's assume we can add a 'getAllUsers' to Apps Script if needed, 
  // or we'll extract them from orders/customers if possible.
  console.log('Export complete. Data saved in scratch/migration_data/');
}

exportAll();
