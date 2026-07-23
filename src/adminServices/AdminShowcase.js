import axios from "axios";
import { getFullUrl } from "../utils/apiUrl";
const BASE_PATH = "/api/admin/dashboardservices/showcases";

// Get all blogs
export const getBlogs = async () => {
  const response = await axios.get(getFullUrl(BASE_PATH));
  return response.data;
};

// Create a new blog
export const createBlog = async (formData) => {
  const response = await axios.post(getFullUrl(BASE_PATH), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update blog by ID
export const updateBlog = async (id, formData) => {
  const response = await axios.put(getFullUrl(`${BASE_PATH}/${id}`), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete blog by ID
export const deleteBlog = async (id) => {
  const response = await axios.delete(getFullUrl(`${BASE_PATH}/${id}`));
  return response.data;
};

// Increment blog view count
export const incrementBlogView = async (id) => {
  try {
    await axios.patch(getFullUrl(`${BASE_PATH}/${id}/views`));
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
};
