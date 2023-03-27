import axios from "axios";
import userStore from "../../store/userStore";
import {API_BASE_IP} from "../../environment";

const axiosInstance = axios.create({
    baseURL: API_BASE_IP,
})

axiosInstance.interceptors.request.use((config,) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

axiosInstance.interceptors.response.use((config) => {
    return config;
}, (error) => {
    if (error.response.status === 403) {
        if (error.response.data.errorMsg && error.response?.data?.errorMsg?.includes('expired Bearer token')) {
            userStore.setIsAuth(false)
        } else if (error.response.data.error && error.response?.data?.error?.includes('access-denied')) {
            userStore.setIsAuth(false)
        } else if (error.response?.config?.responseType === 'blob') {
            userStore.setIsAuth(false)
        }
    }

    return error.response;
});

export default axiosInstance;
