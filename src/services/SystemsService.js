import axiosInstance from "../components/utils/axiosInstance";

export default class SystemService {
    static async getSystems(config) {
        return axiosInstance.get('/APIServer/api/v2/systems', config);
    }
}
