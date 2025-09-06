import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, ExternalLink, Users, FileText, Calendar, Mail, MapPin, GraduationCap, Building2, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ExampleFormPreview from "@/components/examples/example-form-preview";


const exampleForms = [
  {
    id: "student-registration",
    title: "የተማሪ ምዝገባ",
    description: "የተማሪ ምዝገባ ፎርም ከግላዊ ዝርዝሮች፣ የኮርስ ምርጫ እና የአስቸኳይ አግኙን መረጃ ጋር",
    category: "ትምህርት",
    fields: [
      { label: "ሙሉ ስም", type: "text", required: true },
      { label: "የተማሪ መለያ", type: "text", required: true },
      { label: "የኢሜይል አድራሻ", type: "email", required: true },
      { label: "የስልክ ቁጥር", type: "text", required: true },
      { label: "የተወለዱበት ቀን", type: "date", required: true },
      { label: "ኮርስ/ፕሮግራም", type: "select", required: true },
      { label: "አስቸኳይ አግኙን መረጃ", type: "text", required: true },
      { label: "የሕክምና መረጃ", type: "textarea", required: false },
    ],
    iconName: "graduation-cap",
    color: "from-blue-500 to-indigo-500",
    submissions: 2156,
    features: ["QR ኮድ ፍጠራ", "አቴንዳንስ ክትትል", "መረጃ ማውጣት"]
  },
  {
    id: "event-registration",
    title: "የዝግጅት ምዝገባ",
    description: "የሙያ የዝግጅት ምዝገባ ፎርም ለኮንፈረንሶች፣ ሠልፎች እና ስብሰቦች",
    category: "ዝግጅቶች",
    fields: [
      { label: "የመጀመሪያ ስም", type: "text", required: true },
      { label: "የመጨረሻ ስም", type: "text", required: true },
      { label: "ኢሜይል", type: "email", required: true },
      { label: "ኩባንያ/ድርጅት", type: "text", required: false },
      { label: "የስራ መደብ", type: "text", required: false },
      { label: "የምግብ ገደቦች", type: "text", required: false },
      { label: "ልዩ አቀማመጦች", type: "textarea", required: false },
      { label: "ዝማኔዎችን ለመቀበል እስማማለሁ", type: "checkbox", required: false },
    ],
    iconName: "calendar",
    color: "from-green-500 to-emerald-500",
    submissions: 1892,
    features: ["QR ቼክ-ኢን", "የተሳታፊ አስተዳደር", "በትክክለኛ ጊዜ ትንተና"]
  },
  {
    id: "job-application",
    title: "የስራ ማመልከቻ",
    description: "የሙያ የስራ ማመልከቻ ፎርም ለስራ አስተዳዳሪዎች እና የHR ክፍሎች",
    category: "HR",
    fields: [
      { label: "ሙሉ ስም", type: "text", required: true },
      { label: "ኢሜይል", type: "email", required: true },
      { label: "ስልክ", type: "text", required: true },
      { label: "ለሚያመልከቱት የስራ መደብ", type: "text", required: true },
      { label: "ሪዙሜ/CV", type: "file", required: true },
      { label: "የሽፋን ደብዳቤ", type: "textarea", required: false },
      { label: "የልምድ ዓመታት", type: "number", required: true },
      { label: "የሚጀምርበት ቀን", type: "date", required: true },
      { label: "የሚጠበቅ ደሞዝ", type: "number", required: false },
    ],
    iconName: "users",
    color: "from-purple-500 to-pink-500",
    submissions: 1567,
    features: ["ፋይል ማስገባት", "የማመልከቻ ክትትል", "የተመራጭ ዳታቤዝ"]
  },
  {
    id: "customer-feedback",
    title: "የደንበኛ አስተያየት",
    description: "ለምርት ማሻሻል የሚያስፈልጉ የደንበኛ ግንዛቤዎች እና አስተያየቶች ይሰብስቡ",
    category: "ግብይት",
    fields: [
      { label: "የደንበኛ ስም", type: "text", required: false },
      { label: "ኢሜይል", type: "email", required: false },
      { label: "የተጠቀመው ምርት/አገልግሎት", type: "text", required: true },
      { label: "ደረጃ (1-10)", type: "number", required: true },
      { label: "በጣም የወደዱት ምንድን ነው?", type: "textarea", required: false },
      { label: "ምን ማሻሻል እንችላለን?", type: "textarea", required: false },
      { label: "እኛን ታመራርሳለህ?", type: "checkbox", required: false },
      { label: "ለተጨማሪ አግኙን መረጃ", type: "checkbox", required: false },
    ],
    iconName: "file-text",
    color: "from-orange-500 to-red-500",
    submissions: 3341,
    features: ["የደረጃ ስርዓት", "የስሜት ትንተና", "የደንበኛ ግንዛቤዎች"]
  },
  {
    id: "product-order",
    title: "የምርት ትዕዛዝ ፎርም",
    description: "የተሻለ የትዕዛዝ ፎርም ለኢ-ኮሜርስ እና የአገልግሎት ንግዶች",
    category: "ኢ-ኮሜርስ",
    fields: [
      { label: "የደንበኛ ስም", type: "text", required: true },
      { label: "ኢሜይል", type: "email", required: true },
      { label: "ስልክ", type: "text", required: true },
      { label: "የማጓጓዣ አድራሻ", type: "textarea", required: true },
      { label: "የምርት ምርጫ", type: "select", required: true },
      { label: "ብዛት", type: "number", required: true },
      { label: "ልዩ መመሪያዎች", type: "textarea", required: false },
      { label: "የዜና ደብዳቤ ምዝገባ", type: "checkbox", required: false },
    ],
    iconName: "shopping-cart",
    color: "from-teal-500 to-cyan-500",
    submissions: 2789,
    features: ["የትዕዛዝ ክትትል", "የክፍያ ውህደት", "የክምችት አስተዳደር"]
  },
  {
    id: "healthcare-appointment",
    title: "የጤና አገልግሎት ቀጠሮ",
    description: "የሕክምና ቀጠሮ የማስቀመጥ ፎርም ለክሊኒኮች እና የጤና አገልግሎት አቅራቢዎች",
    category: "ጤና",
    fields: [
      { label: "የታካሚ ስም", type: "text", required: true },
      { label: "የተወለዱበት ቀን", type: "date", required: true },
      { label: "የስልክ ቁጥር", type: "text", required: true },
      { label: "ኢሜይል", type: "email", required: false },
      { label: "የሚመርጡት ቀን", type: "date", required: true },
      { label: "የሚመርጡት ሰዓት", type: "select", required: true },
      { label: "የመጎብኘት ምክንያት", type: "textarea", required: true },
      { label: "የኢንሹራንስ መረጃ", type: "text", required: false },
      { label: "አስቸኳይ አግኙን መረጃ", type: "text", required: true },
    ],
    iconName: "heart",
    color: "from-red-500 to-pink-500",
    submissions: 1245,
    features: ["የቀጠሮ ማስቀመጥ", "የታካሚ ምዝገባዎች", "የኢንሹራንስ ማረጋገጫ"]
  }
];

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    "graduation-cap": GraduationCap,
    "calendar": Calendar,
    "users": Users,
    "file-text": FileText,
    "shopping-cart": ShoppingCart,
    "heart": Heart,
    "building": Building2,
    "mail": Mail,
    "map-pin": MapPin
  };
  return iconMap[iconName] || FileText;
};

