const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFullUrl = (path) => `${BASE_URL}${path}`;
