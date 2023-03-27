import axiosInstance from "../components/utils/axiosInstance";

export default class CashService {
    static async getCashInfo(config) {
        return axiosInstance.get('/APIServer/api/v1/cashStatus', config);
    }
}
