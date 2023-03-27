import axiosInstance from "../components/utils/axiosInstance";

export default class CardTemplatesService {
    static async getLongTermTemplates(id) {
        const URL = id ? '/APIServer/api/v2/cardTemplate/' + id : '/APIServer/api/v2/cardTemplate/';
        return axiosInstance.get(URL);
    }

    static async getShortTermTemplates(id) {
        const URL = id ? '/APIServer/api/v2/singleCardTemplate/' + id : '/APIServer/api/v2/singleCardTemplate/';
        return axiosInstance.get(URL);
    }
}
