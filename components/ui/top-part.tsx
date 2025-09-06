"use client";

import { HelpCircle, Settings, User, LogOut, Bell, Shield, Moon, Sun, BarChart3 } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function TopPart() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const session = await authClient.getSession();
        // Handle different response structures
        let userData = null;
        
        if (session && typeof session === 'object') {
          // Check if user is directly on the response
          if ('user' in session && session.user) {
            userData = session.user;
          }
          // Check if user is in data property
          else if ('data' in session && session.data && typeof session.data === 'object') {
            if ('user' in session.data && session.data.user) {
              userData = session.data.user;
            }
            // Check if data itself is the user object
            else if (session.data && ('id' in session.data || 'email' in session.data)) {
              userData = session.data;
            }
          }
          // Check if response itself is the user object
          else if (session && ('id' in session || 'email' in session)) {
            userData = session;
          }
        }
        
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 dark:bg-gray-900/95 dark:border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white hidden sm:block">ፍሬ Forms</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </Button>

        {/* Help */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={() => router.push('/help')}
        >
          <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:border-gray-700">
            <DropdownMenuLabel className="font-normal dark:text-gray-200">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none dark:text-white">
                  {user?.name || user?.email || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            
            <DropdownMenuItem onClick={() => router.push('/settings')} className="dark:text-gray-200 dark:hover:bg-gray-700">
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => router.push('/attendance-report')} className="dark:text-gray-200 dark:hover:bg-gray-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Attendance Report</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => router.push('/settings?tab=security')} className="dark:text-gray-200 dark:hover:bg-gray-700">
              <Shield className="mr-2 h-4 w-4" />
              <span>Account Security</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => router.push('/settings?tab=notifications')} className="dark:text-gray-200 dark:hover:bg-gray-700">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
