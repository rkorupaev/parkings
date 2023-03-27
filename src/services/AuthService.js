import axiosInstance from "../components/utils/axiosInstance";

export default class AuthService {
    static async login(username, password) {
        return axiosInstance.post('/APIServer/api/v1/auth', {
            login: username,
            password: password,
            timestamp: new Date().toISOString()
        });
    }
}
