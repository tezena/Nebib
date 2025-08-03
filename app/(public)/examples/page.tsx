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
    title: "Student Registration",
    description: "Complete student enrollment form with personal details, course selection, and emergency contacts",
    category: "Education",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Student ID", type: "text", required: true },
      { label: "Email Address", type: "email", required: true },
      { label: "Phone Number", type: "text", required: true },
      { label: "Date of Birth", type: "date", required: true },
      { label: "Course/Program", type: "select", required: true },
      { label: "Emergency Contact", type: "text", required: true },
      { label: "Medical Information", type: "textarea", required: false },
    ],
    iconName: "graduation-cap",
    color: "from-blue-500 to-indigo-500",
    submissions: 2156,
    features: ["QR Code Generation", "Attendance Tracking", "Data Export"]
  },
  {
    id: "event-registration",
    title: "Event Registration",
    description: "Professional event registration form for conferences, workshops, and meetups",
    category: "Events",
    fields: [
      { label: "First Name", type: "text", required: true },
      { label: "Last Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Company/Organization", type: "text", required: false },
      { label: "Job Title", type: "text", required: false },
      { label: "Dietary Restrictions", type: "text", required: false },
      { label: "Special Accommodations", type: "textarea", required: false },
      { label: "I agree to receive updates", type: "checkbox", required: false },
    ],
    iconName: "calendar",
    color: "from-green-500 to-emerald-500",
    submissions: 1892,
    features: ["QR Check-in", "Attendee Management", "Real-time Analytics"]
  },
  {
    id: "job-application",
    title: "Job Application",
    description: "Comprehensive job application form for hiring managers and HR departments",
    category: "HR",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Phone", type: "text", required: true },
      { label: "Position Applied For", type: "text", required: true },
      { label: "Resume/CV", type: "file", required: true },
      { label: "Cover Letter", type: "textarea", required: false },
      { label: "Years of Experience", type: "number", required: true },
      { label: "Available Start Date", type: "date", required: true },
      { label: "Expected Salary", type: "number", required: false },
    ],
    iconName: "users",
    color: "from-purple-500 to-pink-500",
    submissions: 1567,
    features: ["File Upload", "Application Tracking", "Candidate Database"]
  },
  {
    id: "customer-feedback",
    title: "Customer Feedback",
    description: "Collect valuable customer insights and feedback for product improvement",
    category: "Marketing",
    fields: [
      { label: "Customer Name", type: "text", required: false },
      { label: "Email", type: "email", required: false },
      { label: "Product/Service Used", type: "text", required: true },
      { label: "Rating (1-10)", type: "number", required: true },
      { label: "What did you like most?", type: "textarea", required: false },
      { label: "What could we improve?", type: "textarea", required: false },
      { label: "Would you recommend us?", type: "checkbox", required: false },
      { label: "Contact for follow-up", type: "checkbox", required: false },
    ],
    iconName: "file-text",
    color: "from-orange-500 to-red-500",
    submissions: 3341,
    features: ["Rating System", "Sentiment Analysis", "Customer Insights"]
  },
  {
    id: "product-order",
    title: "Product Order Form",
    description: "Streamlined order form for e-commerce and service businesses",
    category: "E-commerce",
    fields: [
      { label: "Customer Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Phone", type: "text", required: true },
      { label: "Shipping Address", type: "textarea", required: true },
      { label: "Product Selection", type: "select", required: true },
      { label: "Quantity", type: "number", required: true },
      { label: "Special Instructions", type: "textarea", required: false },
      { label: "Newsletter Subscription", type: "checkbox", required: false },
    ],
    iconName: "shopping-cart",
    color: "from-teal-500 to-cyan-500",
    submissions: 2789,
    features: ["Order Tracking", "Payment Integration", "Inventory Management"]
  },
  {
    id: "healthcare-appointment",
    title: "Healthcare Appointment",
    description: "Medical appointment booking form for clinics and healthcare providers",
    category: "Healthcare",
    fields: [
      { label: "Patient Name", type: "text", required: true },
      { label: "Date of Birth", type: "date", required: true },
      { label: "Phone Number", type: "text", required: true },
      { label: "Email", type: "email", required: false },
      { label: "Preferred Date", type: "date", required: true },
      { label: "Preferred Time", type: "select", required: true },
      { label: "Reason for Visit", type: "textarea", required: true },
      { label: "Insurance Information", type: "text", required: false },
      { label: "Emergency Contact", type: "text", required: true },
    ],
    iconName: "heart",
    color: "from-red-500 to-pink-500",
    submissions: 1245,
    features: ["Appointment Scheduling", "Patient Records", "Insurance Verification"]
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
          📋 Professional Templates
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Ready-to-Use Form Templates
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Choose from our collection of professionally designed form templates. 
          Each template is optimized for its specific use case and includes QR code generation.
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
                  <CardTitle className="text-gray-800 dark:text-white text-xl mb-2">{form.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {form.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Form Fields Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Form Fields:</h4>
                    <div className="space-y-1">
                      {form.fields.slice(0, 4).map((field, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                          <span>{field.label}</span>
                          {field.required && <span className="text-red-500">*</span>}
                        </div>
                      ))}
                      {form.fields.length > 4 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          +{form.fields.length - 4} more fields
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {form.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{form.submissions.toLocaleString()} submissions</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Use Template
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Form Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse templates by category to find the perfect form for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Education", icon: GraduationCap, color: "from-blue-500 to-indigo-500", count: 12 },
            { name: "Events", icon: Calendar, color: "from-green-500 to-emerald-500", count: 8 },
            { name: "HR & Recruitment", icon: Users, color: "from-purple-500 to-pink-500", count: 15 },
            { name: "Marketing", icon: FileText, color: "from-orange-500 to-red-500", count: 10 },
            { name: "E-commerce", icon: ShoppingCart, color: "from-teal-500 to-cyan-500", count: 6 },
            { name: "Healthcare", icon: Heart, color: "from-red-500 to-pink-500", count: 9 },
            { name: "Business", icon: Building2, color: "from-indigo-500 to-purple-500", count: 14 },
            { name: "Surveys", icon: Mail, color: "from-yellow-500 to-orange-500", count: 11 }
          ].map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.name} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} templates</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your own custom form from scratch with our revolutionary inline form builder
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Create Custom Form
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