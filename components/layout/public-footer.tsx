import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PublicFooter() {
  return (
    <footer className="py-12 text-white" style={{ backgroundColor: '#382606' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="ፍሬ Form Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <h3 className="text-xl font-semibold" style={{ color: '#f4be42' }}>
                ፍሬ Form
              </h3>
            </div>
            <p className="mb-4 opacity-80">
              ፎርሞችን በቀላሉ ይፍጠሩ፣ ያስተዳድሩ እና ይከታተሉ። QR ኮዶች ይፍጠሩ፣ ምላሾች ይሰብስቡ 
              እና መረጃ በአንድ ኃይለኛ መድረክ ውስጥ ይተነትኑ።
            </p>
            <div className="flex space-x-4">
              <Badge style={{ backgroundColor: '#f4be42', color: 'white' }}>
                ፎርሞች
              </Badge>
              <Badge style={{ backgroundColor: '#f4be42', color: 'white' }}>
                QR ኮዶች
              </Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: '#f4be42' }}>
              ፈጣን አገናኞች
            </h4>
            <ul className="space-y-2 opacity-80">
              <li><a href="/features" className="hover:opacity-100 transition-opacity">ባህሪያት</a></li>
              <li><a href="/examples" className="hover:opacity-100 transition-opacity">አብነቶች</a></li>
              <li><a href="/qr-demo" className="hover:opacity-100 transition-opacity">QR ማሳያ</a></li>
              <li><a href="/help" className="hover:opacity-100 transition-opacity">እርዳታ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: '#f4be42' }}>
              የአግኙን መረጃ
            </h4>
            <div className="space-y-2 opacity-80">
              <p>123 የንግድ መንገድ</p>
              <p>ከተማ፣ ክልል 12345</p>
              <p>(555) 123-4567</p>
              <p>info@nebib.com</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 opacity-20" />
        
        <div className="text-center opacity-80">
          <p>&copy; 2025 ፍሬ Form. ሁሉም መብቶች የተጠበቁ ናቸው።</p>
        </div>
      </div>
    </footer>
  );
} 