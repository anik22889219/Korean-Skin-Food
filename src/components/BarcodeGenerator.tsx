import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import { Product } from '../types';
import { Printer } from 'lucide-react';

interface BarcodeGeneratorProps {
  product: Product;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ product }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const barcodeValue = product.barcode || product.product_id || 'UNKNOWN';

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode - ${product.name_en}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 20px;
              }
              .label-container {
                border: 1px solid #ccc;
                padding: 20px;
                text-align: center;
                max-width: 300px;
                border-radius: 8px;
              }
              .product-name {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 5px;
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .product-price {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Need a slight delay for the SVG to render properly before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={printRef} 
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center mb-4"
      >
        <div className="label-container flex flex-col items-center">
          <div className="text-xs font-bold text-gray-900 mb-1 max-w-[200px] truncate" title={product.name_en}>
            {product.name_en}
          </div>
          <div className="text-sm font-black text-gray-900 mb-2">
            ৳ {product.discount_price || product.price}
          </div>
          <Barcode 
            value={barcodeValue} 
            format="CODE128"
            width={1.5}
            height={40}
            fontSize={12}
            background="#ffffff"
            lineColor="#000000"
            margin={0}
          />
        </div>
      </div>
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
      >
        <Printer className="w-4 h-4" />
        Print Label
      </button>
    </div>
  );
};
