import {makeAutoObservable} from "mobx";
import ClientsAndCardsService from "../services/ClientsAndCardsService";

class CompaniesStore {
    companies = [];
    isLoaded = true;

    queryParams = {
        status: 'ACTIVE'
    }

    constructor() {
        makeAutoObservable(this);
    }

    getCompanies() {
        this.setIsLoaded(false);
        return ClientsAndCardsService.getCompanies({params: this.queryParams}).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    addCompany(data) {
        this.setIsLoaded(false);
        return ClientsAndCardsService.addCompany(data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    updateCompany(data) {
        this.setIsLoaded(false);
        return ClientsAndCardsService.updateCompany(data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    setClients(companies) {
        this.companies = companies;
    }

    setIsLoaded(status) {
        this.isLoaded = status;
    }

    setQuery(params) {
        this.queryParams = {...this.queryParams, ...params};
    }

}

export default new CompaniesStore();
