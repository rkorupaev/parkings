import {makeAutoObservable, toJS} from "mobx";
import PlacesService from "../services/PlacesService";

class PlacesStore {
    places = [];
    systemPlaces = [];
    itemPlaces = [];
    clientItemPlaces = [];
    queryParams = {};
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    getPlaces(parkingId) {
        this.setIsLoading(true);
        PlacesService.getPlaces(parkingId)
            .then((response) => {
                this.setPlaces(response.data.places);
                console.log(response.data.places);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getDetailedPlaces() {
        this.setIsLoading(true);
        return PlacesService.getDetailedPlaces()
            .then((response) => {
                console.log(response.data.detailedPlaces);
                this.setPlaces(response.data.detailedPlaces);
                return response;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    changePlaces(data) {
        this.setIsLoading(true);
        return PlacesService.changePlaces(data)
            .then((response) => {
                console.log(response.data);
                // this.updatePlace(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    changeComplexPlaces(id, data) {
        this.setIsLoading(true);
        return PlacesService.changeComplexPlaces(id, data)
            .then((response) => {
                console.log(response.data);
                // this.updatePlace(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getReservedPlaces(type, id) {
        this.setIsLoading(true);
        return PlacesService.getReservedPlaces(type, id)
            .then((response) => {
                console.log(response.data.complexPlaces);
                if (type === 'company') {
                    this.setItemPlaces(response.data.complexPlaces);
                } else {
                    this.setClientItemPlaces(response.data.complexPlaces);
                }
                return response.data.complexPlaces;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getSystemPlaces(id) {
        this.setIsLoading(true);
        return PlacesService.getReservedPlaces('parking', id)
            .then((response) => {
                console.log(response.data.complexPlaces);
                this.setSystemPlaces(response.data.complexPlaces);
                return response.data.complexPlaces;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    addReservedPlaces(type, id, data) {
        this.setIsLoading(true);
        return PlacesService.addReservedPlaces(type, id, data)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    changeReservedPlaces(type, id, data) {
        this.setIsLoading(true);
        return PlacesService.changeReservedPlaces(type, id, data)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    deleteReservedPlaces(type, id, parkingId) {
        this.setIsLoading(true);
        const placeId = type === 'company' ? this.getCompanyPlaceId(id, parkingId) : this.getClientPlaceId(id, parkingId);
        return PlacesService.deleteReservedPlaces(type, id, placeId)
            .then((response) => {
                if (response.status.toString()[0] === '2') {
                    type === 'company' ? this.deleteItemPlace(placeId) : this.deleteClientItemPlace(placeId);
                }
                console.log(response);
                return response;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getCompanyPlaceId(companyId, parkingId) {
        const place = toJS(this.itemPlaces).find(place => place.parkingId === parkingId);
        return place.parkingPlaceId;
    }

    getClientPlaceId(clientId, complexPlaceId) {
        const place = toJS(this.clientItemPlaces).find(place => place.parkingId === complexPlaceId);
        return place.parkingPlaceId;
    }

    setPlaces(places) {
        this.places = places;
    }

    setQueryParams(params) {
        this.queryParams = {...this.queryParams, ...params}
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    setItemPlaces(places) {
        this.itemPlaces = places;
    }

    setClientItemPlaces(places) {
        this.clientItemPlaces = places;
    }

    setSystemPlaces(places) {
        this.systemPlaces = places;
    }

    deleteItemPlace(id) {
        let copy = structuredClone(toJS(this.itemPlaces));
        let placeIndex = this.itemPlaces.findIndex(place => place.parkingPlaceId === id);
        copy.splice(placeIndex, 1);
        this.itemPlaces = copy;
    }

    deleteClientItemPlace(id) {
        let copy = structuredClone(toJS(this.clientItemPlaces));
        let placeIndex = this.clientItemPlaces.findIndex(place => place.parkingPlaceId === id);
        copy.splice(placeIndex, 1);
        this.clientItemPlaces = copy;
    }

    updateDetailedPlace(data) {
        let copy = structuredClone(toJS(this.places));
        const placeIndex = copy.findIndex(item => item.parkingId === data.parkingId);
        copy[placeIndex].nonReservedPlaces = data;
        this.itemPlaces = copy;
    }

    updatePlace(data) {
        let copy = structuredClone(toJS(this.itemPlaces));
        const placeIndex = copy.findIndex(item => item.parkingId === data.parkingId);
        copy[placeIndex] = data;
        this.itemPlaces = copy;
    }

    updateClientPlace(data) {
        let copy = structuredClone(toJS(this.clientItemPlaces));
        const placeIndex = copy.findIndex(item => item.parkingPlaceId === data.parkingPlaceId);
        copy[placeIndex] = data;
        this.clientItemPlaces = copy;
    }
}

export default new PlacesStore();
