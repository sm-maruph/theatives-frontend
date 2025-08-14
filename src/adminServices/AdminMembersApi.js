import axios from 'axios';
import { getFullUrl } from '../utils/apiUrl';

const BASE_PATH = '/api/admin/dashboardservices';

export const fetchMembers = async () => {
  try {
    const response = await axios.get(getFullUrl(`${BASE_PATH}/members`));
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await axios.post(
      getFullUrl(`${BASE_PATH}/members`),
      memberData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

export const updateMember = async (id, memberData) => {
  try {
    const response = await axios.put(
      getFullUrl(`${BASE_PATH}/members/${id}`),
      memberData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    await axios.delete(getFullUrl(`${BASE_PATH}/members/${id}`));
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const uploadMemberImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      getFullUrl(`${BASE_PATH}/member-upload`),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return response.data; // Expected: { filePath: '...' }
  } catch (error) {
    console.error('Error uploading member image:', error);
    throw error;
  }
};