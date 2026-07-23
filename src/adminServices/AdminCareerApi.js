import axios from 'axios';
import { getFullUrl } from "../utils/apiUrl";
const BASE_PATH = '/api/admin/dashboardservices/careers';

// Get all careers
export const getCareers = async () => {
  try {
    const response = await axios.get(getFullUrl(BASE_PATH));
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Create a new career
export const createCareer = async (careerData) => {
  try {
    const response = await axios.post(getFullUrl(BASE_PATH), careerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating jobs:', error);
    throw error;
  }
};

// Update a full career by ID
export const updateCareer = async (id, careerData) => {
  try {
    const response = await axios.put(getFullUrl(`${BASE_PATH}/${id}`), careerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete a career by ID
export const deleteCareer = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/${id}`));
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Upload image
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(getFullUrl(`${BASE_PATH}/upload`), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
