"use client";
import React from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";

interface QrScannerProps {
  onScan: (resultText: string) => void;
  onError: (error: unknown) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, onError }) => {
  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const resultText = detectedCodes[0].rawValue;
      if (resultText) {
        onScan(resultText);
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Scanner
        onScan={handleScan}
        onError={onError}
        constraints={{ facingMode: "environment" }}
      />
    </div>
  );
};

export default QrScanner;