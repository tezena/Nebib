"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DebugFormsPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: "Test Form " + Date.now(),
    description: "This is a test form for debugging",
    categories: ["Test"],
    fields: [
      {
        label: "Test Field",
        type: "text",
        category: "Test",
        required: false
      }
    ]
  });

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🧪 Starting form debug tests...");
      
      // Test 1: Check authentication
      console.log("🔐 Testing authentication...");
      const authResponse = await fetch("/api/forms/test");
      const authData = await authResponse.json();
      console.log("📊 Auth test results:", authData);
      
      // Test 2: Create a test form
      console.log("📝 Creating test form...");
      const createResponse = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });
      
      const createData = await createResponse.json();
      console.log("📋 Form creation results:", createData);
      
      // Test 3: Fetch forms
      console.log("📥 Fetching forms...");
      const fetchResponse = await fetch("/api/forms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      const fetchData = await fetchResponse.json();
      console.log("📋 Forms fetch results:", fetchData);
      
      setTestResults({
        authentication: authData,
        formCreation: createData,
        formsFetch: fetchData,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      console.error("❌ Test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createCustomForm = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("📝 Creating custom form with data:", formData);
      
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log("📋 Custom form creation results:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create form");
      }
      
      setTestResults({
        customFormCreation: data,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      console.error("❌ Custom form creation error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Form Debug Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={runTests} 
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {loading ? "Running Tests..." : "Run All Tests"}
              </Button>
              
              <Button 
                onClick={createCustomForm} 
                disabled={loading}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {loading ? "Creating..." : "Create Custom Form"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Custom Form Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-gray-700 dark:text-gray-300">Form Title</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        {error && (
          <Card className="border-0 shadow-lg border-red-200 dark:border-red-800 dark:bg-gray-800">
            <CardContent className="p-4">
              <h3 className="text-red-800 dark:text-red-200 font-medium">Error:</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}
        
        {testResults && (
          <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.authentication && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="text-blue-800 dark:text-blue-200 font-medium">Authentication Test:</h3>
                    <pre className="text-sm text-blue-700 dark:text-blue-300 mt-2 overflow-auto">
                      {JSON.stringify(testResults.authentication, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.formCreation && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="text-green-800 dark:text-green-200 font-medium">Form Creation Test:</h3>
                    <pre className="text-sm text-green-700 dark:text-green-300 mt-2 overflow-auto">
                      {JSON.stringify(testResults.formCreation, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.formsFetch && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h3 className="text-purple-800 dark:text-purple-200 font-medium">Forms Fetch Test:</h3>
                    <pre className="text-sm text-purple-700 dark:text-purple-300 mt-2 overflow-auto">
                      {JSON.stringify(testResults.formsFetch, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.customFormCreation && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">Custom Form Creation:</h3>
                    <pre className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 overflow-auto">
                      {JSON.stringify(testResults.customFormCreation, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Test run at: {testResults.timestamp}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 