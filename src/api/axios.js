import axios from 'axios'

const apiUrl = import.meta.env.MODE === 'development' ? 'http://45.173.112.9:3005/api' : '/api';
// console.log(apiUrl)

const instance = axios.create({
    baseURL: apiUrl,
})

export default instance
