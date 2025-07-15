import { useState } from "react";

export const ApiTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");

  const testDirectConnection = async () => {
    setTesting(true);
    setResult("Testing direct connection...");

    try {
      // Test direct connection to API
      const response = await fetch(
        "http://20.235.173.36:3001/api/user/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            email: "test@test.com",
            password: "test123",
          }),
        },
      );

      console.log("Direct API Response:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        setResult(
          `✅ Direct API connection successful! Status: ${response.status}`,
        );
      } else {
        setResult(
          `⚠️ API responded with status: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error: any) {
      console.error("Direct connection error:", error);
      setResult(`❌ Direct connection failed: ${error.message}`);
    }

    setTesting(false);
  };

  const testProxyConnection = async () => {
    setTesting(true);
    setResult("Testing proxy connection...");

    try {
      // Test proxy connection
      const response = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "test123",
        }),
      });

      console.log("Proxy API Response:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Proxy connection successful! Status: ${response.status}`);
      } else {
        setResult(
          `⚠️ Proxy responded with status: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error: any) {
      console.error("Proxy connection error:", error);
      setResult(`❌ Proxy connection failed: ${error.message}`);
    }

    setTesting(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-sm">
      <h3 className="font-bold mb-2 text-sm">API Connection Test</h3>

      <div className="space-y-2 mb-3">
        <button
          onClick={testProxyConnection}
          disabled={testing}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test Proxy"}
        </button>

        <button
          onClick={testDirectConnection}
          disabled={testing}
          className="w-full px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test Direct"}
        </button>
      </div>

      {result && (
        <div className="text-xs p-2 bg-gray-100 rounded">{result}</div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        <div>Environment: {import.meta.env.MODE}</div>
        <div>Dev Mode: {import.meta.env.DEV ? "Yes" : "No"}</div>
      </div>
    </div>
  );
};
