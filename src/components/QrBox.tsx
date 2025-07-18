import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrBoxProps {
  value: string;
  size?: number;
}

export const QrBox: React.FC<QrBoxProps> = ({ value, size = 128 }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md inline-block">
      <QRCodeSVG value={value} size={size} bgColor="#ffffff" fgColor="#000000" />
    </div>
  );
};
