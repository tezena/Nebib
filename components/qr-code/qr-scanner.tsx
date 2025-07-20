"use client";

import { useState, useEffect, useRef } from "react";
import QrScanner from "react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  CameraOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Clock,
  QrCode,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
  formId: string;
  onAttendanceMarked: (userId: string, status: 'present' | 'absent' | 'late') => void;
  className?: string;
}

interface ScannedData {
  userId: string;
  formId: string;
  timestamp: string;
  formData: any;
  type: string;
}

interface ScanResult {
  userId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
  success: boolean;
  message: string;
}

export default function QRScanner({ formId, onAttendanceMarked, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const scannerRef = useRef<QrScanner>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Request camera permission
  const requestCameraPermission = async () => {
    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("MediaDevices API not available");
      setHasPermission(false);
      setCameraError("Camera API not available. This may be due to using HTTP instead of HTTPS, or browser compatibility issues.");
      return;
    }

    try {
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      console.log("Camera permission granted, stream:", stream);
      stream.getTracks().forEach(track => {
        console.log("Track:", track.kind, track.getSettings());
        track.stop();
      });
      
      setHasPermission(true);
      setCameraError(null);
    } catch (error: any) {
      console.error("Camera permission denied:", error);
      
      // Try fallback configuration
      try {
        console.log("Trying fallback camera configuration...");
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'user', // Try front camera
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        console.log("Fallback camera permission granted");
        fallbackStream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
        setCameraError(null);
      } catch (fallbackError) {
        console.error("Fallback camera also failed:", fallbackError);
        setHasPermission(false);
        
        // Provide more specific error messages
        if (fallbackError.name === 'NotAllowedError') {
          setCameraError("Camera access denied. Please allow camera permissions in your browser settings.");
        } else if (fallbackError.name === 'NotFoundError') {
          setCameraError("No camera found on this device.");
        } else if (fallbackError.name === 'NotReadableError') {
          setCameraError("Camera is in use by another application. Please close other apps using the camera.");
        } else if (fallbackError.name === 'OverconstrainedError') {
          setCameraError("Camera constraints not supported. Try using a different browser or device.");
        } else if (fallbackError.name === 'NotSupportedError') {
          setCameraError("Camera not supported. This may be due to using HTTP instead of HTTPS. Try accessing via HTTPS.");
        } else {
          setCameraError(`Camera access failed: ${fallbackError.message || 'Unknown error'}`);
        }
      }
    }
  };

  // Start scanning
  const startScanning = async () => {
    if (hasPermission === false) {
      await requestCameraPermission();
      return;
    }
    
    setIsScanning(true);
    setCameraError(null);
    
    // Get camera stream for video display
    try {
      console.log("Starting camera stream for scanning...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        } 
      });
      
      setCameraStream(stream);
      
      // Set the video element source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
      
      console.log("Camera stream started for scanning");
    } catch (error: any) {
      console.error("Error starting camera stream:", error);
      setCameraError("Failed to start camera stream. Please try again.");
    }
  };

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false);
    
    // Stop camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Handle QR code scan
  const handleScan = async (data: string | null) => {
    console.log("🔍 QR Scan attempt:", { data, type: typeof data, isProcessing });
    
    if (!data || isProcessing) {
      console.log("❌ Scan skipped:", !data ? "No data" : "Already processing");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Validate that data is a valid string before parsing
      if (typeof data !== 'string' || data.trim() === '') {
        throw new Error("Invalid QR code data");
      }

      // Check if data is "undefined" string
      if (data === "undefined" || data === "null") {
        throw new Error("QR code contains invalid data");
      }

      console.log("📝 Attempting to parse QR data:", data);
      const scannedData: ScannedData = JSON.parse(data);
      
      // Validate scanned data
      if (scannedData.type !== "attendance") {
        throw new Error("Invalid QR code type");
      }
      
      if (scannedData.formId !== formId) {
        throw new Error("QR code is not for this form");
      }

      // Check if already scanned recently (within 5 seconds)
      const recentScan = scanResults.find(
        result => result.userId === scannedData.userId && 
        new Date().getTime() - new Date(result.timestamp).getTime() < 5000
      );
      
      if (recentScan) {
        throw new Error("QR code already scanned recently");
      }

      // Send QR data to API for processing
      const response = await fetch('/api/qr-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ qrData: data })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process QR code');
      }

      const result = await response.json();

      // Create scan result
      const scanResult: ScanResult = {
        userId: result.data.userId,
        studentName: result.data.studentName,
        status: result.data.status,
        timestamp: result.data.timestamp,
        success: true,
        message: result.message
      };

      // Add to scan results
      setScanResults(prev => [scanResult, ...prev.slice(0, 9)]); // Keep last 10 results

      // Call parent callback
      onAttendanceMarked(result.data.userId, result.data.status);

      // Show success message
      toast.success(`${result.data.studentName} marked as ${result.data.status}`);

    } catch (error: any) {
      console.error("❌ Scan error:", error);
      
      let errorMessage = error.message || "Invalid QR code";
      
      // Provide more specific error messages
      if (error.message?.includes("JSON")) {
        errorMessage = "Invalid QR code format. Please ensure the QR code contains valid data.";
      } else if (error.message?.includes("Invalid QR code")) {
        errorMessage = "QR code data is invalid or corrupted.";
      }
      
      const errorResult: ScanResult = {
        userId: "unknown",
        studentName: "Unknown",
        status: 'absent',
        timestamp: new Date().toISOString(),
        success: false,
        message: errorMessage
      };

      setScanResults(prev => [errorResult, ...prev.slice(0, 9)]);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle camera errors
  const handleError = (error: any) => {
    console.error("Camera error:", error);
    
    let errorMessage = "Camera error. Please check your camera connection.";
    
    if (error.name === 'NotAllowedError') {
      errorMessage = "Camera access denied. Please allow camera permissions.";
    } else if (error.name === 'NotFoundError') {
      errorMessage = "No camera found. Please check your device has a camera.";
    } else if (error.name === 'NotReadableError') {
      errorMessage = "Camera is in use by another application.";
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = "Camera constraints not supported. Trying alternative settings.";
    }
    
    setCameraError(errorMessage);
    setIsScanning(false);
  };

  // Clear scan results
  const clearResults = () => {
    setScanResults([]);
  };

  // Test QR code data for debugging
  const testQRCode = () => {
    const testData = JSON.stringify({
      userId: "test-user-123",
      formId: formId,
      timestamp: new Date().toISOString(),
      formData: {
        name: "Test Student",
        email: "test@example.com"
      },
      type: "attendance"
    });
    
    handleScan(testData);
  };

  // Test camera stream directly
  const testCameraStream = async () => {
    try {
      console.log("Testing camera stream directly...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        } 
      });
      
      console.log("Camera stream obtained:", stream);
      console.log("Tracks:", stream.getTracks().map(track => ({
        kind: track.kind,
        settings: track.getSettings(),
        enabled: track.enabled
      })));
      
      // Test with main video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.border = '3px solid red';
        
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.style.border = '';
          }
          stream.getTracks().forEach(track => track.stop());
        }, 3000);
      }
      
      toast.success("Camera stream test successful! Check for red bordered video.");
      
    } catch (error: any) {
      console.error("Camera stream test failed:", error);
      toast.error(`Camera test failed: ${error.message}`);
    }
  };

  // Request permission on mount
  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Log when scanner is ready
  useEffect(() => {
    if (isScanning && hasPermission) {
      console.log("✅ QR Scanner is ready and scanning");
    }
  }, [isScanning, hasPermission]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasPermission === true ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Camera Ready
              </Badge>
            ) : hasPermission === false ? (
              <Badge className="bg-red-100 text-red-800">
                <XCircle className="w-3 h-3 mr-1" />
                Camera Denied
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Checking Camera
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {!isScanning ? (
              <Button 
                onClick={startScanning}
                disabled={hasPermission === false}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                Start Scanning
              </Button>
            ) : (
              <Button 
                onClick={stopScanning}
                variant="outline"
                className="gap-2"
              >
                <Pause className="w-4 h-4" />
                Stop Scanning
              </Button>
            )}
            
            <Button 
              onClick={testQRCode}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Test QR
            </Button>
            
            <Button 
              onClick={() => {
                const qrData = prompt("Enter QR code data (JSON):");
                if (qrData) {
                  handleScan(qrData);
                }
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Manual QR
            </Button>
          </div>
        </div>

        {/* Camera Error */}
        {cameraError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{cameraError}</span>
            </div>
          </div>
        )}

        {/* Scanner */}
        {isScanning && hasPermission && navigator.mediaDevices && (
          <div className="relative">
            {/* Custom Video Display */}
            <video
              ref={videoRef}
              style={{ 
                width: '100%', 
                height: '300px',
                objectFit: 'cover',
                backgroundColor: '#000'
              }}
              autoPlay
              playsInline
              muted
            />
            
            {/* Hidden QR Scanner for processing */}
            <div style={{ display: 'none' }}>
              <QrScanner
                ref={scannerRef}
                delay={300}
                onError={handleError}
                onScan={handleScan}
                constraints={{
                  video: {
                    facingMode: 'environment',
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                    aspectRatio: { ideal: 16/9 }
                  }
                }}
              />
            </div>
            
            {/* Camera status indicator */}
            <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              Camera Active
            </div>
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-blue-500 rounded-lg relative">
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <QrCode className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                Processing...
              </div>
            )}
            
            {/* Debug info */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Scanning for QR codes...
            </div>
            
            {/* Fallback camera test */}
            <div className="absolute bottom-4 right-4">
              <Button 
                onClick={testCameraStream}
                variant="outline"
                size="sm"
                className="bg-black bg-opacity-50 text-white border-white"
              >
                Test Camera
              </Button>
            </div>
          </div>
        )}

        {/* Scan Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent Scans ({scanResults.length})
            </h3>
            {scanResults.length > 0 && (
              <Button 
                onClick={clearResults}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {scanResults.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <QrCode className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No scans yet</p>
              </div>
            ) : (
              scanResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium">{result.studentName}</span>
                      {result.success && (
                        <Badge 
                          className={
                            result.status === 'present' ? 'bg-green-100 text-green-800' :
                            result.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {result.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Instructions:</p>
          <ul className="space-y-1">
            <li>• Point camera at student's QR code</li>
            <li>• QR code should contain user ID and form data</li>
            <li>• Attendance will be automatically marked</li>
            <li>• Recent scans are shown below</li>
            <li>• Use "Test QR" button to test without camera</li>
          </ul>
          
          {hasPermission === false && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700 font-medium">Camera Access Required</p>
              <p className="text-red-600 text-xs">
                Please allow camera access in your browser settings to use the QR scanner.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 