'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero.jpg')",
          filter: "brightness(0.4)"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg p-0">
            <Image
              src="/logo.png"
              alt=" Logo"
              width={48}
              height={48}
              className="w-32 h-32 rounded-full"
            />
          </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            ፍሬ Form
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            የፎርም አፈጣጠር፣ አስተዳደር እና የመረጃ ስብሰባ ለማድረግ ቀላል መፍትሄ። QR ኮዶች ይፍጠሩ፣ ምላሾች ይሰብስቡ እና መረጃ ይተነትኑ።
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-white border-0 px-8 py-4 text-lg"
            style={{ backgroundColor: '#f4be42' }}
          >
            አሁኑኑ ይጀምሩ
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg"
          >
            ተጨማሪ ይማሩ
          </Button>
        </div>
      </div>
    </div>
  );
};

const ServiceTimes = () => {
  const services = [
    { day: "ፎርም አፈጣጠር", time: "ቀላል", service: "የፎርም ንድፍ" },
    { day: "QR ኮድ", time: "ፈጣን", service: "ማግኛ ኮድ" },
    { day: "መረጃ ስብሰባ", time: "አስተማማኝ", service: "ምላሾች" },
    { day: "ትንተና", time: "ዝግጅት", service: "የመረጃ ሪፖርት" }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            ዋና ባህሪያት
          </h2>
          <p className="text-lg" style={{ color: '#382606', opacity: 0.8 }}>
            ፍሬ Form የሚሰጣቸው ዋና ዋና ባህሪያት
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 mx-auto mb-4" style={{ color: '#f4be42' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#382606' }}>
                  {service.day}
                </h3>
                <p className="text-lg font-medium mb-2" style={{ color: '#f4be42' }}>
                  {service.time}
                </p>
                <p className="text-sm" style={{ color: '#382606', opacity: 0.7 }}>
                  {service.service}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#382606' }}>
              አግኙን
            </h2>
            <p className="text-lg" style={{ color: '#382606', opacity: 0.8 }}>
              ከእናንተ መስማት እንወዳለን። መልእክት ይላኩልን እና በተቻለ ፍጥነት እንመልሳለን።
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#382606' }}>መልእክት ይላኩልን</CardTitle>
                <CardDescription>
                  ከታች ያለውን ፎርም ይሙሉ እና እንመልሳለን
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">የመጀመሪያ ስም</Label>
                    <Input 
                      id="firstName" 
                      placeholder="የመጀመሪያ ስምዎ"
                      className="focus:border-[#f4be42] focus:ring-[#f4be42]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">የአባት ስም</Label>
                    <Input 
                      id="lastName" 
                      placeholder="የአባት ስምዎ"
                      className="focus:border-[#f4be42] focus:ring-[#f4be42]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">ኢሜይል</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="your.email@example.com"
                    className="focus:border-[#f4be42] focus:ring-[#f4be42]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">ስልክ ቁጥር</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="focus:border-[#f4be42] focus:ring-[#f4be42]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inquiry">የጥያቄ አይነት</Label>
                  <Select>
                    <SelectTrigger className="focus:border-[#f4be42] focus:ring-[#f4be42]" style={{ backgroundColor: '#f7f7f7' }}>
                      <SelectValue placeholder="አንዱን ይምረጡ" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: '#f7f7f7' }}>
                      <SelectItem value="general">አጠቃላይ መረጃ</SelectItem>
                      <SelectItem value="support">ድጋፍ</SelectItem>
                      <SelectItem value="feature">አዲስ ባህሪ</SelectItem>
                      <SelectItem value="bug">ስህተት ሪፖርት</SelectItem>
                      <SelectItem value="demo">ማሳያ</SelectItem>
                      <SelectItem value="other">ሌላ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">መልእክት</Label>
                  <Textarea 
                    id="message" 
                    placeholder="እንዴት እንደምንረዳዎ ይንገሩን..."
                    rows={5}
                    className="focus:border-[#f4be42] focus:ring-[#f4be42]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter" className="text-sm">
                    የሶፍትዌሩን ዜና እና ዝማኔዎች መቀበል እፈልጋለሁ
                  </Label>
                </div>
                
                <Button 
                  className="w-full text-white border-0 py-3 text-lg"
                  style={{ backgroundColor: '#f4be42' }}
                >
                  መልእክት ላክ
                </Button>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: '#382606' }}>አግኙን</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 mt-1" style={{ color: '#f4be42' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#382606' }}>
                        123 የንግድ መንገድ
                      </p>
                      <p style={{ color: '#382606', opacity: 0.7 }}>
                        ከተማ፣ ክልል 12345
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 mt-1" style={{ color: '#f4be42' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#382606' }}>
                        (555) 123-4567
                      </p>
                      <p style={{ color: '#382606', opacity: 0.7 }}>
                        የስራ ሰዓት: ሰኞ-አርብ 9AM-5PM
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 mt-1" style={{ color: '#f4be42' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#382606' }}>
                        info@nebib.com
                      </p>
                      <p style={{ color: '#382606', opacity: 0.7 }}>
                        በ24 ሰዓት ውስጥ እንመልሳለን
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-16" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#382606' }}>
            ስለ ፍሬ Form
          </h2>
          <p className="text-lg mb-8" style={{ color: '#382606', opacity: 0.8 }}>
           ፍሬ Form የፎርም አፈጣጠር፣ አስተዳደር እና የመረጃ ስብሰባ ለማድረግ 
            የተዘጋጀ ዘመናዊ የሶፍትዌር መፍትሄ ነው። ቀላል፣ ፈጣን እና 
            አስተማማኝ የፎርም አገልግሎት ይሰጣል።
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg p-0">
                <Image
                  src="/logo.png"
                  alt=" Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#382606' }}>
                ቀላል አጠቃቀም
              </h3>
              <p style={{ color: '#382606', opacity: 0.7 }}>
                የተለያዩ የፎርም አይነቶችን በቀላሉ ይፍጠሩ እና ያስተዳድሩ
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f4be42' }}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#382606' }}>
                QR ኮዶች
              </h3>
              <p style={{ color: '#382606', opacity: 0.7 }}>
                ለፎርሞችዎ ፈጣን QR ኮዶች ይፍጠሩ እና በቀላሉ ያጋሩ
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f4be42' }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#382606' }}>
                መረጃ ትንተና
              </h3>
              <p style={{ color: '#382606', opacity: 0.7 }}>
                የተሰበሰቡ መረጃዎችን ተንተን እና ዝግጅት ያድርጉ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServiceTimes />
      <AboutSection />
      <ContactForm />
    </div>
  );
}