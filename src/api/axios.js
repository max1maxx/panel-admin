import axios from 'axios'

const apiUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : '/api';
// console.log(apiUrl)

const instance = axios.create({
    baseURL: apiUrl,
})

export default instance
