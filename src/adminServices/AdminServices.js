import axios from 'axios';
import { getFullUrl } from '../utils/apiUrl';

const BASE_PATH = '/api/admin/dashboard';

export const fetchServices = async () => {
  try {
    const response = await axios.get(getFullUrl(`${BASE_PATH}/services`));
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await axios.post(getFullUrl(`${BASE_PATH}/services`), serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(getFullUrl(`${BASE_PATH}/services/${id}`), serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/services/${id}`));
  } catch (error) {
    console.error('Error deleting service:', error);
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

    return response.data; // Expected response: { filePath: '...' }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
