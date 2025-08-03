"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, QrCode, Camera, Download, Copy, Check, RefreshCw, Smartphone, Users, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import QRGenerator from "@/components/qr-code/qr-generator";
import QRScanner from "@/components/qr-code/qr-scanner";
import { toast } from "sonner";


export default function QRDemoPage() {
  const [activeTab, setActiveTab] = useState("generator");
  const [scanHistory, setScanHistory] = useState<Array<{ data: string; timestamp: string; status: string }>>([]);

  const handleScan = (qrData: string) => {
    const newScan = {
      data: qrData,
      timestamp: new Date().toLocaleString(),
      status: "Success"
    };
    setScanHistory(prev => [newScan, ...prev.slice(0, 9)]); // Keep last 10 scans
    toast.success("QR Code scanned successfully!");
  };

  const handleScanError = (error: string) => {
    toast.error(`Scan error: ${error}`);
  };

  const demoFormData = {
    name: "John Doe",
    email: "john.doe@example.com",
    studentId: "STU2024001",
    course: "Computer Science",
    department: "Engineering"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-sm sm:text-base">
          📱 QR Code Technology Demo
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent px-4">
          Experience QR Code Magic
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Test our advanced QR code generation and admin-side scanning features. Generate QR codes for students 
          and experience the admin scanning process for instant attendance marking.
        </p>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-800">
            <TabsTrigger value="generator" className="flex items-center gap-2 text-sm sm:text-base data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Generator</span>
              <span className="sm:hidden">Generator</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2 text-sm sm:text-base data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">QR Scanner</span>
              <span className="sm:hidden">Scanner</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* QR Generator */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800 dark:text-white">
                    <QrCode className="w-5 h-5" />
                    Generate QR Code
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Create a QR code with student form submission data for attendance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRGenerator
                    userId="demo-user-123"
                    formId="demo-form-456"
                    formData={demoFormData}
                    className="border-0 shadow-none"
                  />
                </CardContent>
              </Card>

              {/* Demo Data */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800 dark:text-white">
                    <Users className="w-5 h-5" />
                    Demo Student Data
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Sample student information that will be embedded in the QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(demoFormData).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-gray-800 dark:text-white">How QR Code Generation Works</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Understanding the process of creating and using QR codes for attendance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Student Submits Form</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Student completes the registration form with their personal information
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">QR Code Generated</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      System automatically generates a unique QR code with embedded student data
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Admin Scans Code</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Admin scans the QR code to instantly mark attendance and retrieve student info
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* QR Scanner */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800 dark:text-white">
                    <Camera className="w-5 h-5" />
                    QR Code Scanner
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Admin-side scanner for reading student QR codes and marking attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRScanner
                    onScan={handleScan}
                    onError={handleScanError}
                    className="border-0 shadow-none"
                  />
                </CardContent>
              </Card>

              {/* Scan History */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800 dark:text-white">
                    <Clock className="w-5 h-5" />
                    Scan History
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Recent QR code scans and attendance records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {scanHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No scans yet. Try scanning a QR code!</p>
                      </div>
                    ) : (
                      scanHistory.map((scan, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                              {scan.data}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {scan.timestamp}
                            </p>
                          </div>
                          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs">
                            {scan.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scanner Features */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-gray-800 dark:text-white">Scanner Features</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Advanced features that make attendance tracking seamless and efficient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">Continuous Scanning</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Scanner stays active for multiple students
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">Instant Validation</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Real-time verification of student data
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">Attendance Tracking</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Automatic attendance marking and records
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <RefreshCw className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">Real-time Updates</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Live updates to attendance database
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Ready to Implement QR Code Attendance?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the full power of NEBIB's QR code technology for seamless attendance tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Get Started Free
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 