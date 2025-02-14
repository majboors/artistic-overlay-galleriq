
import axios from "axios";

const API_BASE_URL = "https://imageprocessing.applytocollege.pk";

export const api = {
  uploadImage: async (formData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData);
    return response.data;
  },

  getUnmarkedImage: async () => {
    const response = await axios.get(`${API_BASE_URL}/unmarked`);
    return response.data;
  },

  getImageById: (id: string) => `${API_BASE_URL}/image/${id}`,

  markImage: async (id: string, marking: boolean) => {
    const response = await axios.put(`${API_BASE_URL}/mark/${id}`, { marking });
    return response.data;
  },

  getImages: async (marking?: 'true' | 'false' | 'unmarked') => {
    const params = marking ? { marking } : {};
    const response = await axios.get(`${API_BASE_URL}/images`, { params });
    return response.data;
  }
};
