import axiosInstance from "../components/utils/axiosInstance";

export default class ClientsAndCardsService {
    static async updateCard(config) {
        return axiosInstance.put('/APIServer/api/v1/card', config);
    }

    static async saveNewCard(config) {
        return axiosInstance.post('/APIServer/api/v1/card', config);
    }

    static async getCompanies(config) {
        return axiosInstance.get('/APIServer/api/v1/company',config);
    }

    static async addCompany(config) {
        return axiosInstance.post('/APIServer/api/v1/company',config);
    }

    static async updateCompany(config) {
        return axiosInstance.put('/APIServer/api/v1/company',config);
    }

    static async getClients(config) {
        return axiosInstance.get('/APIServer/api/v1/client', config);
    }

    static async updateClient(config) {
        return axiosInstance.put('/APIServer/api/v1/client', config);
    }

    static async addClient(config) {
        return axiosInstance.post('/APIServer/api/v1/client', config);
    }

    static async getCards(config) {
        return axiosInstance.get('/APIServer/api/v1/card', config);
    }

    static async getDetailedPlaces(config) {
        return axiosInstance.get('/APIServer/api/v2/detailedPlaces', config);
    }

    static async updateGRZarray(config, endpoint) {
        return axiosInstance.put(`/APIServer/api/v1/${endpoint}`, config);
    }
}
