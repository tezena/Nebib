"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface QRGeneratorProps {
  userId: string;
  formId: string;
  formData?: any;
  className?: string;
}

export default function QRGenerator({ userId, formId, formData, className }: QRGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Create QR code data with user and form information
  const generateQRData = () => {
    const qrData = {
      userId,
      formId,
      timestamp: new Date().toISOString(),
      formData: formData || {},
      type: "attendance"
    };
    return JSON.stringify(qrData);
  };

  // Generate QR code
  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrData = generateQRData();
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      setQrCodeDataUrl(dataUrl);
      toast.success("QR Code generated successfully!");
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement("a");
    link.download = `qr-code-${userId}-${formId}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded!");
  };

  // Copy QR code data to clipboard
  const copyQRData = async () => {
    try {
      const qrData = generateQRData();
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      toast.success("QR Code data copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy QR code data");
    }
  };

  // Auto-generate QR code on component mount
  useEffect(() => {
    generateQRCode();
  }, [userId, formId]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Attendance QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : qrCodeDataUrl ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                className="border border-gray-200 rounded-lg"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={downloadQRCode}
                className="flex-1 gap-2"
                variant="outline"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              
              <Button 
                onClick={copyQRData}
                className="flex-1 gap-2"
                variant="outline"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Data
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              <p>User ID: {userId}</p>
              <p>Form ID: {formId}</p>
              <p>Generated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No QR code generated</p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={generateQRCode}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Regenerate QR Code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 