import {makeAutoObservable, toJS} from "mobx";
import TerminalService from "../services/TerminalService";
import _, {sortBy} from 'underscore';

class terminalsStore {
    terminals = [];
    allTerminals = [];
    isLoading = false;
    queryParams = {
        status: 'ACTIVE'
    }

    statuses = [];
    terminalDevices = {};

    constructor() {
        makeAutoObservable(this);
    }

    getTerminals() {
        this.setIsLoading(true);
        return TerminalService.getTerminals({params: this.queryParams})
            .then((response) => {
                this.setTerminals(response.data.terminals);
                console.log(response.data.terminals);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getAllTerminals() {
        this.setIsLoading(true);
        return TerminalService.getTerminals()
            .then((response) => {
                this.setAllTerminals(response.data.terminals);
                console.log(response.data.terminals);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getTerminalStatus(id) {
        this.setIsLoading(true);
        return TerminalService.getTerminalsStatus({parkingId: id})
            .then((response) => {
                this.setTerminalsStatuses(response.data.terminalInfo);
                console.log(response.data.terminalInfo);
                return response.data.terminalInfo;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getTerminalDevices(terminalId) {
        this.setIsLoading(true);
        TerminalService.getTerminalsDevices(terminalId)
            .then((response) => {
                this.setTerminalDevices(response.data);
                console.log(response.data);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    setTerminals(data) {
        this.terminals = data;
    }

    setAllTerminals(data) {
        this.allTerminals = data;
    }

    setTerminalsStatuses(data) {
        this.statuses = _.sortBy(data, 'statusOnline').reverse();
    }

    setQueryParams(params) {
        this.queryParams = params;
    }

    setTerminalDevices(devices) {
        this.terminalDevices = devices;
    }

    updateTerminalStatus(id, status, mash) {
        let terminalIndex = toJS(this.statuses).findIndex(terminal => terminal.terminalId === id);
        this.statuses[terminalIndex] = {...this.statuses[terminalIndex], ...status};
    }

    updateTerminalMashValue(id, operation) {
        let terminalIndex = toJS(this.statuses).findIndex(terminal => terminal.terminalId === id);
        this.statuses[terminalIndex] = {
            ...this.statuses[terminalIndex],
            mashValue: (operation === 'increase') ? this.statuses[terminalIndex].mashValue + 300
                :
                this.statuses[terminalIndex].mashValue - 300
        }
    }

    getAllTerminalIds(parkings) {
        let terminals = [];
        if (parkings.length) {
            parkings.forEach(parking => {
                terminals = this.terminals.filter(terminal => terminal.parkingId === parking);
            })
            terminals = terminals.map(item => item.terminalId);
        }
        return terminals;
    }

    getTerminalById(id) {
        return toJS(this.terminals).find(terminal => terminal.terminalId === id);
    }
}

export default new terminalsStore();
