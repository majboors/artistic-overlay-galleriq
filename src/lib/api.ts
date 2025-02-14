
import axios from "axios";

const API_BASE_URL = "https://imageprocessing.applytocollege.pk";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

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
      const params = marking ? { marking } : {};
      const response = await axiosInstance.get("/images", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch images:", error);
      throw error;
    }
  }
};
