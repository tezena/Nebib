'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { CheckCircle, XCircle, Camera, AlertTriangle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function QRScanner({ onScan, onError, className = '' }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string>('');
  const [scanAttempts, setScanAttempts] = useState(0);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const [isInitialized, setIsInitialized] = useState(false);

  const handleScan = (result: string) => {
    console.log('🔍 QR Scanner: Scan detected:', result);
    setScanAttempts(prev => prev + 1);
    setLastScanned(result);
    setError('');
    setSuccess('QR Code detected!');
    
    try {
      onScan(result);
    } catch (err) {
      console.error('❌ QR Scanner: Error in onScan callback:', err);
      setError('Error processing QR code');
      onError?.(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleError = (error: unknown) => {
    console.error('❌ QR Scanner: Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    setError(errorMessage);
    setSuccess('');
    onError?.(errorMessage);
  };

  const handleStartScanning = async () => {
    try {
      console.log('🚀 QR Scanner: Starting scanner...');
      setError('');
      setSuccess('');
      setIsScanning(true);
      setScanAttempts(0);
      
      // Check camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission('granted');
      stream.getTracks().forEach(track => track.stop());
      setIsInitialized(true);
      
      console.log('✅ QR Scanner: Scanner started successfully');
    } catch (err) {
      console.error('❌ QR Scanner: Failed to start scanner:', err);
      setError('Failed to access camera. Please check permissions.');
      setCameraPermission('denied');
      setIsScanning(false);
    }
  };

  const handleStopScanning = () => {
    console.log('🛑 QR Scanner: Stopping scanner...');
    setIsScanning(false);
    setSuccess('');
    setError('');
  };

  const handleTestQR = () => {
    const testData = JSON.stringify({
      formId: 'test-form-123',
      studentId: 'test-student-456',
      timestamp: new Date().toISOString()
    });
    console.log('🧪 QR Scanner: Testing with data:', testData);
    handleScan(testData);
  };

  useEffect(() => {
    console.log('🔧 QR Scanner: Component mounted');
    return () => {
      console.log('🧹 QR Scanner: Component unmounting');
    };
  }, []);

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Permission Status */}
        <div className="flex items-center gap-2">
          <Badge variant={cameraPermission === 'granted' ? 'default' : 'secondary'}>
            Camera: {cameraPermission === 'granted' ? 'Ready' : cameraPermission === 'denied' ? 'Denied' : 'Unknown'}
          </Badge>
          <Badge variant={isScanning ? 'default' : 'secondary'}>
            Status: {isScanning ? 'Scanning' : 'Stopped'}
          </Badge>
        </div>

        {/* Scanner Controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={handleStartScanning} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Start Scanner
            </Button>
          ) : (
            <Button onClick={handleStopScanning} variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Stop Scanner
            </Button>
          )}
          <Button onClick={handleTestQR} variant="outline" size="sm">
            Test QR
          </Button>
        </div>

        {/* Scanner Display */}
        {isScanning && isInitialized && (
          <div className="relative border rounded-lg overflow-hidden bg-black">
            <Scanner
              onScan={(detectedCodes) => {
                if (detectedCodes.length > 0) {
                  handleScan(detectedCodes[0].rawValue);
                }
              }}
              onError={handleError}
              constraints={{
                facingMode: 'environment',
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 }
              }}
              formats={['qr_code']}
              classNames={{
                container: "w-full h-64"
              }}
            />
            <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 border-solid"></div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Debug Information */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Scan Attempts:</span>
            <Badge variant="outline">{scanAttempts}</Badge>
          </div>
          {lastScanned && (
            <div className="space-y-1">
              <span className="font-medium">Last Scanned:</span>
              <div className="p-2 bg-gray-100 rounded text-xs break-all">
                {lastScanned}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Point camera at QR code</p>
          <p>• Ensure good lighting</p>
          <p>• Keep QR code within the frame</p>
          <p>• Use "Test QR" to simulate a scan</p>
        </div>
      </CardContent>
    </Card>
  );
} 