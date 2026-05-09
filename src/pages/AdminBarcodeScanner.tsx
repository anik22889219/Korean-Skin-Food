import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../services/api';
import { Product } from '../types';
import { 
  Scan, 
  Package, 
  History, 
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2,
  X
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

interface ScanResult {
  product: Product;
  timestamp: string;
  action?: 'increment' | 'decrement';
}

const AdminBarcodeScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanError);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanning]);

  const onScanSuccess = async (decodedText: string) => {
    setScanning(false);
    try {
      const products = await api.getProducts();
      // In a real app, you'd match decodedText with a barcode field. 
      // For this demo, we'll match it with the product_id or name.
      const found = products.find(p => p.product_id === decodedText || p.name_en.toLowerCase().includes(decodedText.toLowerCase()));
      
      if (found) {
        setActiveProduct(found);
        setError(null);
      } else {
        setError(`Asset "${decodedText}" not found in protocol.`);
      }
    } catch (err) {
      setError("System failure during catalog lookup.");
    }
  };

  const onScanError = (errorMessage: any) => {
    // console.warn(errorMessage);
  };

  const handleStockUpdate = async (change: number) => {
    if (!activeProduct) return;
    setUpdating(true);
    try {
      const newStock = Math.max(0, (activeProduct.stock || 0) + change);
      await api.updateStock(activeProduct.product_id!, newStock);
      
      const updatedProduct = { ...activeProduct, stock: newStock };
      setActiveProduct(updatedProduct);
      
      setScanHistory([
        { product: updatedProduct, timestamp: new Date().toLocaleTimeString(), action: change > 0 ? 'increment' : 'decrement' },
        ...scanHistory
      ]);
    } catch (err) {
      alert("Failed to sync stock updates.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Scanner Protocol</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Direct camera optical identification & stock sync</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Scanner Viewport */}
          <div className="space-y-6">
             <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center justify-center min-h-[400px]">
                {!scanning && !activeProduct && (
                   <div className="text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                         <Scan className="w-10 h-10" />
                      </div>
                      <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter mb-2">Camera Offline</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest max-w-[200px] mx-auto mb-8">Align your device to the identification tag for instant sync</p>
                      <button 
                        onClick={() => setScanning(true)}
                        className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
                      >
                        Activate Optics
                      </button>
                   </div>
                )}

                {scanning && (
                   <div className="w-full relative">
                      <div id="reader" className="w-full overflow-hidden rounded-3xl border-4 border-gray-900"></div>
                      <button 
                        onClick={() => setScanning(false)}
                        className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full shadow-lg"
                      >
                         <X className="w-4 h-4" />
                      </button>
                   </div>
                )}

                {activeProduct && !scanning && (
                   <div className="w-full space-y-8">
                      <div className="flex items-center gap-6">
                         <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg">
                            <img src={activeProduct.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                         </div>
                         <div className="flex-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest mb-2">
                               <CheckCircle2 className="w-2.5 h-2.5" />
                               Identified
                            </div>
                            <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">{activeProduct.name_en}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeProduct.category} | SKU: {activeProduct.product_id}</p>
                         </div>
                      </div>

                      <div className="bg-gray-50 rounded- [2.5rem] p-10 flex flex-col items-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Storage Volume</p>
                         <div className="text-6xl font-black text-gray-900 italic tracking-tighter mb-8">{activeProduct.stock}</div>
                         <div className="flex items-center gap-4">
                            <button 
                               disabled={updating}
                               onClick={() => handleStockUpdate(-1)}
                               className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                            >
                               <Minus className="w-6 h-6" />
                            </button>
                            <button 
                               disabled={updating}
                               onClick={() => handleStockUpdate(1)}
                               className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-emerald-50 hover:text-emerald-500 transition-all shadow-sm"
                            >
                               <Plus className="w-6 h-6" />
                            </button>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <button 
                            onClick={() => { setActiveProduct(null); setScanning(true); }}
                            className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                         >
                            Next Scan
                         </button>
                         <button 
                            onClick={() => setActiveProduct(null)}
                            className="px-6 py-4 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                         >
                            Finish
                         </button>
                      </div>
                   </div>
                )}

                {error && (
                   <div className="text-center p-8 bg-red-50 rounded-3xl mt-4">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                      <p className="text-xs font-black text-red-900 uppercase italic tracking-tighter">{error}</p>
                      <button 
                        onClick={() => { setError(null); setScanning(true); }}
                        className="mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest underline"
                      >
                        Try Rebooting Sensors
                      </button>
                   </div>
                )}
             </div>
          </div>

          {/* Activity Logs */}
          <div className="space-y-6">
             <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic flex items-center gap-2">
                <History className="w-5 h-5" />
                Capture History
             </h4>
             <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="divide-y divide-gray-50">
                   {scanHistory.map((scan, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                               <img src={scan.product.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                               <h6 className="text-[10px] font-black text-gray-900 uppercase italic tracking-tighter">{scan.product.name_en}</h6>
                               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{scan.timestamp}</p>
                            </div>
                         </div>
                         <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                            scan.action === 'increment' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                         }`}>
                            {scan.action === 'increment' ? '+ Stock' : '- Stock'}
                         </div>
                      </div>
                   ))}
                   {scanHistory.length === 0 && (
                      <div className="py-24 text-center">
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">No capture logs detected in current session.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBarcodeScanner;
