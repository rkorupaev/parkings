import {makeAutoObservable, toJS} from "mobx";
import AlarmsService from "../services/AlarmsService";
import eventsStore from "./eventsStore";

const defaultQueryParams = {
    limit: 100,
    offset: 0,
    statusId: 'NEW'
}

class AlarmsStore {
    alarms = [];
    alarmsCount = 0;
    queryParams = defaultQueryParams;
    isLoading = false;
    controller = null;

    constructor() {
        makeAutoObservable(this);
    }

    getAlarms() {
        this.setIsLoading(true);

        this.controller = new AbortController();

        AlarmsService.getAlarms({params: this.queryParams, signal: this.controller.signal})
            .then((response) => {
                this.setAlarms(response.data.alarms);
                this.setAlarmsCount(response.data.count);
                console.log(response.data.alarms);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setAlarms(alarms) {
        this.alarms = [...alarms];
    }

    setAlarmsCount(count) {
        this.alarmsCount = count;
    }

    updateAlarms(updatedAlarm) {
        let copy = Object.assign([], toJS(this.alarms));
        const alarmIndex = this.alarms.findIndex(alarm => alarm.alarmId === updatedAlarm.alarmId);
        copy[alarmIndex] = updatedAlarm;
        this.setAlarms(copy);
    }

    setQueryParams(params) {
        this.queryParams = {...this.queryParams, ...params}
    }

    setDefaultQueryParams() {
        this.queryParams = defaultQueryParams;
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    _findEventTemplate(id) {
        return id ? toJS(eventsStore.eventTemplates).find(template => template.deviceEventTypeId === id) : null;
    }

    getAlarmsFromWs(alarm) {
        if (this.queryParams.offset === 0) {

            let copy = structuredClone(toJS(this.alarms));
            copy.pop();

            const formatTimeFromWS = (inputDate) => {
                let result = inputDate;
                if (result) {
                    let dateArray = result.split(' ');
                    result = dateArray[0].split('-');
                    result = result.reverse().join('-') + ' ' + dateArray[1];
                }

                return result;
            }

            copy.unshift({
                alarmEndComment: alarm.comment,
                alarmId: alarm.alarmId,
                alarmTimeEnd: formatTimeFromWS(alarm.alarm_time_closed),
                alarmTimeStart: formatTimeFromWS(alarm.alarm_time),
                deviceEventId: alarm.alarm_id || Date.now(),
                deviceEventTypeCustomDescription: this._findEventTemplate(alarm.event_type_id).deviceEventTypeCustomDescription || '',
                deviceEventTypeId: alarm.event_type_id,
                deviceId: alarm.device_id,
                lparam1: alarm.lparam1,
                lparam2: alarm.lparam2,
                terminalName: alarm.terminal_name + `[${alarm.terminal_number}]`,
                terminalId: alarm.terminal_id,
                status: alarm.alarm_status,
                userClosedId: alarm.user_closed_id,
            });
            this.alarmsCount++;
            this.alarms = copy;
        }
    }
}

export default new AlarmsStore();
