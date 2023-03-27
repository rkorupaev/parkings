import axiosInstance from "../components/utils/axiosInstance";

export default class ParkingsService {
    static async getParkings(config) {
        return axiosInstance.get('/APIServer/api/v2/parking', config);
    }

}
