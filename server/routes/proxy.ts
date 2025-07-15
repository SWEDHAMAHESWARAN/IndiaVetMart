import { RequestHandler } from "express";

// Simple proxy to handle CORS issues
export const proxyHandler: RequestHandler = async (req, res) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  try {
    const { body, method, headers } = req;
    const apiPath = req.path.replace("/api/proxy", "");
    const targetUrl = `http://20.235.173.36:3001/api${apiPath}`;

    console.log("Original path:", req.path);
    console.log("API path after replace:", apiPath);
    console.log("Proxying request to:", targetUrl);
    console.log("Method:", method);
    console.log("Body:", body);

    // Prepare headers for the target API
    const proxyHeaders: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    // Forward Authorization header if present
    if (headers.authorization) {
      proxyHeaders.Authorization = headers.authorization;
    }

    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method: method,
      headers: proxyHeaders,
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    console.log("Target API response status:", response.status);
    console.log(
      "Target API content-type:",
      response.headers.get("content-type"),
    );

    // Handle different response types
    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // If not JSON, get text and try to parse or return as error
      const textResponse = await response.text();
      console.log("Non-JSON response:", textResponse);

      if (response.ok) {
        // Try to parse as JSON anyway
        try {
          responseData = JSON.parse(textResponse);
        } catch {
          responseData = { message: textResponse };
        }
      } else {
        responseData = {
          error: true,
          message: `API returned ${response.status}: ${textResponse}`,
        };
      }
    }

    console.log("Processed response data:", responseData);

    // Return the response
    res.status(response.status).json(responseData);
  } catch (error: any) {
    console.error("Proxy error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      error: true,
      message: "Proxy server error: " + error.message,
      details:
        error.name === "TypeError"
          ? "Network connectivity issue"
          : "Unknown error",
    });
  }
};
