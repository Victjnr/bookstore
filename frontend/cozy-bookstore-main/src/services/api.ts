const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

// Get CSRF token from backend
const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/csrf-token`, {
      credentials: 'include', // Include cookies to maintain session
    });
    const data = await response.json();
    return data.csrf_token;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    throw error;
  }
};

// Create axios-like fetch wrapper with CSRF support (session-based auth)
const apiCall = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add CSRF token for POST, PUT, DELETE requests (session-based)
  if (method !== "GET") {
    const csrfToken = await getCsrfToken();
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include', // Include cookies to maintain session
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      // Include validation errors if present
      const errorMsg = error.errors 
        ? `Validation failed: ${JSON.stringify(error.errors)}`
        : error.message || `API Error: ${response.status}`;
      // For 401 responses, throw a clear unauthenticated error
      if (response.status === 401) {
        const e = new Error(errorMsg);
        // attach status for callers to inspect
        // @ts-ignore
        e.status = 401;
        throw e;
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();

    // Normalize response shapes so frontend callers can rely on { success, data }
    if (Array.isArray(json)) {
      return { success: true, data: json };
    }

    if (json && typeof json === "object") {
      // If backend already returns { success, ... } keep as-is
      if (Object.prototype.hasOwnProperty.call(json, "success")) {
        return json;
      }

      // Common patterns: { data: ... } or { books: [...] } or { items: [...] }
      if (Object.prototype.hasOwnProperty.call(json, "data")) {
        return { success: true, ...json };
      }

      // Try to find likely payload keys
      const preferredKeys = ["books", "items", "data", "user", "authors", "cart"];
      for (const key of preferredKeys) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
          return { success: true, data: json[key], ...json };
        }
      }

      // Fallback: treat the whole object as data
      return { success: true, data: json };
    }

    // Primitive responses
    return { success: true, data: json };
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
  logout: async (): Promise<{ success: boolean; message: string }> => {
    return apiCall("/auth/logout", "POST", {});
  },

  // Check auth status (doesn't require auth middleware on backend)
  checkAuth: async () => {
    return apiCall("/auth/check", "GET");
  },

  // Get current user (requires authentication)
  getCurrentUser: async () => {
    return apiCall("/auth/user", "GET");
  },

  // Alias for getCurrentUser
  getUser: async () => {
    return apiCall("/auth/user", "GET");
  },

  // Refresh token
  refreshToken: async () => {
    return apiCall("/auth/refresh", "POST", {});
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

export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    return apiCall("/cart", "GET");
  },

  // Add item to cart
  addToCart: async (bookId: string, quantity: number) => {
    return apiCall("/cart/items", "POST", { book_id: bookId, quantity });
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId: string, quantity: number) => {
    return apiCall(`/cart/items/${cartItemId}`, "PUT", { quantity });
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: string) => {
    return apiCall(`/cart/items/${cartItemId}`, "DELETE");
  },

  // Clear entire cart
  clearCart: async () => {
    return apiCall("/cart", "DELETE");
  },
};

export const ordersAPI = {
  // Create order
  createOrder: async (orderData: any) => {
    return apiCall("/orders", "POST", orderData);
  },

  // Get user orders
  getUserOrders: async () => {
    return apiCall("/orders", "GET");
  },

  // Get order details
  getOrder: async (id: string) => {
    return apiCall(`/orders/${id}`, "GET");
  },
};

export const dashboardAPI = {
  // Get all dashboard data at once
  getDashboardData: async () => {
    return apiCall("/dashboard/data", "GET");
  },

  // Get statistics only
  getStats: async () => {
    return apiCall("/dashboard/stats", "GET");
  },

  // Get recent orders
  getRecentOrders: async () => {
    return apiCall("/dashboard/recent-orders", "GET");
  },

  // Get top sellers
  getTopSellers: async () => {
    return apiCall("/dashboard/top-sellers", "GET");
  },
  // Sales over time
  salesOverTime: async () => {
    return apiCall("/dashboard/sales-over-time", "GET");
  },
  // Orders by status
  ordersByStatus: async () => {
    return apiCall("/dashboard/orders-by-status", "GET");
  },
  // Books sold by genre
  booksByGenre: async () => {
    return apiCall("/dashboard/books-by-genre", "GET");
  },
};
