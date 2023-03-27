import {makeAutoObservable} from "mobx";
import SystemsService from "../services/SystemsService";

class SystemsStore {
    systems = [];
    queryParams = {
        status: 'ACTIVE'
    };

    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    getSystems() {
        this.setIsLoading(true);
        SystemsService.getSystems({params: this.queryParams})
            .then((response) => {
                this.setSystems(response.data.systems);
                console.log(response.data.systems);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setSystems(systems) {
        this.systems = [...systems];
    }

    setQueryParams(params) {
        this.queryParams = {...this.queryParams, ...params}
    }

    setIsLoading(status) {
        this.isLoading = status;
    }
}

export default new SystemsStore();
