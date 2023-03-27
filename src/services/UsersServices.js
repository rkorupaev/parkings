import axiosInstance from "../components/utils/axiosInstance";

export default class UsersServices {
    static async getUsers() {
        let URL = `/APIServer/api/v2/users/?status=ACTIVE`;
        return axiosInstance.get(URL);
    }

    static async getRoleGroups(id) {
        let URL = id ? `/APIServer/api/v2/roles/${id}?status=ACTIVE` : `/APIServer/api/v2/roles/?status=ACTIVE`;
        return axiosInstance.get(URL);
    }

    static async createRoleGroups(config) {
        let URL = `/APIServer/api/v2/roles/`;
        return axiosInstance.post(URL, config);
    }

    static async updateRoleGroups(id, config) {
        let URL = `/APIServer/api/v2/roles/${id}`;
        return axiosInstance.put(URL, config);
    }

    static async updateRoleGroupsRules(id, config) {
        let URL = `/APIServer/api/v2/roles/${id}/rules`;
        return axiosInstance.put(URL, {accessList: config});
    }

    static async getRoleRules(id) {
        let URL = `/APIServer/api/v2/roles/${id}/rules`;
        return axiosInstance.get(URL);
    }

    static async updateRoleRules(id, config) {
        let URL = `/APIServer/api/v2/roles/${id}/rules`;
        return axiosInstance.put(URL, config);
    }

    static async getUserInfo(id) {
        return axiosInstance.get(`/APIServer/api/v2/users/${id}`);
    }

    static async updateUserInfo(id, config) {
        return axiosInstance.put(`/APIServer/api/v2/users/${id}`, config);
    }

    static async createUserInfo(config) {
        return axiosInstance.post(`/APIServer/api/v2/users`, config);
    }

    static async addUserParking(userId, parkingId) {
        return axiosInstance.post(`/APIServer/api/v2/users/${userId}/parking/${parkingId}`);
    }

    static async deleteUserParking(userId, parkingId) {
        return axiosInstance.delete(`/APIServer/api/v2/users/${userId}/${parkingId}`);
    }

    static async changeUserParkingTerminalStatus(userId, parkingId, body) {
        return axiosInstance.put(`/APIServer/api/v2/users/${userId}/parking/${parkingId}`, body);
    }

    static async changeUserPassword(userId, body) {
        return axiosInstance.put(`/APIServer/api/v2/changeUserPassword/${userId}`, body);
    }
}
