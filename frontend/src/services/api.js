import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', //Where my flask server is running
});

export default api;