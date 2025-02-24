import axios from 'axios'

import api from 'src/configs/api';
const API_URL = api.baseUrl;

// Login user
const getAll = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const u = new URLSearchParams(data).toString();
  const response = await axios.get(API_URL + '/players?' + u, config)
  return response.data
}

const create = async (token, data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data`
    },
  }
  const response = await axios.post(API_URL + '/players', data, config)
  console.log('response', response);
  return response.data
}

const update = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  let id = data.id;
  delete data.id;
  const response = await axios.put(API_URL + '/players/' + id, data, config)
  console.log('response', response);
  return response.data
}

const deleteRow = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.delete(API_URL + '/players/' + id, config)
  console.log('response', response);
  return response.data
}

const playersService = {
  getAll, create, update, deleteRow
}

export default playersService
