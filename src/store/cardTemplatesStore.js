import {makeAutoObservable} from "mobx";
import CardTemplatesService from "../services/CardTemplatesService";

class CardTemplatesStore {
    longTermTemplates = [];
    shortTermTemplates = [];
    queryParams = {
        status: 'ACTIVE'
    };

    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    getLongTermTemplates(id) {
        this.setIsLoading(true);
        return CardTemplatesService.getLongTermTemplates(id)
            .then((response) => {
                this.setLongTermTempaltes(response.data.cardTemplates);
                console.log(response.data.cardTemplates);
                return response;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getShortTermTemplates(id) {
        this.setIsLoading(true);
        CardTemplatesService.getShortTermTemplates(id)
            .then((response) => {
                this.setShortTermTempaltes(response.data.singleCardTemplates);
                console.log(response.data.singleCardTemplates);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setLongTermTempaltes(templates) {
        this.longTermTemplates = [...templates];
    }

    setShortTermTempaltes(templates) {
        this.shortTermTemplates = [...templates];
    }

    setQueryParams(params) {
        this.queryParams = {...this.queryParams, ...params}
    }

    setIsLoading(status) {
        this.isLoading = status;
    }
}

export default new CardTemplatesStore();
