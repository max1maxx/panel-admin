import axios from 'axios'

const apiUrl = import.meta.env.MODE === 'development' ? 'http://localhost:8080/api' : '/api';
// console.log(apiUrl)

const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true
})

export default instance
