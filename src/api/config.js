import axios from './axios.js'
import axiosacs from './axios.acs.js'

export const getDevicesRequest = () => axios.get('/devices')
export const changeWifiConfig = (data) => axiosacs.post('/cambiarWifi', data)
export const changeLanConfig = (data) => axiosacs.post('/cambiarLan', data)
export const changeMapPortsConfig = (data) => axiosacs.post('/cambiarMapeoPuertos', data)
export const getConfigs = (data) => axiosacs.post('/obtenerDatosPanel', data)
