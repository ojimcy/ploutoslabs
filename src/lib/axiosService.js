import axios from 'axios';

// const baseURL = 'http://localhost:3001/v1';

const headers = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('ACCESS_TOKEN_KEY');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const get = (url) => {
  return axios.get(url, { headers: headers() });
};

const post = (url, data) => {
  return axios.post(url, data, { headers: headers() });
};
const patch = (url, data) => axios.patch(url, data, { headers: headers() });
const del = (url) => axios.delete(url, { headers: headers() });

export default {
  get,
  post,
  patch,
  delete: del,
};
