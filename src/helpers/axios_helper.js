import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:81'
axios.defaults.headers.post['Content-Type'] = 'application/json'

export const getAuthToken = () => {
    return window.localStorage.getItem('authToken');
}

export const setAuthToken = (token) => {
    window.localStorage.setItem('authToken', token);
}

export const setAuthHeader = (token) => {
    if (token !== null) {
        window.localStorage.setItem("authToken", token);
    } else {
        window.localStorage.removeItem("authToken");
    }
};

export const request = (method, url, data) => {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers = { 'Authorization': `Bearer ${getAuthToken()}`};
    }

    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data
    });
};