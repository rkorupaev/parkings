import {makeAutoObservable} from "mobx";
import EventService from "../services/EventService";

class CardEventsStore {
    cardEvents = [];
    defaultQueryParams = {
        limit: 100,
        offset: 0
    };
    cardsCount = 0;

    queryParams = {
        limit: 100,
        offset: 0
    };

    gridQueryParams = {
        limit: 100,
        offset: 0
    }

    isLoading = false;
    controller = null;

    constructor() {
        makeAutoObservable(this);
    }

    getCardEvents(pagination) {
        this.setIsLoading(true);

        this.controller = new AbortController();

        EventService.getCardEvents(pagination ? {
            params: this.gridQueryParams,
            signal: this.controller.signal
        } : {params: this.queryParams, signal: this.controller.signal})
            .then((response) => {
                this.setCardEvents(response.data.cardEvents);
                this.setCardsCount(response.data.count);
                console.log(response.data.cardEvents);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getCardInfo(uuid) {
        return EventService.getCardEvents({
            params: {
                uuid: uuid
            }
        }).then(response => response.data.cardEvents);
    }

    setCardEvents(events) {
        this.cardEvents = [...events];
    }

    setCardsCount(count) {
        this.cardsCount = count;
    }

    setQueryParams(params, useDefault = true) {
        this.queryParams = useDefault ? {...this.queryParams, ...params} : params;
        if (params.lpr === '') delete this.queryParams.lpr;
    }

    resetQueryParams() {
        this.queryParams = {
            limit: 100,
            offset: 0,
        }
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    getEventsFromWs(event) {
        this.modifiedEvents.pop();
        this.modifiedEvents.unshift({
            commentText: event.comment,
            deviceEventId: event.event_id,
            deviceEventTime: event.device_event_time,
            deviceEventTypeCustomDescription: "",
            deviceEventTypeId: event.event_type_id,
            deviceId: event.device_id,
            eventTime: event.event_time,
            ison: true,
            lparam1: event.lparam1,
            lparam2: event.lparam2,
            sourceTypeId: null,
            sourceUserId: null,
            terminalIName: event.terminal_name,
            terminalId: event.terminal_id,
            uuid: event.uuid,
        });
    }

    setGridQueryParams(params) {
        this.gridQueryParams = {...params};
    }
}

export default new CardEventsStore();
