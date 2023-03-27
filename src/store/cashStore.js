import {makeAutoObservable} from "mobx";
import CashService from "../services/CashService";

class CashStore {
    cash = {};
    isLoaded = true;
    changeMoney = {
        notes: {},
        coins: {}
    }

    givenMoney = {
        notes: {},
        coins: {}
    }

    amount = 0;
    summ = 0;


    constructor() {
        makeAutoObservable(this);
    }

    getCashInfo(parkingId, terminalNumber) {
        this.setIsLoaded(false);
        CashService.getCashInfo({
            params: {
                parkingNumber: parkingId,
                terminalNumber: terminalNumber
            }
        }).then((response) => {
            this.setCash(response.data);
            console.log(response.data);
        })
            .then(() => {
            this.setChangeMoney();
            this.setGivenMoney();
        })
            .catch((error) => {
            console.log(error)
        }).finally(() => {
            this.setIsLoaded(true);
        });
    }

    setCash(cash) {
        this.cash = cash;
    }

    setChangeMoney() {
        this.changeMoney = {notes: this.getChangeMoney('notes'), coins: this.getChangeMoney('coin')};
    }

    setGivenMoney() {
        this.givenMoney = {notes: this.getGivenMoney('notes'), coins: this.getGivenMoney('coin')};
    }

    setIsLoaded(status) {
        this.isLoaded = status;
    }

    getChangeMoney(type) {
        let rowsArray = [];
        let change = this.cash.changeDetails;
        for (let key in change) {
            if (key.includes(type) && change[key] !== 0 ) rowsArray.push({
                nominal: key.slice(type.length) + ' руб.',
                amount: change[key],
                summ:  key.slice(type.length) * change[key]
            });
        }
        console.log(rowsArray, 'rows array');
        return rowsArray;
    }

    getGivenMoney(type) {
        let rowsArray = [];
        let givenMoney = this.cash.givenMoneyDetails;
        for (let key in givenMoney) {
            if (key.includes(type) && givenMoney[key] !== 0) rowsArray.push({
                nominal: key.slice(type.length) + ' руб.',
                amount: givenMoney[key],
                summ: key.slice(type.length) * givenMoney[key]
            });
        }
        console.log(rowsArray, 'rows array');
        return rowsArray;
    }

    getSumm() {
        this.givenMoney.notes.forEach()
    }

}

export default new CashStore();
