import axios from 'axios'

import api from 'src/configs/api';
let API_URL = api.baseUrl ?? "";
console.log('API_URL', API_URL)
// Login user
const get = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + '/contants/' + data, config)
  return response.data
}

const constantsService = {
  get
}

export default constantsService
