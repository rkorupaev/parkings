import axiosInstance from "../components/utils/axiosInstance";

export default class AlarmsService {
    static async getAlarms(config) {
        return axiosInstance.get('/APIServer/api/v2/alarms', config);
    }

    static async processAlarm(alarmId, config) {
        return axiosInstance.put('/APIServer/api/v2/alarms/'+ alarmId + '/solve', config);
    }
}
