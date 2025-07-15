// Netlify function to proxy API calls and add CORS headers
exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const { path, httpMethod, body, headers: requestHeaders } = event;

    // Extract the API path from the Netlify function path
    // e.g., /.netlify/functions/api-proxy/user/signin -> /api/user/signin
    const apiPath = path.replace("/.netlify/functions/api-proxy", "/api");
    const targetUrl = `http://20.235.173.36:3001${apiPath}`;

    console.log("Proxying request to:", targetUrl);
    console.log("Method:", httpMethod);
    console.log("Body:", body);

    // Prepare headers for the target API
    const proxyHeaders = {
      "Content-Type": "application/json",
    };

    // Forward Authorization header if present
    if (requestHeaders.authorization) {
      proxyHeaders.Authorization = requestHeaders.authorization;
    }

    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method: httpMethod,
      headers: proxyHeaders,
      body: httpMethod !== "GET" ? body : undefined,
    });

    const responseData = await response.text();

    console.log("Target API response status:", response.status);
    console.log("Target API response:", responseData);

    // Return the response with CORS headers
    return {
      statusCode: response.status,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: responseData,
    };
  } catch (error) {
    console.error("Proxy error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: true,
        message: "Proxy server error: " + error.message,
      }),
    };
  }
};
