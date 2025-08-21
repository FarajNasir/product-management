import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import QRCode from 'qrcode';

// Generate barcode
export const generateBarcode = async (data) => {
  const canvas = createCanvas();
  JsBarcode(canvas, data, {
    format: 'CODE128',
    displayValue: true,
    fontSize: 16,
    margin: 10
  });
  
  return canvas.toBuffer();
};

// Generate QR code
export const generateQRCode = async (data) => {
  try {
    return await QRCode.toBuffer(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    throw new Error('QR code generation failed');
  }
};