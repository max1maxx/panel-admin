// import axiosacs from './axios.acs.js'

// export const getDevicesRequest = () => axiosacs.get('/listar')
// export const getDevicesRequestById = (data) => axiosacs.post('/listarById', data)
// export const changeWifiConfig = (data) => axiosacs.post('/cambiarWifi', data)
// export const changeLanConfig = (data) => axiosacs.post('/cambiarLan', data)
// export const changeMapPortsConfig = (data) => axiosacs.post('/cambiarMapeoPuertos', data)
// export const getConfigs = (data) => axiosacs.post('/obtenerDatosPanel', data)
import axios from './axios.js';
export const getDevicesRequest = async () => axios.get('/config/listarByUser')
export const getDevicesRequestById = (data) => axios.post('/config/listarById', data)
export const changeWifiConfig = (data) => axios.post('/config/cambiarWifi', data)
export const changeLanConfig = (data) => axios.post('/config/cambiarLan', data)
export const changeMapPortsConfig = (data) => axios.post('/config/cambiarMapeoPuertos', data)
export const getConfigs = (data) => axios.post('/config/obtenerDatosPanel', data)