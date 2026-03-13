const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  token?: string;
}

// Create axios-like fetch wrapper
const apiCall = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  token?: string
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const authAPI = {
  // User Login
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    return apiCall("/auth/login", "POST", credentials);
  },

  // User Registration
  signup: async (userData: SignupPayload): Promise<AuthResponse> => {
    return apiCall("/auth/register", "POST", userData);
  },

  // Logout
  logout: async (token: string): Promise<{ success: boolean; message: string }> => {
    return apiCall("/auth/logout", "POST", {}, token);
  },

  // Get current user
  getCurrentUser: async (token: string) => {
    return apiCall("/auth/user", "GET", undefined, token);
  },

  // Refresh token
  refreshToken: async (token: string) => {
    return apiCall("/auth/refresh", "POST", {}, token);
  },
};

export const booksAPI = {
  // Get all books
  getAllBooks: async () => {
    return apiCall("/books", "GET");
  },

  // Get single book
  getBook: async (id: string) => {
    return apiCall(`/books/${id}`, "GET");
  },

  // Search books
  searchBooks: async (query: string) => {
    return apiCall(`/books/search?q=${encodeURIComponent(query)}`, "GET");
  },

  // Get books by genre
  getBooksByGenre: async (genre: string) => {
    return apiCall(`/books/genre/${genre}`, "GET");
  },
};

export const ordersAPI = {
  // Create order
  createOrder: async (orderData: any, token: string) => {
    return apiCall("/orders", "POST", orderData, token);
  },

  // Get user orders
  getUserOrders: async (token: string) => {
    return apiCall("/orders", "GET", undefined, token);
  },

  // Get order details
  getOrder: async (id: string, token: string) => {
    return apiCall(`/orders/${id}`, "GET", undefined, token);
  },
};
