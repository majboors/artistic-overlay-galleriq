
import axios from "axios";

const API_BASE_URL = "https://imageprocessing.applytocollege.pk";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false // Explicitly disable credentials
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
);

export const api = {
  uploadImage: async (formData: FormData) => {
    const response = await axiosInstance.post("/upload", formData);
    return response.data;
  },

  getUnmarkedImage: async () => {
    const response = await axiosInstance.get("/unmarked");
    return response.data;
  },

  getImageById: (id: string) => `${API_BASE_URL}/image/${id}`,

  markImage: async (id: string, marking: boolean) => {
    const response = await axiosInstance.put(`/mark/${id}`, { marking });
    return response.data;
  },

  getImages: async (marking?: 'true' | 'false' | 'unmarked') => {
    try {
      console.log('Fetching images with params:', { marking });
      const params = marking ? { marking } : {};
      const response = await axiosInstance.get("/images", { params });
      
      // Ensure we always return an array
      const data = response.data;
      if (!Array.isArray(data)) {
        console.warn('API did not return an array:', data);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error("Failed to fetch images:", error);
      throw error;
    }
  }
};
