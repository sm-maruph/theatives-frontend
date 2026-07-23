import axios from 'axios';
import { getFullUrl } from '../utils/apiUrl';

const BASE_PATH = '/api/admin/dashboardservices';

export const fetchReviews = async () => {
  try {
    const response = await axios.get(getFullUrl(`${BASE_PATH}/reviews`));
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(getFullUrl(`${BASE_PATH}/reviews`), reviewData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (id, reviewData) => {
  try {
    const response = await axios.put(getFullUrl(`${BASE_PATH}/reviews/${id}`), reviewData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/reviews/${id}`));
  } catch (error) {
    console.error('Error deleting review:', error);
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
