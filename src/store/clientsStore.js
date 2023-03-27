import {makeAutoObservable} from "mobx";
import ClientsAndCardsService from "../services/ClientsAndCardsService";

class ClientsStore {
    clients = [];
    isLoaded = true;
    grz = [];

    queryParams = {
        status: 'ACTIVE'
    }
    
    constructor() {
        makeAutoObservable(this);
    }

    getClients() {
        this.setIsLoaded(false);
        return ClientsAndCardsService.getClients({params: this.queryParams}).then((response) => {
            console.log(response);
            this.setClients(response.data.clients);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    updateClientGRZ(data, endpoint) {
        this.setIsLoaded(false);
        return ClientsAndCardsService.updateGRZarray(data, endpoint).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    updateClient(data) {
        this.setIsLoaded(false);
        return ClientsAndCardsService.updateClient(data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    addClient(data) {
        this.setIsLoaded(false);
        return ClientsAndCardsService.addClient(data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    setClients(clients) {
        this.clients = clients;
    }

    setIsLoaded(status) {
        this.isLoaded = status;
    }

    setQuery(params) {
        this.queryParams = {...this.queryParams, ...params};
    }

    setGrz(grz) {
        this.grz = grz;
    }

    addGrz(grz) {
        this.grz = [...this.grz, grz];
    }

}

export default new ClientsStore();
