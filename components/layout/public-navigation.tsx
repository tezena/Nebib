"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PublicNavigationProps {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

export default function PublicNavigation({ 
  showBackButton = false, 
  backUrl = "/", 
  backText = "Back to Home" 
}: PublicNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="border-b backdrop-blur-sm sticky top-0 z-50" style={{ borderColor: '#f4be42', backgroundColor: 'rgba(247, 247, 247, 0.9)' }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href={backUrl}>
              <Button variant="ghost" size="sm" className="gap-2" style={{ color: '#382606' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {backText}
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="ፍሬ Form Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-xl font-bold" style={{ color: '#382606' }}>ፍሬ Form</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/features">
            <Button variant="ghost" style={{ color: '#382606' }}>ይዘት</Button>
          </Link>
          <Link href="/examples">
            <Button variant="ghost" style={{ color: '#382606' }}>አብነቶች</Button>
          </Link>
          {/* <Link href="/qr-demo">
            <Button variant="ghost" style={{ color: '#382606' }}>QR ማሳያ</Button>
          </Link>
          <Link href="/help">
            <Button variant="ghost" style={{ color: '#382606' }}>እርዳታ</Button>
          </Link> */}
          
          {/* Theme Toggle */}
          {/* <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#382606' }}
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button> */}
          
          <Link href="/sign-in">
            <Button className="text-white border-0" style={{ backgroundColor: '#f4be42' }}>ይጀምሩ</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle for Mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#382606' }}
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" style={{ color: '#382606' }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: '#382606' }} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t backdrop-blur-sm" style={{ borderColor: '#f4be42', backgroundColor: 'rgba(247, 247, 247, 0.95)' }}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/features">
              <Button variant="ghost" className="w-full justify-start" style={{ color: '#382606' }}>
                ባህሪያት
              </Button>
            </Link>
            <Link href="/examples">
              <Button variant="ghost" className="w-full justify-start" style={{ color: '#382606' }}>
                አብነቶች
              </Button>
            </Link>
            <Link href="/qr-demo">
              <Button variant="ghost" className="w-full justify-start" style={{ color: '#382606' }}>
                QR ማሳያ
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="ghost" className="w-full justify-start" style={{ color: '#382606' }}>
                እርዳታ
              </Button>
            </Link>
            <div className="pt-2" style={{ borderTop: '1px solid #f4be42' }}>
              <Link href="/sign-in">
                <Button className="w-full text-white border-0" style={{ backgroundColor: '#f4be42' }}>
                  ይጀምሩ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 