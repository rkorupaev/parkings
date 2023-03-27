import {makeAutoObservable} from "mobx";
import ParkingsService from "../services/ParkingsService";

class ParkingsStore {
    parkings = [];
    queryParams = {
        status: 'ACTIVE',
    };
    isLoading = false;
    currentParking = {};
    companyParkings = [];

    constructor() {
        makeAutoObservable(this);
    }

    getParkings() {
        this.setIsLoading(true);
        ParkingsService.getParkings({params: this.queryParams})
            .then((response) => {
                this.setParkings(response.data.parkings);
                console.log(response.data.parkings);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setParkings(parkings) {
        this.parkings = [...parkings];
    }

    setQueryParams(params) {
        this.queryParams = {...this.queryParams, ...params}
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    getAllParkingIds() {
        return this.parkings.map(item => item.parkingId);
    }

    setCurrentParking(parking) {
        this.currentParking = parking;
    }

    setCompanyParkings(parkings) {
        this.companyParkings = parkings;
    }
}

export default new ParkingsStore();
