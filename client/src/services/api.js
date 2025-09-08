import axios from 'axios';

const API_BASE_URL = 'http://localhost:4200/api';

export const processImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${API_BASE_URL}/image/process`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};
