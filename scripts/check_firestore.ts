import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function check() {
  const collections = ['products', 'orders', 'users', 'settings', 'inventory_logs'];
  for (const col of collections) {
    const snapshot = await db.collection(col).get();
    console.log(`${col}: ${snapshot.size} documents`);
  }
}

check();
