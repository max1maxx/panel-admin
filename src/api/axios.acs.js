import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://45.173.112.9:3005/api/config'
})

export default instance