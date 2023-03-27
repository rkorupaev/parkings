import {makeAutoObservable} from "mobx";
import ClientsAndCardsService from "../services/ClientsAndCardsService";

class CardsStore {
    cards = [];
    isLoaded = true;

    queryParams = {
        status: 'ACTIVE'
    }

    constructor() {
        makeAutoObservable(this);
    }

    getCards() {
        this.setIsLoaded(false);
        return ClientsAndCardsService.getCards({params: this.queryParams}).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    saveCard(isNew, data) {
        // this.setIsLoaded(false);
        if (isNew) {
            return ClientsAndCardsService.saveNewCard(data).then((response) => {
                console.log(response);
                return response;
            })
            //     .catch((error) => {
            //     console.error(error);
            // }).finally(() => {
            //     this.setIsLoaded(true);
            // });
        } else {
            return ClientsAndCardsService.updateCard(data).then((response) => {
                console.log(response);
                return response;
            })
            //     .catch((error) => {
            //     console.error(error);
            // }).finally(() => {
            //     this.setIsLoaded(true);
            // });
        }
    }

    deleteCard(data) {
        this.setIsLoaded(false);
        return ClientsAndCardsService.updateCard(data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    updateCardGRZ(data, endpoint) {
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

    changeCardGRZ(data) {
        this.setIsLoaded(false);
        return ClientsAndCardsService.updateCard(data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    setCards(cards) {
        this.cards = cards;
    }

    setIsLoaded(status) {
        this.isLoaded = status;
    }

    setQuery(params) {
        this.queryParams = {...this.queryParams, ...params};
    }

}

export default new CardsStore();
