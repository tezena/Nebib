import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, QrCode, BarChart3, Users, Shield, Smartphone, Database, Globe, CheckCircle, Calendar, Mail, Settings, Download, Upload, Eye, Clock, TrendingUp, Camera, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 text-white border-0" style={{ backgroundColor: '#f4be42' }}>
          ⚡ ኃይለኛ ባህሪያት
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#382606' }}>
          ዘመናዊ ፎርም አስተዳደር ለሚያስፈልጉ ሁሉም ነገር
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
          ከአብሮገነት የፎርም ግንባታ እስከ የላቀ QR ኮድ ተገኝነት ክትትል ድረስ፣ 
          ፍሬ Form ከGoogle Forms የተሻለ ሙሉ መፍትሄ ይሰጣል።
        </p>
      </section>

      {/* Form Builder Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            አብሮገነት የፎርም ገንቢ
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            ከአብሮገነት የመስመር ላይ አርትዖት በይነገጽ የሙያዊ ፎርሞች ይፍጠሩ - ከGoogle Forms የተሻለ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የመስመር ላይ አርትዖት በይነገጽ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                "የምታየው የምታገኘው ነው" በሚለው አብሮገነት የመስመር ላይ አርትዖት። ሁሉንም ነገር በቀጥታ በቅድሚያ እይታ ውስጥ ያርትዑ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>በርካታ የመስኮች አይነቶች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የጽሑፍ፣ ኢሜይል፣ ቁጥር፣ ቀን፣ ቼክቦክስ፣ የጽሑፍ አካባቢ፣ የምርጫ ዝርዝሮች እና የፋይል ማስገባት ድጋፍ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>አንድ-ገጽ ገንቢ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የተወሳሰቡ ባለብዙ-ደረጃ ሂደቶች የሉም። ፎርሞችን ይፍጠሩ፣ ያርትዑ እና በአንድ የማያልቅ በይነገጽ ያሰራጩ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የፋይል ማስገባት ድጋፍ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ተጠቃሚዎች ሰነዶች፣ ምስሎች እና ሌሎች ፋይሎችን በመጠን እና በአይነት ገደቦች ይሰጥ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የማረጋገጫ ህጎች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የሚያስፈልጉ መስኮች፣ የቅርጸት ማረጋገጫ እና ለመረጃ አጠቃላይነት ልዩ የማረጋገጫ ህጎች ያዘጋጁ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የህዝብ ፎርሞች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ፎርሞችን በህዝብ አገናኞች ከማንም ጋር ያጋሩ። ለፎርም ማስገባት ምዝገባ አያስፈልግም።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የተነደፈ የእርዳታ ስርዓት</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የተሟላ የእርዳታ መመሪያዎች፣ ችግር መፍታት እና ወደ መድረኩ የተዋሃደ ፈጣን ድጋፍ።
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* QR Code Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            የላቀ QR ኮድ ተገኝነት ስርዓት
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            ለእያንዳንዱ ተማሪ ልዩ QR ኮዶች ይፍጠሩ እና በቀጣይ ስካን ተገኝነት ይክትቱ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>ልዩ QR ኮዶች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ለእያንዳንዱ ተማሪ ልዩ QR ኮዶች ይፍጠሩ ከመረጃቸው ጋር ለአስተማማኝ ተገኝነት ክትትል የተካተተ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>ቀጣይ ስካን</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                አስተዳዳሪ የተማሪዎች QR ኮዶችን ለፈጣን ተገኝነት ምልክት በቀጣይ ስካን ችሎታ ይስካን።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>በትክክለኛ ጊዜ ክትትል</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                በትክክለኛ ጊዜ ተገኝነትን በፈጣን ዝማኔዎች እና ለማይገኙ ተማሪዎች ማሳወቂያዎች ይክትቱ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>QR ኮድ ማውረዶች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ተማሪዎች የእነሱን QR ኮዶች እንደ ምስሎች ወይም PDFዎች ለቀላል መዳረሻ እና ለመስተማር ማውረድ ይችላሉ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የተገኝነት ታሪክ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ዝርዝር የተገኝነት ታሪክን ከጊዜ ምልክቶች እና በጊዜ ሂደት የተገኝነት ቅደም ተከተሎች ጋር ይጠብቁ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የራስ-ሰር ማሳወቂያዎች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ስለ ተገኝነት ሁኔታ ለወላጆች ወይም ለተጠባባቂዎች የራስ-ሰር ማሳወቂያዎች ይላኩ።
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Analytics Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            ኃይለኛ ትንተና እና ሪፖርት
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            ወደ ፎርም ማስገባቶች፣ የተገኝነት መጠኖች እና ዝርዝር ሪፖርቶች ይፍጠሩ ግንዛቤ ያግኙ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>በትክክለኛ ጊዜ ትንተና</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ፎርም ማስገባቶች፣ የተገኝነት መጠኖች እና የተጠቃሚ ተሳትፎ በትክክለኛ ጊዜ ዳሽቦርዶች ይክትቱ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የአፈጻጸም መለኪያዎች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የፎርም አፈጻጸም፣ የማጠናቀቂያ መጠኖች ይክትቱ እና ለማሻሻል አካባቢዎችን ይለዩ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>ሪፖርቶች ማውጣት</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                መረጃን በበርካታ ቅርጸቶች ማውጣት CSV፣ Excel እና PDF ለተጨማሪ ትንተና።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የተጠቃሚ ትንተና</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የተጠቃሚ ባህሪ፣ የፎርም ማጠናቀቂያ ቅደም ተከተሎች እና የህዝብ ቆጠራ ግንዛቤዎች ይክትቱ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የምስል ዳሽቦርዶች</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የሚያምሩ የምስል አቀራረቦች ከገበታዎች፣ ግራፎች እና በይነገጽ ዳሽቦርዶች ጋር።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የታሪክ መረጃ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የታሪክ መረጃ እና አዝማሚያዎችን ይድረሱ በመረጃ የተመሰረቱ ውሳኔዎች ለመውሰድ እና በጊዜ ሂደት እድገትን ለመክትት።
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Security Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            የድርጅት-ደረጃ ደህንነት
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            የእርስዎ መረጃ በድርጅት-ደረጃ ደህንነት እና የግላዊነት እርምጃዎች የተጠበቀ ነው
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የመረጃ ምስጢር ማስተርሰያ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ሁሉም መረጃ በመጓዝ እና በማረፊያ በኢንዱስትሪ-መስፈርት ምስጢር ማስተርሰያ ፕሮቶኮሎች የተመስጠረ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>አስተማማኝ ማከማቻ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                መረጃ በአስተማማኝ፣ ተጨማሪ የደመና መሠረተ-ልማት ከራስ-ሰር የመመለሻ ቅጂዎች ጋር ይቀመጣል።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የተጠቃሚ ማረጋገጫ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                አስተማማኝ የተጠቃሚ ማረጋገጫ ከባለብዙ-አካል ማረጋገጫ እና በሚና የተመሰረተ የመዳረሻ ቁጥጥር።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>GDPR ተከተል</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                ሙሉ GDPR ተከተል ከመረጃ ጥበቃ፣ የግላዊነት ቁጥጥሮች እና የተጠቃሚ ፈቃድ አስተዳደር ጋር።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>የሞባይል ደህንነት</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                አስተማማኝ የሞባይል መዳረሻ ከባዮሜትሪክ ማረጋገጫ እና የተመስጠረ የመረጃ ማስተላልፍ።
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle style={{ color: '#382606' }}>24/7 ድጋፍ</CardTitle>
              <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                የሙሉ ጊዜ ቴክኒካል ድጋፍ እና የደህንነት ክትትል የእርስዎ መረጃ ሁልጊዜ እንዲጠበቅ ለማረጋገጥ።
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            የፎርም አስተዳደር ወደፊት ለማየት ዝግጁ ነዎት?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            የፎርም ፍጠራ እና ተገኝነት ክትትል ለማሻሻል ፍሬ Form ን የሚጠቀሙ በሺዎች የሚቆጠሩ ድርጅቶች ይቀላቀሉ።
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="text-lg px-8 py-6 text-white border-0" style={{ backgroundColor: '#f4be42' }}>
                ነፃ ይጀምሩ
              </Button>
            </Link>
            <Link href="/examples">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" style={{ borderColor: '#f4be42', color: '#f4be42' }}>
                አብነቶች ይመልከቱ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 