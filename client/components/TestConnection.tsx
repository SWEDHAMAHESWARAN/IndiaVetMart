import { useState } from "react";
import { authAPI } from "../lib/api";

export const TestConnection = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");

  const testConnection = async () => {
    setTesting(true);
    setResult("");

    try {
      // Test basic connectivity
      const testData = {
        email: "test@example.com",
        password: "test123",
      };

      console.log("Testing connection to API...");
      await authAPI.signIn(testData);
      setResult("✅ API connection successful!");
    } catch (error: any) {
      console.error("Connection test failed:", error);
      setResult(
        `❌ Connection failed: ${error.msg || error.message || "Unknown error"}`,
      );
    } finally {
      setTesting(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-xs">
      <h3 className="font-bold mb-2">API Connection Test</h3>
      <p className="text-xs text-gray-600 mb-2">
        API URL: {API_BASE_URL || "Relative (using proxy/redirects)"}
      </p>
      <button
        onClick={testConnection}
        disabled={testing}
        className="px-4 py-2 bg-brand-navy text-white rounded hover:bg-brand-dark-navy disabled:opacity-50 w-full"
      >
        {testing ? "Testing..." : "Test API"}
      </button>
      {result && (
        <p
          className={`mt-2 text-sm ${result.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
        >
          {result}
        </p>
      )}
    </div>
  );
};
