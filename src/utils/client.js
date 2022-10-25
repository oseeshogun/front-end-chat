import axios from 'axios'

const httpClient = (token) => {
  return axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 30000,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
}

export default httpClient
