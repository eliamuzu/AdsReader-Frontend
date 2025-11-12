const axios = window.axios;

const api = axios.create({
    baseURL: "https://adsreader.onrender.com",
    timeout: 10000,
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

const stored = localStorage.getItem('accessToken');
if (stored) setAuthToken(stored);

export default api;