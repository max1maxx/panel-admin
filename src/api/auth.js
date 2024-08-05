import axios from './axios.js';

export const registerRequest = user => axios.post(`/register`, user)
export const loginRequest = user => axios.post(`/login`, user)
export const getAllUsersRequest = async () => axios.get(`/users`)
export const getUserByIdentiRequest = cedulaRUC => axios.get(`/users/cedulaRUC`, cedulaRUC)
export const verifyTokenRequest = async () => axios.get(`/verify`)
export const updateUserRequest = user => axios.post(`/updateuser`, user)
export const deleteUserRequest = user => axios.post(`/deleteuser`, user)

