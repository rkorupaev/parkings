import axiosInstance from "../components/utils/axiosInstance";

export default class PlacesService {
    static async getPlaces(parkingId) {
        return axiosInstance.get(`/APIServer/api/v2/complex_places/parking/${parkingId}`);
    }

    static async getDetailedPlaces() {
        return axiosInstance.get(`/APIServer/api/v1/detailedPlaces`);
    }

    static async changePlaces(config) {
        return axiosInstance.post(`/APIServer/api/v1/places/`, config);
    }

    static async changeComplexPlaces(id, config) {
        return axiosInstance.put(`/APIServer/api/v2/complex_places/parking/${id}`, config);
    }

    static async addReservedPlaces(type, id ,config) {
        return axiosInstance.post(`/APIServer/api/v2/complex_places/${type}/${id}`, config);
    }

    static async changeReservedPlaces(type, id ,config) {
        return axiosInstance.put(`/APIServer/api/v2/complex_places/${type}/${id}`, config);
    }

    static async getReservedPlaces(type, id) {
        return axiosInstance.get(`/APIServer/api/v2/complex_places/${type}/${id}`);
    }

    static async deleteReservedPlaces(type, id, placeId) {
        const URL = placeId ? `/APIServer/api/v2/complex_places/${type}/${id}?placeId=${placeId}` : `/APIServer/api/v2/complex_places/${type}/${id}`;
        return axiosInstance.delete(URL);
    }
}
