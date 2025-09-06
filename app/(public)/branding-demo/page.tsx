'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const ColorPalette = () => {
  const colors = [
    { name: "ዋና ወርቅ", hex: "#f4be42", usage: "ዋና የምርት ቀለም፣ CTAs፣ አፅንዖቶች፣ አስፈላጊ አካላት" },
    { name: "ቀላል ጀርባ", hex: "#f7f7f7", usage: "ዋና ጀርባ፣ ካርዶች፣ ቀላል ክፍሎች፣ የተቃራኒ ጽሑፍ" },
    { name: "ጥቁር ጽሑፍ", hex: "#382606", usage: "ዋና ጽሑፍ፣ ራስጌዎች፣ ጥቁር አካላት፣ ድንበሮች" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#f4be42' }}>የምርት ቀለም ፓሌት</h2>
        <p className="mb-6" style={{ color: '#382606', opacity: 0.8 }}>
          ለተሻለ የንባብ ችሎታ እና የምርት ወጥነት ከሞቃታማ ወርቅ፣ ቀላል የጀርባ እና ባለብዙ ጥቁር ጽሑፍ ጋር ንጹህ፣ የተሰበረ የቀለም እቅድ።
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="flex items-center space-x-3 p-3 rounded-lg border">
            <div 
              className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{color.name}</h3>
              <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
              <p className="text-xs text-gray-600 mt-1">{color.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ColorCombinations = () => {
  const combinations = [
    {
      name: "Primary Theme",
      primary: "#f4be42",
      secondary: "#382606",
      background: "#f7f7f7",
      text: "#382606",
      description: "Main brand combination for headers, CTAs, and important sections"
    },
    {
      name: "Gold on Dark",
      primary: "#f4be42",
      secondary: "#f7f7f7",
      background: "#382606",
      text: "#f7f7f7",
      description: "High contrast combination for emphasis and special content"
    },
    {
      name: "Light Theme",
      primary: "#382606",
      secondary: "#f4be42",
      background: "#f7f7f7",
      text: "#382606",
      description: "Clean, readable combination for body content and forms"
    },
    {
      name: "Accent Focus",
      primary: "#f4be42",
      secondary: "#382606",
      background: "#f7f7f7",
      text: "#382606",
      description: "Gold accent on light background for highlights and buttons"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#f4be42' }}>Color Combinations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combinations.map((combo, index) => (
          <Card key={index} className="overflow-hidden">
            <div 
              className="h-32 p-6 flex flex-col justify-between"
              style={{ backgroundColor: combo.background }}
            >
              <div>
                <h3 className="text-lg font-bold" style={{ color: combo.text }}>
                  {combo.name}
                </h3>
                <p className="text-sm opacity-90" style={{ color: combo.text }}>
                  {combo.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: combo.primary }}
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: combo.secondary }}
                />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Primary:</span>
                  <span className="font-mono">{combo.primary}</span>
                </div>
                <div className="flex justify-between">
                  <span>Secondary:</span>
                  <span className="font-mono">{combo.secondary}</span>
                </div>
                <div className="flex justify-between">
                  <span>Background:</span>
                  <span className="font-mono">{combo.background}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ComponentExamples = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#f4be42' }}>Component Examples</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles with the new color scheme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button 
                className="text-white border-0"
                style={{ backgroundColor: '#f4be42' }}
              >
                Primary Gold
              </Button>
              <Button 
                variant="outline"
                style={{ 
                  borderColor: '#f4be42', 
                  color: '#f4be42' 
                }}
              >
                Gold Outline
              </Button>
              <Button 
                className="text-white border-0"
                style={{ backgroundColor: '#382606' }}
              >
                Dark Button
              </Button>
              <Button 
                variant="outline"
                style={{ 
                  borderColor: '#382606', 
                  color: '#382606' 
                }}
              >
                Dark Outline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Input fields and form controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-input">Sample Input</Label>
              <Input 
                id="demo-input" 
                placeholder="Enter text here..."
                className="focus:border-[#f4be42] focus:ring-[#f4be42]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-textarea">Sample Textarea</Label>
              <Textarea 
                id="demo-textarea" 
                placeholder="Enter longer text here..."
                className="focus:border-[#f4be42] focus:ring-[#f4be42]"
              />
            </div>
            <Select>
              <SelectTrigger className="focus:border-[#f4be42] focus:ring-[#f4be42]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Badges and Status */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Status</CardTitle>
            <CardDescription>Status indicators and badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge 
                className="text-white border-0"
                style={{ backgroundColor: '#f4be42' }}
              >
                Primary
              </Badge>
              <Badge 
                className="text-white border-0"
                style={{ backgroundColor: '#382606' }}
              >
                Dark
              </Badge>
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: '#f4be42', 
                  color: '#f4be42' 
                }}
              >
                Gold Outline
              </Badge>
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: '#382606', 
                  color: '#382606' 
                }}
              >
                Dark Outline
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Checkboxes and Radio */}
        <Card>
          <CardHeader>
            <CardTitle>Checkboxes & Radio</CardTitle>
            <CardDescription>Selection controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="demo-checkbox" />
              <Label htmlFor="demo-checkbox">Sample checkbox</Label>
            </div>
            <RadioGroup defaultValue="option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TypographyExamples = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#f4be42' }}>Typography</h2>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#382606' }}>
              Main Heading (Dark Text)
            </h1>
            <h2 className="text-3xl font-semibold mb-2" style={{ color: '#f4be42' }}>
              Secondary Heading (Primary Gold)
            </h2>
            <h3 className="text-2xl font-medium mb-2" style={{ color: '#382606' }}>
              Tertiary Heading (Dark Text)
            </h3>
            <p className="text-lg" style={{ color: '#382606' }}>
              Body text in dark color. This demonstrates how the color scheme works for different text elements while maintaining good readability and hierarchy.
            </p>
            <p className="text-sm" style={{ color: '#382606', opacity: 0.7 }}>
              Smaller text for captions and secondary information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function BrandingDemoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#382606' }}>
            Brand Color Demo
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: '#382606', opacity: 0.8 }}>
            A focused showcase of the three-color brand palette. This clean and minimal color scheme 
            provides excellent contrast, readability, and a professional appearance while maintaining 
            brand consistency across all elements.
          </p>
        </div>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
            <TabsTrigger value="combinations">Combinations</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors">
            <ColorPalette />
          </TabsContent>
          
          <TabsContent value="combinations">
            <ColorCombinations />
          </TabsContent>
          
          <TabsContent value="components">
            <ComponentExamples />
          </TabsContent>
          
          <TabsContent value="typography">
            <TypographyExamples />
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />
        
        <Card className="text-white" style={{ backgroundColor: '#f4be42' }}>
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Implementation Guide</h2>
            <p className="text-lg mb-6">
              Use these three colors consistently across your application to maintain a clean and professional aesthetic.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Primary Actions</h3>
                <p>Use Primary Gold (#f4be42) for main CTAs and important buttons</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Text & Headers</h3>
                <p>Use Dark Text (#382606) for all text content and headers</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Backgrounds</h3>
                <p>Use Light Background (#f7f7f7) for cards, sections, and light areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
