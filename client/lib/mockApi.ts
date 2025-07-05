// Mock API for testing when real API is down
export const mockAuthAPI = {
  signIn: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

    if (data.email === "test@test.com" && data.password === "test123") {
      return {
        error: false,
        msg: "Login successful (Demo Mode)",
        token: "mock-token-123",
        user: {
          id: "1",
          name: "Test User",
          email: data.email,
        },
      };
    } else {
      return {
        error: true,
        msg: "Invalid credentials (Demo Mode)",
      };
    }
  },

  signUp: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay

    return {
      error: false,
      msg: "Account created successfully (Demo Mode)",
    };
  },

  authWithGoogle: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      error: false,
      msg: "Google login successful (Demo Mode)",
      token: "mock-google-token-123",
      user: {
        id: "2",
        name: data.name,
        email: data.email,
      },
    };
  },
};
