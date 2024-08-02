import axios from './axios.js';

export const registerRequest = user => axios.post(`/register`, user)
export const loginRequest = user => axios.post(`/login`, user)
export const getAllUsersRequest = async () => axios.get(`/users`)
export const getUserByIdentiRequest = identi => axios.get(`/users/identi`, identi)
export const verifyTokenRequest = async () => axios.get(`/verify`);
