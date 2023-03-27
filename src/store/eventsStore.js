import {makeAutoObservable, toJS} from "mobx";
import EventService from "../services/EventService";

const defaultQueryParams = {
    limit: 100,
    offset: 0,
}

class EventsStore {
    events = [];
    modifiedEvents = [];
    eventTypes = [];
    eventTemplates = [];
    defaultQueryParams = {
        limit: 100,
        offset: 0
    };

    controller = null;

    queryParams = defaultQueryParams;

    gridQueryParams = defaultQueryParams;

    eventsCount = 0;
    payInfo = {};

    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    getEvents(pagination) {
        this.setIsLoading(true);

        this.controller = new AbortController();

        return EventService.getDeviceUserEvents(pagination ? {
            params: this.gridQueryParams,
            signal: this.controller.signal
        } : {
            params: this.queryParams,
            signal: this.controller.signal
        })
            .then((response) => {
                this.setEvents(response.data.deviceEvents);
                this.setEventsCount(response.data.count);
                this.setModifiedEvents(response.data.deviceEvents);
                console.log(response.data.deviceEvents);
                // this.getEventTemplates();
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getEventTemplates() {
        // this.setIsLoading(true);
        EventService.getEventTemlates()
            .then((response) => {
                this.setEventTemplates(response.data.deviceEventTemplates);
                console.log(response.data.deviceEventTemplates, 'templates');
            })
            .catch((error) => console.error(error))
            .finally(() => {
                // this.setIsLoading(false);
            });
    }

    getEventTypes() {
        // this.setIsLoading(true);
        return EventService.getDeviceUserEventsTypes()
            .then((response) => {
                this.setEventsTypes(response.data.deviceEvents);
                console.log(response.data.deviceEvents);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                // this.setIsLoading(false);
            });
    }

    getEventPayInfo(eventId) {
        this.setIsLoading(true);
        EventService.getEventPayInfo(eventId)
            .then((response) => {
                if (!response.data.error) {
                    this.setPayInfo(response.data);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    _setController(controller) {
        this.controller = controller;
    }

    setEvents(events) {
        this.events = [...events];
    }

    setModifiedEvents(events) {
        this.modifiedEvents = [...events];
    }

    setEventTemplates(templates) {
        this.eventTemplates = [...templates];
    }

    setEventsCount(count) {
        this.eventsCount = count;
    }

    setEventsTypes(types) {
        this.eventTypes = types;
    }

    setQueryParams(params, useDefault = true) {
        this.queryParams = useDefault ? {...this.queryParams, ...params} : params;
    }

    setDefaultQueryParams() {
        this.queryParams = defaultQueryParams;
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    _findEventTemplate(id) {
        return id ? toJS(this.eventTemplates).find(template => template.deviceEventTypeId === id) : null;
    }

    getEventsFromWs(event) {
        if (this.queryParams.offset === 0) {
            let copy = toJS(this.modifiedEvents);
            copy.pop();
            this._findEventTemplate(event.event_type_id);

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
                commentText: event.comment,
                deviceEventId: event.event_id || Date.now(),
                deviceEventTime: event.device_event_time,
                deviceEventTypeCustomDescription: this._findEventTemplate(event.event_type_id).deviceEventTypeCustomDescription || '',
                deviceEventTypeId: event.event_type_id,
                deviceId: event.device_id,
                eventTime: formatTimeFromWS(event.event_time),
                ison: true,
                lparam1: event.lparam1,
                lparam2: event.lparam2,
                sourceTypeId: null,
                sourceUserId: null,
                terminalName: event.terminal_name + `[${event.terminal_number}]`,
                terminalId: event.terminal_id,
                uuid: event.uuid,
            });
            this.modifiedEvents = copy;
        }
        this.eventsCount++;
    }

    saveComment(id, comment) {
        this.setIsLoading(true);
        return EventService.addComment({
            deviceEventId: id,
            commentText: comment
        }).then((response) => response)
    }

    updateDeviceEventsTemplate(data) {
        this.setIsLoading(true);
        return EventService.updateDeviceEventsTemplate(data).then((response) => {
            console.log(response.data);
            return response;
        }).finally(() => {
            this.setIsLoading(false);
        });
    }

    resetDeviceEventsTemplate(data, mode) {
        this.setIsLoading(true);
        return EventService.resetDeviceEventsTemplate(data, mode).then((response) => {
            console.log(response.data);
            return response;
        }).finally(() => {
            this.setIsLoading(false);
        });
    }

    getAllTypesIds() {
        return this.eventTypes.map(item => item.deviceEventTypeId);
    }

    setPayInfo(info) {
        this.payInfo = {...info};
    }

    getAllEventTypesIds() {
        return this.eventTypes.map(type => type.deviceEventTypeId);
    }

    setGridQueryParams(params) {
        this.gridQueryParams = {...this.gridQueryParams, ...params};
    }
}

export default new EventsStore();
