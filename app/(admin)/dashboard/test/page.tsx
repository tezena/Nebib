"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test 1: Check authentication and forms
      console.log("🧪 Running authentication test...");
      const testResponse = await fetch("/api/forms/test");
      const testData = await testResponse.json();
      
      console.log("📊 Test results:", testData);
      
      // Test 2: Try to create a test form
      console.log("🧪 Running form creation test...");
      const testFormData = {
        topic: "Test Form " + Date.now(),
        description: "This is a test form created for debugging",
        categories: ["Test"],
        fields: [
          {
            label: "Test Field",
            type: "text",
            category: "Test",
            required: false
          }
        ]
      };
      
      const createResponse = await fetch("/api/forms/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testFormData)
      });
      
      const createData = await createResponse.json();
      console.log("📝 Form creation results:", createData);
      
      // Test 3: Check forms again
      console.log("🧪 Running forms fetch test...");
      const formsResponse = await fetch("/api/forms");
      const formsData = await formsResponse.json();
      
      console.log("📋 Forms fetch results:", formsData);
      
      setTestResults({
        authentication: testData,
        formCreation: createData,
        formsFetch: formsData
      });
      
    } catch (err) {
      console.error("❌ Test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Form Debug Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runTests} 
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {loading ? "Running Tests..." : "Run Debug Tests"}
            </Button>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="text-red-800 dark:text-red-200 font-medium">Error:</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
            
            {testResults && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-blue-800 dark:text-blue-200 font-medium">Authentication Test:</h3>
                  <pre className="text-sm text-blue-700 dark:text-blue-300 mt-2 overflow-auto">
                    {JSON.stringify(testResults.authentication, null, 2)}
                  </pre>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="text-green-800 dark:text-green-200 font-medium">Form Creation Test:</h3>
                  <pre className="text-sm text-green-700 dark:text-green-300 mt-2 overflow-auto">
                    {JSON.stringify(testResults.formCreation, null, 2)}
                  </pre>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h3 className="text-purple-800 dark:text-purple-200 font-medium">Forms Fetch Test:</h3>
                  <pre className="text-sm text-purple-700 dark:text-purple-300 mt-2 overflow-auto">
                    {JSON.stringify(testResults.formsFetch, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 