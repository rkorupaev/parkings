import axiosInstance from "../components/utils/axiosInstance";
import {API_BASE_IP} from "../environment";

export default class EventService {
    static async getCardEvents(config) {
        return axiosInstance.get('/APIServer/api/v2/cardEvents', config);
    }

    static async getDeviceUserEvents(config) {
        return axiosInstance.get('/APIServer/api/v2/deviceUserEvents', config);
    }

    static async getDeviceUserEventsTypes() {
        return axiosInstance.get('/APIServer/api/v2/deviceEventTypes');
    }

    static async updateDeviceEventsTemplate(config) {
        return axiosInstance.put('/APIServer/api/v2/deviceEventTemplate/'+ config.deviceEventTemplateId, {
            deviceEventTypeCustomDescription: config.deviceEventTypeCustomDescription,
            eventColor: config.eventColor,
            eventSound: config.eventSound,
            isVisible: config.isVisible
        });
    }

    static async resetDeviceEventsTemplate(config, mode) {
        const URL = mode === 'single' ? '/APIServer/api/v2/deviceEventTemplate/' + config.deviceEventTemplateId : '/APIServer/api/v2/deviceEventTemplate/';
        return axiosInstance.delete(URL);
    }

    static async addComment(config) {
        return axiosInstance.post('/APIServer/api/v2/deviceEventComment', config);
    }

    static async getEventPayInfo(config) {
        return axiosInstance.get('/APIServer/api/v2/cardPaid/' + config);
    }

    static async getEventTemlates() {
        return axiosInstance.get('/APIServer/api/v2/deviceEventTemplate');
    }


}
