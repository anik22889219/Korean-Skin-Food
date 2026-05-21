function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getProducts') {
    const sheet = ss.getSheetByName('Product list 2026');
    const data = getRowsData(sheet);
    return jsonResponse(data);
  }

  if (action === 'getProductById') {
    const id = (e.parameter.id || "").trim().toLowerCase();
    const sheet = ss.getSheetByName('Product list 2026');
    const data = getRowsData(sheet);
    const normalize = function(s) { 
      return String(s || "").toLowerCase().replace(/[\s_-]/g, ''); 
    };
    const normalizedTarget = normalize(id);

    const product = data.find(p => {
      return Object.keys(p).some(key => {
        const lowerKey = key.toLowerCase();
        // Check if key is ID-related
        if (lowerKey.indexOf('id') !== -1 || lowerKey.indexOf('product') !== -1) {
          return normalize(p[key]) === normalizedTarget;
        }
        return false;
      }) || normalize(p.product_id || p.id || "") === normalizedTarget;
    });
    return jsonResponse(product || { error: 'Not found' });
  }

  if (action === 'getProductByBarcode') {
    const barcode = (e.parameter.barcode || "").trim();
    const sheet = ss.getSheetByName('Product list 2026');
    const data = getRowsData(sheet);
    const product = data.find(p => String(p.barcode || "").trim() === barcode);
    return jsonResponse(product || { error: 'Not found' });
  }
  
  if (action === 'getUserOrders') {
    const phone = e.parameter.phone;
    const sheet = ss.getSheetByName('Orders');
    const data = getRowsData(sheet);
    const filtered = data.filter(o => String(o.customer_phone) === String(phone) || String(o.user_id) === String(phone));
    return jsonResponse(filtered);
  }

  if (action === 'getAllOrders') {
    const sheet = ss.getSheetByName('Orders');
    const data = getRowsData(sheet);
    return jsonResponse(data);
  }

  if (action === 'getAllUsers') {
    const sheet = ss.getSheetByName('Users');
    const data = getRowsData(sheet);
    return jsonResponse(data);
  }

  if (action === 'getSettings') {
    const sheet = ss.getSheetByName('Settings');
    const data = getRowsData(sheet);
    return jsonResponse(data);
  }

  if (action === 'getCustomerByPhone') {
    const phone = e.parameter.phone;
    const sheet = ss.getSheetByName('Users');
    const data = getRowsData(sheet);
    const user = data.find(u => String(u.phone) === String(phone));
    
    // Also fetch orders for this customer
    const orderSheet = ss.getSheetByName('Orders');
    const orders = getRowsData(orderSheet).filter(o => String(o.customer_phone) === String(phone));
    
    return jsonResponse({ user, orders });
  }

  if (action === 'getInventoryLogs') {
    const sheet = ss.getSheetByName('inventory_logs') || ss.insertSheet('inventory_logs');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['log_id', 'product_id', 'change_type', 'quantity', 'timestamp', 'user_role']);
    }
    return jsonResponse(getRowsData(sheet));
  }

  if (action === 'getAnalytics') {
    const orders = getRowsData(ss.getSheetByName('Orders'));
    const leads = getRowsData(ss.getSheetByName('customer_leads'));
    const products = getRowsData(ss.getSheetByName('Product list 2026'));
    
    return jsonResponse({
      total_orders: orders.length,
      total_leads: leads.length,
      total_products: products.length,
      revenue: orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
    });
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

  // Security Check: Verify API Key for sensitive operations
  const requiredApiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
  
  if (requiredApiKey && body.api_key !== requiredApiKey) {
    if (action !== 'loginUser' && action !== 'registerUser' && action !== 'placeOrder' && action !== 'saveLead' && action !== 'logError') {
       return jsonResponse({ success: false, error: 'Unauthorized: Invalid API Key' });
    }
  }

  // Rate Limiting for Public Endpoints
  if (action === 'placeOrder' || action === 'saveLead') {
    const cache = CacheService.getScriptCache();
    const identifier = body.customer_phone || body.phone || 'anonymous';
    const rateLimitKey = 'rl_' + action + '_' + identifier;
    const requests = cache.get(rateLimitKey);
    
    if (requests && parseInt(requests) >= 5) { // Max 5 requests per 5 minutes
      return jsonResponse({ success: false, error: 'Rate limit exceeded. Please try again later.' });
    } else {
      cache.put(rateLimitKey, (requests ? parseInt(requests) + 1 : 1).toString(), 300);
    }
  }

  // ERROR LOGGING (Frontend errors)
  if (action === 'logError') {
    try {
      const errorSheet = ss.getSheetByName('error_logs') || ss.insertSheet('error_logs');
      if (errorSheet.getLastRow() === 0) {
        errorSheet.appendRow(['timestamp', 'source', 'error_message', 'stack', 'payload']);
      }
      errorSheet.appendRow([
        new Date().toISOString(),
        'FRONTEND',
        body.error_message,
        body.stack || '',
        body.context || ''
      ]);
      return jsonResponse({ success: true });
    } catch(err) {
      return jsonResponse({ success: false });
    }
  }

  try {

    // LOG ACTION (System-wide Audit)
    if (action === 'logAction' || body.log_action) {
      const logSheet = ss.getSheetByName('ai_system_logs') || ss.insertSheet('ai_system_logs');
      if (logSheet.getLastRow() === 0) {
        logSheet.appendRow(['timestamp', 'user', 'role', 'action', 'details', 'status']);
      }
      logSheet.appendRow([
        new Date().toISOString(),
        body.user_email || 'System',
        body.user_role || 'viewer',
        action,
        JSON.stringify(body),
        'SUCCESS'
      ]);
    }
    
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

      // Update stock for each item
      try {
        const productSheet = ss.getSheetByName('Product list 2026');
        const pData = productSheet.getDataRange().getValues();
        const pHeaders = pData[0];
        const idIdx = pHeaders.indexOf('product_id');
        const stockIdx = pHeaders.indexOf('stock');

        if (idIdx !== -1 && stockIdx !== -1) {
          body.items.forEach(item => {
            for (let i = 1; i < pData.length; i++) {
              if (String(pData[i][idIdx]) === String(item.product_id || item.id)) {
                const currentStock = Number(pData[i][stockIdx]) || 0;
                const newStock = Math.max(0, currentStock - (Number(item.quantity) || 0));
                productSheet.getRange(i + 1, stockIdx + 1).setValue(newStock);
                break;
              }
            }
          });
        }
      } catch (e) {
        console.error('Stock update failed:', e);
      }
      
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
          
          const logSheet = ss.getSheetByName('inventory_logs') || ss.insertSheet('inventory_logs');
          logSheet.appendRow([
            'LOG-' + Date.now(),
            body.product_id,
            'STOCK_UPDATE',
            body.stock,
            new Date().toISOString(),
            body.user_role || 'admin'
          ]);
          
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: 'Product not found' });
    }

    if (action === 'addProduct') {
      try {
        const sheet = ss.getSheetByName('Product list 2026');
        const headers = sheet.getDataRange().getValues()[0];
        const newRow = headers.map(h => {
          let val = body[h];
          if (val === undefined || val === null) return '';
          if (Array.isArray(val) || typeof val === 'object') return JSON.stringify(val);
          return val;
        });
        sheet.appendRow(newRow);
        return jsonResponse({ success: true });
      } catch (err) {
        return jsonResponse({ success: false, error: err.message });
      }
    }

    if (action === 'updateProduct') {
      const sheet = ss.getSheetByName('Product list 2026');
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idIdx = headers.indexOf('product_id');
      
      for (let i = 1; i < data.length; i++) {
         if (String(data[i][idIdx]) === String(body.product_id)) {
           headers.forEach((h, colIdx) => {
             if (body[h] !== undefined) {
               let val = body[h];
               if (Array.isArray(val) || typeof val === 'object') val = JSON.stringify(val);
               sheet.getRange(i + 1, colIdx + 1).setValue(val);
             }
           });
           return jsonResponse({ success: true });
         }
      }
      return jsonResponse({ success: false, error: 'Product not found' });
    }

    if (action === 'deleteProduct') {
      const sheet = ss.getSheetByName('Product list 2026');
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idIdx = headers.indexOf('product_id');
      
      for (let i = 1; i < data.length; i++) {
         if (String(data[i][idIdx]) === String(body.product_id)) {
           sheet.deleteRow(i + 1);
           return jsonResponse({ success: true });
         }
      }
      return jsonResponse({ success: false, error: 'Product not found' });
    }

    if (action === 'updateOrderStatus') {
      const sheet = ss.getSheetByName('Orders');
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idIdx = headers.indexOf('order_id');
      const statusIdx = headers.indexOf('delivery_status');
      
      for (let i = 1; i < data.length; i++) {
         if (String(data[i][idIdx]) === String(body.order_id)) {
           sheet.getRange(i + 1, statusIdx + 1).setValue(body.status);
           return jsonResponse({ success: true });
         }
      }
      return jsonResponse({ success: false, error: 'Order not found' });
    }

    if (action === 'saveLead') {
      const sheet = ss.getSheetByName('customer_leads') || ss.insertSheet('customer_leads');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['lead_id', 'name', 'phone', 'address', 'source', 'timestamp']);
      }
      sheet.appendRow([
        'LD-' + Date.now(),
        body.name,
        body.phone,
        body.address,
        body.source || 'AI_CHATBOT',
        new Date().toISOString()
      ]);
      return jsonResponse({ success: true });
    }

    // ADVANCED INFRASTRUCTURE (Super Admin only - validated by role in body)
    if (action === 'manageSheet') {
      if (body.user_role !== 'super_admin') return jsonResponse({ success: false, error: 'Unauthorized' });
      
      if (body.sub_action === 'createSheet') {
        const newSheet = ss.getSheetByName(body.sheet_name) || ss.insertSheet(body.sheet_name);
        if (body.headers && Array.isArray(body.headers)) {
          newSheet.appendRow(body.headers);
        }
        return jsonResponse({ success: true, message: 'Sheet managed' });
      }
      
      if (body.sub_action === 'addColumn') {
        const targetSheet = ss.getSheetByName(body.sheet_name);
        if (!targetSheet) return jsonResponse({ success: false, error: 'Sheet not found' });
        const lastCol = targetSheet.getLastColumn();
        targetSheet.getRange(1, lastCol + 1).setValue(body.column_name);
        return jsonResponse({ success: true });
      }
    }

    // OPERATIONAL WORKFLOW: PACK ORDER (Barcode Scanner)
    if (action === 'packOrder') {
      const orderSheet = ss.getSheetByName('Orders');
      const productSheet = ss.getSheetByName('Product list 2026');
      const logSheet = ss.getSheetByName('inventory_logs') || ss.insertSheet('inventory_logs');
      
      // 1. Mark Order as Packed
      const oData = orderSheet.getDataRange().getValues();
      const oHeaders = oData[0];
      const oIdIdx = oHeaders.indexOf('order_id');
      const oStatusIdx = oHeaders.indexOf('delivery_status');
      
      let foundOrder = false;
      for (let i = 1; i < oData.length; i++) {
        if (String(oData[i][oIdIdx]) === String(body.order_id)) {
          orderSheet.getRange(i + 1, oStatusIdx + 1).setValue('ready_for_delivery');
          foundOrder = true;
          break;
        }
      }
      if (!foundOrder) return jsonResponse({ success: false, error: 'Order ID not found' });

      // 2. Log barcode scan event
      logSheet.appendRow([
        'LOG-' + Date.now(),
        body.product_id || 'UNKNOWN',
        'SCAN_PACK',
        '-1',
        new Date().toISOString(),
        body.user_role || 'moderator'
      ]);

      return jsonResponse({ success: true, status: 'ready_for_delivery' });
    }
    
    return jsonResponse({ error: 'Invalid action' });
  } catch(error) {
    // BACKEND ERROR LOGGING
    try {
      const errorSheet = ss.getSheetByName('error_logs') || ss.insertSheet('error_logs');
      if (errorSheet.getLastRow() === 0) {
        errorSheet.appendRow(['timestamp', 'source', 'error_message', 'stack', 'payload']);
      }
      errorSheet.appendRow([
        new Date().toISOString(),
        'BACKEND_' + action,
        error.message,
        error.stack || '',
        JSON.stringify(body || {})
      ]);
    } catch(loggingErr) {}
    
    return jsonResponse({ success: false, error: 'Internal Server Error' });
  }
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