export default function ExamplesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 text-white border-0" style={{ backgroundColor: '#f4be42' }}>
          📋 የሙያ አብነቶች
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#382606' }}>
          ዝግጅት የተደረገ ፎርም አብነቶች
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
          ከሙያዊ የተነደፉ ፎርም አብነቶች ስብስባችን ይምረጡ። 
          እያንዳንዱ አብነት ለተወሰነ አጠቃቀም የተመቻቸ እና QR ኮድ ፍጠራን ያካተተ ነው።
        </p>
      </section>

      {/* Templates Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleForms.map((form) => {
            const IconComponent = getIconComponent(form.iconName);
            return (
              <Card key={form.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${form.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      {form.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2" style={{ color: '#382606' }}>{form.title}</CardTitle>
                  <CardDescription style={{ color: '#382606', opacity: 0.7 }}>
                    {form.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Form Fields Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2" style={{ color: '#382606' }}>የፎርም መስኮች:</h4>
                    <div className="space-y-1">
                      {form.fields.slice(0, 4).map((field, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs" style={{ color: '#382606', opacity: 0.7 }}>
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                          <span>{field.label}</span>
                          {field.required && <span className="text-red-500">*</span>}
                        </div>
                      ))}
                      {form.fields.length > 4 && (
                        <div className="text-xs" style={{ color: '#382606', opacity: 0.5 }}>
                          +{form.fields.length - 4} ተጨማሪ መስኮች
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2" style={{ color: '#382606' }}>ባህሪያት:</h4>
                    <div className="flex flex-wrap gap-1">
                      {form.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" style={{ color: '#382606' }}>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mb-4" style={{ color: '#382606', opacity: 0.7 }}>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{form.submissions.toLocaleString()} ማስገባቶች</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      style={{ borderColor: '#f4be42', color: '#f4be42' }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      ቅድሚያ እይታ
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 text-white border-0"
                      style={{ backgroundColor: '#f4be42' }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      አብነት ይጠቀሙ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            የፎርም ምድቦች
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            በምድብ አብነቶችን ያስሱ ለእርስዎ ፍላጎት ተስማሚ ፎርም ለማግኘት
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "ትምህርት", icon: GraduationCap, color: "from-blue-500 to-indigo-500", count: 12 },
            { name: "ዝግጅቶች", icon: Calendar, color: "from-green-500 to-emerald-500", count: 8 },
            { name: "HR & ምዝገባ", icon: Users, color: "from-purple-500 to-pink-500", count: 15 },
            { name: "ግብይት", icon: FileText, color: "from-orange-500 to-red-500", count: 10 },
            { name: "ኢ-ኮሜርስ", icon: ShoppingCart, color: "from-teal-500 to-cyan-500", count: 6 },
            { name: "ጤና", icon: Heart, color: "from-red-500 to-pink-500", count: 9 },
            { name: "ንግድ", icon: Building2, color: "from-indigo-500 to-purple-500", count: 14 },
            { name: "ምርመራዎች", icon: Mail, color: "from-yellow-500 to-orange-500", count: 11 }
          ].map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.name} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: '#382606' }}>{category.name}</h3>
                  <p className="text-sm" style={{ color: '#382606', opacity: 0.7 }}>{category.count} አብነቶች</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            የሚፈልጉትን አላገኙም?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#382606', opacity: 0.8 }}>
            ከአብሮገነት የመስመር ላይ ፎርም ገንቢ ጋር የራስዎን ልዩ ፎርም ከመጀመሪያ ይፍጠሩ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="text-lg px-8 py-6 text-white border-0" style={{ backgroundColor: '#f4be42' }}>
                ልዩ ፎርም ይፍጠሩ
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