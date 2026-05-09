# Google Apps Script for Korean Skin Food

আপনার গুগল শিটের নাম এবং কলাম অনুযায়ী এই কোডটি তৈরি করা হয়েছে। 

### ১. গুগল শিট চেক করুন
নিশ্চিত করুন আপনার গুগল শিটে নিচের ৪টি ট্যাব (Sheet) এই নামে আছে:
1.  `Product list 2026`
2.  `Users`
3.  `Orders`
4.  `Settings`

#### কলাম হেডারগুলো (Headers) হুবহু এভাবে লিখুন (প্রথম সারিতে):
- **Product list 2026:** `product_id`, `name_en`, `name_bn`, `category`, `price`, `discount_price`, `stock`, `description_en`, `description_bn`, `images`, `ingredients`, `skin_type`, `tags`, `is_featured`
- **Users:** `user_id`, `name`, `email`, `phone`, `address`, `role`, `password`
- **Orders:** `order_id`, `user_id`, `total_amount`, `payment_status`, `delivery_status`, `order_date`, `items`, `customer_phone`, `customer_address`
- **Settings:** `key`, `value`

### ২. নতুন কোডটি পেস্ট করুন
Extensions > Apps Script-এ গিয়ে আগের সব কোড মুছে নিচেরটি দিন:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getProducts') {
    const sheet = ss.getSheetByName('Product list 2026');
    const data = getRowsData(sheet);
    return jsonResponse(data);
  }

  if (action === 'getProductById') {
    const id = e.parameter.id;
    const sheet = ss.getSheetByName('Product list 2026');
    const data = getRowsData(sheet);
    const product = data.find(p => String(p.product_id) === String(id));
    return jsonResponse(product || { error: 'Not found' });
  }
  
  if (action === 'getUserOrders') {
    const phone = e.parameter.phone;
    const sheet = ss.getSheetByName('Orders');
    const data = getRowsData(sheet);
    const filtered = data.filter(o => String(o.customer_phone) === String(phone) || String(o.user_id) === String(phone));
    return jsonResponse(filtered);
  }

  if (action === 'getSettings') {
    const sheet = ss.getSheetByName('Settings');
    const data = getRowsData(sheet);
    return jsonResponse(data);
  }
  
  return jsonResponse({ error: 'Invalid action' });
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch(err) {
    return jsonResponse({ success: false, error: 'Invalid JSON' });
  }
  const action = body.action;
  
  if (action === 'placeOrder') {
    const sheet = ss.getSheetByName('Orders');
    const order_id = 'ORD-' + Date.now();
    const order_date = new Date().toISOString();
    
    sheet.appendRow([
      order_id,
      body.user_id || body.customer_phone,
      body.total || body.total_amount,
      'Pending',
      'Pending',
      order_date,
      JSON.stringify(body.items),
      body.customer_phone,
      body.customer_address
    ]);
    
    return jsonResponse({ success: true, order_id: order_id });
  }

  if (action === 'registerUser') {
    const sheet = ss.getSheetByName('Users');
    const data = getRowsData(sheet);
    const existing = data.find(u => String(u.phone) === String(body.phone));
    
    if (existing) return jsonResponse({ success: false, error: 'User already exists' });
    
    sheet.appendRow([
      'USR-' + Date.now(),
      body.name,
      body.email,
      body.phone,
      body.address || '',
      'customer',
      body.password
    ]);
    return jsonResponse({ success: true });
  }

  if (action === 'loginUser') {
    const sheet = ss.getSheetByName('Users');
    const data = getRowsData(sheet);
    const user = data.find(u => String(u.phone) === String(body.phone) && String(u.password) === String(body.password));
    
    if (user) return jsonResponse({ success: true, user: user });
    return jsonResponse({ success: false, error: 'Invalid phone or password' });
  }

  if (action === 'updateStock') {
    const sheet = ss.getSheetByName('Product list 2026');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('product_id');
    const stockIdx = headers.indexOf('stock');
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][idIdx]) === String(body.product_id)) {
        sheet.getRange(i + 1, stockIdx + 1).setValue(body.stock);
        return jsonResponse({ success: true });
      }
    }
    return jsonResponse({ success: false, error: 'Product not found' });
  }
  
  return jsonResponse({ error: 'Invalid action' });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRowsData(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0].map(h => String(h).trim());
  const items = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }
    items.push(item);
  }
  return items;
}
```

### ৩. নোট (খুবই গুরুত্বপূর্ণ)
আপনার শিটে `Users` এবং `Orders` ট্যাবে কিছু এক্সট্রা কলাম লাগবে যাতে অ্যাপটি ঠিকমতো কাজ করে:
- **`Users` ট্যাব:** `password` নামে একটি কলাম শেষে যোগ করুন (লগইন করার জন্য)।
- **`Orders` ট্যাব:** `items`, `customer_phone`, এবং `customer_address` কলামগুলো যোগ করুন (অর্ডারের ডিটেইলস সেভ করার জন্য)।

```

### 3. Deploy the Script
1. Click **Deploy > New Deployment**.
2. Select type: **Web App**.
3. Set "Execute as": **Me**.
4. Set "Who has access": **Anyone**.
5. Click **Deploy** and copy the **Web App URL**.

### 4. Connect to App
1. Go to the Settings of this AI Studio app.
2. Add an environment variable named `VITE_APPS_SCRIPT_URL` and paste your copied URL.
3. Your products will now load from the Google Sheet!
