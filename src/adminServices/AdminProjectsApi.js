import axios from "axios";
import { getFullUrl } from "../utils/apiUrl";

const BASE = "/api/admin/dashboard";
const config = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Your admin session has expired. Please sign in again.");
  return { headers: { Authorization: `Bearer ${token}` } };
};
const request = async (method, path, data) => {
  try {
    const response = await axios({ method, url: getFullUrl(`${BASE}${path}`), data, ...config() });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || "Request failed");
  }
};

export const getProjects = () => request("get", "/projects");
export const createProject = (data) => request("post", "/projects", data);
export const updateProject = (id, data) => request("put", `/projects/${id}`, data);
export const deleteProject = (id) => request("delete", `/projects/${id}`);
export const getProjectCategories = () => request("get", "/project-categories");
export const createProjectCategory = (name, kind) => request("post", "/project-categories", { name, kind });
export const deleteProjectCategory = (id) => request("delete", `/project-categories/${id}`);
