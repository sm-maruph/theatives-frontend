import axios from 'axios';
import { getFullUrl } from '../utils/apiUrl';

const BASE_PATH = '/api/admin/dashboardservices';

export const getAllGallerys = async () => {
  try {
    const response = await axios.get(getFullUrl(`${BASE_PATH}/gallery`));
    return response.data;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch gallery');
  }
};

export const createGallery = async (workData) => {
  try {
    const response = await axios.post(getFullUrl(`${BASE_PATH}/gallery`), workData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating gallery:', error);
    throw error;
  }
};

export const updateGallery = async (id, workData) => {
  try {
    const response = await axios.put(getFullUrl(`${BASE_PATH}/gallery/${id}`), workData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating gallery:', error);
    throw error;
  }
};

export const deleteGallery = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/gallery/${id}`));
  } catch (error) {
    console.error('Error deleting gallery:', error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(getFullUrl(`${BASE_PATH}/upload`), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data; // Expected: { filePath: '...' }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
