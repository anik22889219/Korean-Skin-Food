import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Path to your service account key file
const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: service-account-key.json not found in root directory.');
  console.log('Please follow these steps:');
  console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save the file as "service-account-key.json" in the root of this project.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importCollection(collectionName: string, fileName: string, idField: string) {
  const filePath = path.join(process.cwd(), 'scratch', 'migration_data', fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${fileName} not found, skipping...`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Importing ${data.length} documents into ${collectionName}...`);

  const batchSize = 500;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = db.batch();
    const chunk = data.slice(i, i + batchSize);

    chunk.forEach((item: any) => {
      // Ensure we have a string ID
      const docId = String(item[idField] || item.id || item.order_id || Date.now() + Math.random().toString());
      const docRef = db.collection(collectionName).doc(docId);
      
      // Clean up item (remove undefined/null if necessary, though Firestore handles most)
      // For orders, parse the items JSON string if it exists
      if (collectionName === 'orders' && typeof item.items === 'string') {
        try {
          item.items = JSON.parse(item.items);
        } catch (e) {
          console.warn(`Failed to parse items for order ${docId}`);
        }
      }

      batch.set(docRef, item);
    });

    await batch.commit();
    console.log(`  Committed batch ${Math.floor(i / batchSize) + 1}`);
  }
}

async function runMigration() {
  try {
    // Map Sheets data to Firestore collections
    await importCollection('products', 'getProducts.json', 'product_id');
    await importCollection('orders', 'getAllOrders.json', 'order_id');
    await importCollection('users', 'getAllUsers.json', 'phone');
    await importCollection('settings', 'getSettings.json', 'key');
    await importCollection('inventory_logs', 'getInventoryLogs.json', 'log_id');
    
    console.log('Migration successfully completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
