import axios from 'axios';
import { getFullUrl } from '../utils/apiUrl';

const BASE_PATH = '/api/admin/dashboard';

export const getAllWorks = async () => {
  try {
    const response = await axios.get(getFullUrl(`${BASE_PATH}/works`));
    return response.data;
  } catch (error) {
    console.error('Error fetching works:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch works');
  }
};

export const createWork = async (workData) => {
  try {
    const response = await axios.post(getFullUrl(`${BASE_PATH}/works`), workData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating work:', error);
    throw error;
  }
};

export const updateWork = async (id, workData) => {
  try {
    const response = await axios.put(getFullUrl(`${BASE_PATH}/works/${id}`), workData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating work:', error);
    throw error;
  }
};

export const deleteWork = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/works/${id}`));
  } catch (error) {
    console.error('Error deleting work:', error);
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
