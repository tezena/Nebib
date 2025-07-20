declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrScannerProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    constraints?: {
      video?: {
        facingMode?: string;
        width?: number;
        height?: number;
      };
    };
  }

  export default class QrScanner extends Component<QrScannerProps> {}
} 