import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://json-server-nns.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosClient
