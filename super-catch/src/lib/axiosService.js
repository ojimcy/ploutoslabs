import axios from 'axios';

// const baseURL = 'http://localhost:3001/v1';


const headers = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const webApp = window.Telegram.WebApp;
  if (webApp) {
    headers.TelegramInitData = webApp.initData;
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
