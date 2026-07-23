import axios from 'axios';
import { getFullUrl } from '../utils/apiUrl';

const BASE_PATH = '/api/admin/dashboardservices';

// Fetch all clients
export const fetchClients = async () => {
  try {
    const response = await axios.get(getFullUrl(`${BASE_PATH}/clients`));
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// Create a new client
export const createClient = async (clientData) => {
  try {
    const response = await axios.post(getFullUrl(`${BASE_PATH}/clients`), clientData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

// Update an existing client
export const updateClient = async (id, clientData) => {
  try {
    const response = await axios.put(getFullUrl(`${BASE_PATH}/clients/${id}`), clientData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

// Delete a client
export const deleteClient = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/clients/${id}`));
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// Upload client image
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(getFullUrl(`${BASE_PATH}/upload`), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data; // Example: { filePath: '/uploads/client-logo.png' }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
