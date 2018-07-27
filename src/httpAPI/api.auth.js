import axios from 'axios';
const ROOT_URL = process.env.SYN_URL;

export function logoutAPI() {
  return axios.get(`${ROOT_URL}/logout`)
    .then(response => response.data)
    .catch(err => {
      throw err;
    });
}
