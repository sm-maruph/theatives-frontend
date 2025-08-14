import axios from 'axios';
import { getFullUrl } from '../utils/apiUrl';

const BASE_PATH = '/api/admin/dashboard';

// Fetch all services
export const fetchServices = async () => {
  try {
    const response = await axios.get(getFullUrl(`${BASE_PATH}/microservices`));
    return response.data;
  } catch (error) {
    console.error('Error fetching micro services:', error);
    throw error;
  }
};

// Create a new service
export const createService = async (serviceData) => {
  try {
    const response = await axios.post(getFullUrl(`${BASE_PATH}/microservices`), serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating micro service:', error);
    throw error;
  }
};

// Update an existing service
export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(getFullUrl(`${BASE_PATH}/microservices/${id}`), serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating micro service:', error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/microservices/${id}`));
  } catch (error) {
    console.error('Error deleting micro service:', error);
    throw error;
  }
};

// Upload an image
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
