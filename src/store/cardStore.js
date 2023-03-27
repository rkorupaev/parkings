import {makeAutoObservable} from "mobx";
import CardService from "../services/CardService";

class CardStore {
    card = null;
    isLoaded = false;

    queryParams = {

    }

    constructor() {
        makeAutoObservable(this);
    }

    getCardInfo(type) {
        this.setIsLoaded(false);
        switch (type) {
            case 0 || 1:
                CardService.getCardSingle({params: this.queryParams}).then((response) => {
                    this.setCard(response.data.singleCards[0]);
                    console.log(response.data.singleCards[0]);
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    this.setIsLoaded(true);
                });
                break;
            case 2:
                CardService.getCardLongTerm({params: this.queryParams}).then((response) => {
                    this.setCard(response.data.cards);
                    console.log(response.data.cards);
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    this.setIsLoaded(true);
                });
                break;
        }
    }

    setCard(card) {
        this.card = card;
    }

    setIsLoaded(status) {
        this.isLoaded = status;
    }

    setQuery(params){
        this.queryParams = {...this.queryParams, ...params};
    }

}

export default new CardStore();
