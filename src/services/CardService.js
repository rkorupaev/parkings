import axiosInstance from "../components/utils/axiosInstance";

export default class CardService {
    static async getCardSingle(config) {
        return axiosInstance.get('/APIServer/api/v2/singleCard', config);
    }

    static async getCardLongTerm(config) {
        return axiosInstance.get('/APIServer/api/v1/card', config);
    }

}
