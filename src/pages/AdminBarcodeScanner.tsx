import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
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
  X,
  Keyboard,
  Settings2,
  Box
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
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(() => {
    const saved = sessionStorage.getItem('scanner_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    sessionStorage.setItem('scanner_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [adjustQuantity, setAdjustQuantity] = useState(1);
  const [scannerMode, setScannerMode] = useState<'STOCK' | 'PACK'>('STOCK');
  const [targetOrderId, setTargetOrderId] = useState('');

  const playSuccessSound = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = 1200;
      osc.connect(ctx.destination);
      osc.start(); 
      osc.stop(ctx.currentTime + 0.15);
      if (navigator.vibrate) navigator.vibrate(100);
    } catch {}
  };

  const scanCallbackRef = useRef<(text: string) => void>();

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "reader", 
        { 
          fps: 15, 
          qrbox: { width: 300, height: 150 },
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          aspectRatio: 2.0,
        },
        /* verbose= */ false
      );

      scanner.render((text) => scanCallbackRef.current?.(text), onScanError);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanning]);

  const lastScanRef = useRef<string>('');
  const lastScanTimeRef = useRef<number>(0);

  const onScanSuccess = async (decodedText: string) => {
    const now = Date.now();
    if (decodedText === lastScanRef.current && now - lastScanTimeRef.current < 3000) return;
    
    lastScanRef.current = decodedText;
    lastScanTimeRef.current = now;
    setScanning(false);
    try {
      const products = await api.getProducts();
      // Match decodedText with barcode field first, then fallback to product_id
      const found = products.find(p => 
        (p.barcode && String(p.barcode).trim() === decodedText.trim()) || 
        String(p.product_id).trim() === decodedText.trim()
      );
      
      if (found) {
        playSuccessSound();
        setActiveProduct(found);
        setError(null);
        setAdjustQuantity(1); // Reset quantity on new scan
      } else {
        setError(`Asset "${decodedText}" not found in protocol.`);
      }
    } catch (err) {
      setError("System failure during catalog lookup.");
    }
  };

  scanCallbackRef.current = onScanSuccess;

  const onScanError = (errorMessage: any) => {
    // console.warn(errorMessage);
  };

  const handleStockUpdate = async (changeType: 'increment' | 'decrement' | 'exact') => {
    if (!activeProduct) return;
    if (!activeProduct.product_id) {
      alert("Product ID missing");
      return;
    }

    let newStock = activeProduct.stock || 0;
    if (changeType === 'increment') newStock += adjustQuantity;
    else if (changeType === 'decrement') newStock = Math.max(0, newStock - adjustQuantity);
    else if (changeType === 'exact') newStock = adjustQuantity;

    if (!window.confirm(`Update stock from ${activeProduct.stock} to ${newStock}?`)) return;

    setUpdating(true);
    try {
      await api.updateStock(activeProduct.product_id, newStock);
      
      const updatedProduct = { ...activeProduct, stock: newStock };
      setActiveProduct(updatedProduct);
      
      setScanHistory([
        { 
          product: updatedProduct, 
          timestamp: new Date().toLocaleTimeString(), 
          action: newStock > (activeProduct.stock || 0) ? 'increment' : 'decrement' 
        },
        ...scanHistory
      ]);
      setAdjustQuantity(1);
    } catch (err) {
      alert("Failed to sync stock updates.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePackOrder = async () => {
    if (!activeProduct || !activeProduct.product_id || !targetOrderId.trim()) {
      alert("Product and Order ID are required.");
      return;
    }
    setUpdating(true);
    try {
      const res = await api.packOrder(targetOrderId.trim(), activeProduct.product_id, 'admin');
      if (res.success) {
        alert("Order packed successfully!");
        setScanHistory([
          { product: activeProduct, timestamp: new Date().toLocaleTimeString(), action: 'decrement' },
          ...scanHistory
        ]);
        setActiveProduct(null);
        setTargetOrderId('');
        setScanning(true);
      } else {
        alert(res.error || "Failed to pack order.");
      }
    } catch (err) {
      alert("System failure during pack operation.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="space-y-12 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Scanner Protocol</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Direct camera optical identification & stock sync</p>
          </div>
          <div className="flex bg-white rounded-full p-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100">
            <button
              onClick={() => setScannerMode('STOCK')}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                scannerMode === 'STOCK' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4 inline-block mr-2" />
              Stock Mode
            </button>
            <button
              onClick={() => setScannerMode('PACK')}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                scannerMode === 'PACK' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              <Box className="w-4 h-4 inline-block mr-2" />
              Pack Mode
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Scanner Viewport */}
          <div className="space-y-6">
             <div className="bg-white p-12 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center min-h-[450px]">
                {!scanning && !activeProduct && (
                   <div className="text-center w-full">
                      <div className="w-24 h-24 bg-[#FDF9F6] border border-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-300 shadow-sm">
                         <Scan className="w-10 h-10" />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Camera Offline</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest max-w-[200px] mx-auto mb-10">Align your device to the identification tag for instant sync</p>
                      <button 
                        onClick={() => setScanning(true)}
                        className="px-10 py-5 bg-gray-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all w-full mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                      >
                        Activate Optics
                      </button>
                      <div className="flex items-center gap-3">
                         <div className="relative flex-1">
                            <Keyboard className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="Manual Code..." 
                              value={manualInput}
                              onChange={(e) => setManualInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && manualInput.trim()) {
                                  onScanSuccess(manualInput.trim());
                                  setManualInput('');
                                }
                              }}
                              className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-xs font-black uppercase tracking-widest focus:outline-none focus:border-gray-300 transition-all"
                            />
                         </div>
                         <button 
                            onClick={() => {
                              if (manualInput.trim()) {
                                onScanSuccess(manualInput.trim());
                                setManualInput('');
                              }
                            }}
                            className="px-6 py-4 bg-gray-100 text-gray-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                         >
                            Go
                         </button>
                      </div>
                   </div>
                )}

                {scanning && (
                   <div className="w-full relative">
                      <div id="reader" className="w-full overflow-hidden rounded-[2rem] border-4 border-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"></div>
                      <button 
                        onClick={() => setScanning(false)}
                        className="absolute -top-4 -right-4 p-3 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                         <X className="w-5 h-5" />
                      </button>
                   </div>
                )}

                {activeProduct && !scanning && (
                   <div className="w-full space-y-8">
                      <div className="flex items-center gap-8">
                         <div className="w-32 h-32 rounded-[2rem] overflow-hidden border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] bg-[#FDF9F6] shrink-0">
                            <img src={activeProduct.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                         </div>
                         <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-emerald-100">
                               <CheckCircle2 className="w-3.5 h-3.5" />
                               Identified
                            </div>
                            <h4 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight mb-2">{activeProduct.name_en}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeProduct.category} | SKU: {activeProduct.product_id}</p>
                         </div>
                      </div>

                      <div className="bg-[#FDF9F6] rounded-[3rem] p-10 flex flex-col items-center border border-orange-50 relative overflow-hidden">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Current Storage Volume</p>
                         <div className="text-6xl font-black text-gray-900 italic tracking-tighter mb-8">{activeProduct.stock}</div>
                         
                         {scannerMode === 'STOCK' ? (
                           <div className="w-full space-y-6 relative z-10">
                             <div className="flex items-center justify-center gap-4">
                                <button 
                                   disabled={updating}
                                   onClick={() => handleStockUpdate('decrement')}
                                   className="w-16 h-16 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.03)] hover:scale-[1.05]"
                                >
                                   <Minus className="w-6 h-6" />
                                </button>
                                <div className="relative">
                                   <input 
                                     type="number"
                                     min="1"
                                     value={adjustQuantity}
                                     onChange={(e) => setAdjustQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                     className="w-24 h-16 text-center text-2xl font-black bg-white border border-gray-100 rounded-[1.5rem] focus:outline-none focus:border-gray-900 shadow-inner"
                                   />
                                </div>
                                <button 
                                   disabled={updating}
                                   onClick={() => handleStockUpdate('increment')}
                                   className="w-16 h-16 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.03)] hover:scale-[1.05]"
                                >
                                   <Plus className="w-6 h-6" />
                                </button>
                             </div>
                             <button
                               disabled={updating}
                               onClick={() => handleStockUpdate('exact')}
                               className="w-full py-4 bg-white text-gray-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 border border-gray-100 shadow-sm transition-all"
                             >
                               Set Exact Stock
                             </button>
                           </div>
                         ) : (
                           <div className="w-full space-y-6 relative z-10">
                             <div className="relative">
                               <input 
                                 type="text"
                                 placeholder="Order ID (e.g., ORD-123)"
                                 value={targetOrderId}
                                 onChange={(e) => setTargetOrderId(e.target.value)}
                                 className="w-full px-6 py-5 bg-white border border-gray-100 rounded-full text-xs font-black uppercase tracking-widest focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                               />
                             </div>
                             <button
                               disabled={updating || !targetOrderId.trim()}
                               onClick={handlePackOrder}
                               className="w-full py-5 bg-emerald-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
                             >
                               Pack & Deduct Stock
                             </button>
                           </div>
                         )}
                      </div>

                      <div className="flex gap-4">
                         <button 
                            onClick={() => { setActiveProduct(null); setScanning(true); }}
                            className="flex-1 py-5 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                         >
                            Next Scan
                         </button>
                         <button 
                            onClick={() => setActiveProduct(null)}
                            className="px-8 py-5 border border-gray-200 rounded-full font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
                         >
                            Finish
                         </button>
                      </div>
                   </div>
                )}

                {error && (
                   <div className="text-center p-10 bg-red-50 rounded-[3rem] mt-6 border border-red-100 w-full">
                      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                      <p className="text-sm font-black text-red-900 uppercase italic tracking-tighter">{error}</p>
                      <button 
                        onClick={() => { setError(null); setScanning(true); }}
                        className="mt-6 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
                      >
                        Try Rebooting Sensors
                      </button>
                   </div>
                )}
             </div>
          </div>

          {/* Activity Logs */}
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <h4 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic flex items-center gap-3">
                  <History className="w-6 h-6 text-gray-400" />
                  Capture History
               </h4>
               {scanHistory.length > 0 && (
                 <button 
                   onClick={() => setScanHistory([])}
                   className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                 >
                   Clear History
                 </button>
               )}
             </div>
             <div className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden min-h-[500px]">
                <div className="divide-y divide-gray-50">
                   {scanHistory.map((scan, idx) => (
                      <div key={idx} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#FDF9F6] border border-orange-50 overflow-hidden flex-shrink-0">
                               {scan.product.images?.[0] ? (
                                  <img src={scan.product.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                               ) : (
                                  <Package className="w-6 h-6 m-5 text-gray-300" />
                               )}
                            </div>
                            <div>
                               <h6 className="text-xs font-black text-gray-900 uppercase italic tracking-tighter mb-1">{scan.product.name_en}</h6>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{scan.timestamp}</p>
                            </div>
                         </div>
                         <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border ${
                            scan.action === 'increment' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                         }`}>
                            {scan.action === 'increment' ? '+ Stock' : '- Stock'}
                         </div>
                      </div>
                   ))}
                   {scanHistory.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-40 opacity-50">
                         <Box className="w-16 h-16 text-gray-300 mb-6" />
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center max-w-[200px]">No capture logs detected in current session.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBarcodeScanner;
