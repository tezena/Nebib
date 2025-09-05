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
    name: "ያሬድ አለማየሁ",
    email: "yared.alemayehu@example.com",
    studentId: "STU2024001",
    course: "የኮምፒዩተር ሳይንስ",
    department: "ምህንድስና"
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <Badge className="mb-4 sm:mb-6 text-white border-0 text-sm sm:text-base" style={{ backgroundColor: '#f4be42' }}>
          📱 QR ኮድ ቴክኖሎጂ ማሳያ
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4" style={{ color: '#382606' }}>
          QR ኮድ ስለት ያስተውሉ
        </h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4" style={{ color: '#382606', opacity: 0.8 }}>
          የላቀ QR ኮድ ፍጠራ እና የአስተዳዳሪ ክፍል ስካን ባህሪያትን ይሞክሩ። ለተማሪዎች QR ኮዶች ይፍጠሩ 
          እና የአስተዳዳሪ ስካን ሂደቱን ለፈጣን ተገኝነት ምልክት ያስተውሉ።
        </p>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-800">
            <TabsTrigger value="generator" className="flex items-center gap-2 text-sm sm:text-base data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR ገንቢ</span>
              <span className="sm:hidden">ገንቢ</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2 text-sm sm:text-base data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">QR ስካነር</span>
              <span className="sm:hidden">ስካነር</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* QR Generator */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl" style={{ color: '#382606' }}>
                    <QrCode className="w-5 h-5" />
                    QR ኮድ ይፍጠሩ
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base" style={{ color: '#382606', opacity: 0.7 }}>
                    ለተገኝነት ክትትል የተማሪ ፎርም ማስገባት መረጃ ያለው QR ኮድ ይፍጠሩ
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
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl" style={{ color: '#382606' }}>
                    <Users className="w-5 h-5" />
                    የማሳያ ተማሪ መረጃ
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base" style={{ color: '#382606', opacity: 0.7 }}>
                    በQR ኮድ ውስጥ የሚካተት የተማሪ መረጃ ናሙና
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(demoFormData).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium" style={{ color: '#382606' }}>
                          {key === 'name' ? 'ስም' : 
                           key === 'email' ? 'ኢሜይል' : 
                           key === 'studentId' ? 'የተማሪ መለያ' : 
                           key === 'course' ? 'ኮርስ' : 
                           key === 'department' ? 'ክፍል' : key}:
                        </span>
                        <span className="text-sm" style={{ color: '#382606', opacity: 0.7 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl" style={{ color: '#382606' }}>QR ኮድ ፍጠራ እንዴት ይሰራል</CardTitle>
                <CardDescription className="text-sm sm:text-base" style={{ color: '#382606', opacity: 0.7 }}>
                  ለተገኝነት ክትትል QR ኮዶችን ለመፍጠር እና ለመጠቀም የሂደቱን መረዳት
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: '#382606' }}>ተማሪ ፎርም ያስገባል</h3>
                    <p className="text-sm" style={{ color: '#382606', opacity: 0.7 }}>
                      ተማሪ የምዝገባ ፎርሙን ከግላዊ መረጃቸው ጋር ያጠናቅቃል
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: '#382606' }}>QR ኮድ ይፈጠራል</h3>
                    <p className="text-sm" style={{ color: '#382606', opacity: 0.7 }}>
                      ስርዓቱ ከተካተተ የተማሪ መረጃ ጋር ልዩ QR ኮድ በራስ-ሰር ይፈጥራል
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: '#382606' }}>አስተዳዳሪ ኮድ ይስካን</h3>
                    <p className="text-sm" style={{ color: '#382606', opacity: 0.7 }}>
                      አስተዳዳሪ QR ኮዱን ይስካን በፈጣን ተገኝነት ለማስቀመጥ እና የተማሪ መረጃ ለማግኘት
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
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl" style={{ color: '#382606' }}>
                    <Camera className="w-5 h-5" />
                    QR ኮድ ስካነር
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base" style={{ color: '#382606', opacity: 0.7 }}>
                    የተማሪ QR ኮዶችን ለመንበብ እና ተገኝነት ለማስቀመጥ የአስተዳዳሪ ስካነር
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
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl" style={{ color: '#382606' }}>
                    <Clock className="w-5 h-5" />
                    የስካን ታሪክ
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base" style={{ color: '#382606', opacity: 0.7 }}>
                    የቅርብ QR ኮድ ስካኖች እና የተገኝነት ምዝገባዎች
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {scanHistory.length === 0 ? (
                      <div className="text-center py-8" style={{ color: '#382606', opacity: 0.5 }}>
                        <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">እስካሁን ስካኖች የሉም። QR ኮድ ለመስካን ይሞክሩ!</p>
                      </div>
                    ) : (
                      scanHistory.map((scan, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: '#382606' }}>
                              {scan.data}
                            </p>
                            <p className="text-xs" style={{ color: '#382606', opacity: 0.5 }}>
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
                <CardTitle className="text-lg sm:text-xl" style={{ color: '#382606' }}>የስካነር ባህሪያት</CardTitle>
                <CardDescription className="text-sm sm:text-base" style={{ color: '#382606', opacity: 0.7 }}>
                  ተገኝነት ክትትልን የማያልቅ እና ውጤታማ የሚያደርጉ የላቀ ባህሪያት
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium text-sm" style={{ color: '#382606' }}>ቀጣይ ስካን</h4>
                    <p className="text-xs mt-1" style={{ color: '#382606', opacity: 0.7 }}>
                      ስካነር ለበርካታ ተማሪዎች ንቁ ይሆናል
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-medium text-sm" style={{ color: '#382606' }}>ፈጣን ማረጋገጫ</h4>
                    <p className="text-xs mt-1" style={{ color: '#382606', opacity: 0.7 }}>
                      የተማሪ መረጃ በትክክለኛ ጊዜ ማረጋገጫ
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-medium text-sm" style={{ color: '#382606' }}>ተገኝነት ክትትል</h4>
                    <p className="text-xs mt-1" style={{ color: '#382606', opacity: 0.7 }}>
                      ራስ-ሰር የተገኝነት ምልክት እና ምዝገባዎች
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <RefreshCw className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h4 className="font-medium text-sm" style={{ color: '#382606' }}>በትክክለኛ ጊዜ ዝማኔዎች</h4>
                    <p className="text-xs mt-1" style={{ color: '#382606', opacity: 0.7 }}>
                      ወደ ተገኝነት ዳታቤዝ ቀጥተኛ ዝማኔዎች
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            QR ኮድ ተገኝነት ለመተግበር ዝግጁ ነዎት?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            ለተለያዩ ተገኝነት ክትትል የፍሬ Form የQR ኮድ ቴክኖሎጂ ሙሉ ኃይል ያስተውሉ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="text-lg px-8 py-6 text-white border-0" style={{ backgroundColor: '#f4be42' }}>
                ነፃ ይጀምሩ
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" style={{ borderColor: '#f4be42', color: '#f4be42' }}>
                ተጨማሪ ይማሩ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 