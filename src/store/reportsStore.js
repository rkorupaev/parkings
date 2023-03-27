import {makeAutoObservable, toJS} from "mobx";
import ReportsService from "../services/ReportsService";
import {dateToISOLikeButLocal, substractDays} from "../components/utils/utils";
import download from 'downloadjs';

const checkDataType = (type) => {
    const types = {
        "getEventsReport": {
            type: 'deviceEvents',
            alias: 'deviceEventId',
        },
        "getUserActionsReport": {
            type: 'userEvents',
            alias: 'userEventId',
        },
        "getCapacityReport": {
            type: 'reportPlaces',
            alias: 'id',
        },
        "getPaymentAndMovementSummaryReport": {
            type: 'reportPayments',
            alias: 'id',
        },
        "getPaymentAndMovementDistributionReport": {
            type: 'reportAvgTransactions',
            alias: 'id',
        },
        "getPaymentAndMovementReport": {
            type: 'reportTransactions',
            alias: 'id',
        },
        "getLongtermCardsReport": {
            type: 'reportCardTransactions',
            alias: 'id',
        },
        "getShiftReport": {
            type: 'reportFiscalShifts',
            alias: 'shiftOpenDate',
        },
    }
    return types[type];
}

const defaultQueryParams = {
    limit: 100,
    offset: 0,
    tillTime: dateToISOLikeButLocal(Date.now()).slice(0, 19),
    fromTime: dateToISOLikeButLocal(substractDays(2)).slice(0, 19),
}

class ReportsStore {
    reports = [];
    isLoading = false;
    reportsCount = 0;
    id_alias = '';
    sideReports = [];
    sideReportsCount = 0;
    currentReportRow = null;
    fromData = null;
    tillData = null;
    summaryValue = 0;
    chosenTerminals = [];

    queryParams = defaultQueryParams;
    gridQueryParams = defaultQueryParams;

    sideReportQueryParams = defaultQueryParams;

    resetCallback = null;

    controller = null;

    constructor() {
        makeAutoObservable(this);
    }

    getReports(type, pagination) {
        this.setIsLoading(true);

        this.controller = new AbortController();

        this.setIdAlias(checkDataType(type).alias);

        ReportsService[type](pagination ? {...this.gridQueryParams} : {...this.queryParams}, {signal: this.controller.signal})
            .then((response) => {
                this.setReports(response.data[checkDataType(type).type]);
                this.setReportsCount(response.data.count);
                console.log(response.data);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getSideReports() {
        this.setIsLoading(true);
        ReportsService.getShiftReportSide({...this.sideReportQueryParams})
            .then((response) => {
                this.setSideReports(response.data.reportFiscalOperations);
                this.setSideReportsCount(response.data.count);
                this.setSummeryValue(response.data.itogValue);
                console.log(response.data);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getReportsFile(type, format, side) {
        this.setIsLoading(true);
        const fileName = `report: ${this.queryParams.fromTime} - ${this.queryParams.fromTime}.${format}`;
        const queryData = side ? structuredClone(toJS(this.sideReportQueryParams)) : structuredClone(toJS(this.queryParams));
        delete queryData.limit;
        delete queryData.offset;
        queryData.type = format;

        ReportsService[type](queryData)
            .then((response) => {
                console.log(response);
                if (response.status.toString()[0] !== '4') {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setReports(reports) {
        this.reports = [...reports];
    }

    setSideReports(reports) {
        this.sideReports = [...reports];
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    setQueryParams(params, useDefault = true) {
        this.queryParams = useDefault ? {...this.queryParams, ...params} : params;
        this.setSideQueryParams(this.queryParams);
    }

    deleteFieldQueryParams(field) {
        delete this.queryParams[field];
    }

    resetQueryParams() {
        this.queryParams = defaultQueryParams;
    }

    setSideQueryParams(params) {
        this.sideReportQueryParams = {...this.sideReportQueryParams,  ...params, limit: 100, offset: 0};
    }

    resetGridQueryParams() {
        this.gridQueryParams = defaultQueryParams;
    }

    setGridQueryParams(params) {
        this.gridQueryParams = {...this.gridQueryParams, ...params};
    }

    setReportsCount(count) {
        this.reportsCount = count;
    }

    setSideReportsCount(count) {
        this.sideReportsCount = count;
    }

    setIdAlias(alias) {
        this.id_alias = alias;
    }

    setCurrentReportRow(row) {
        this.currentReportRow = row;
    }

    resetSideReports() {
        this.setSideReportsCount(0);
        this.setSideReports([]);
        // this.setSideQueryParams(defaultQueryParams);
    }

    setTillDate(date) {
        this.tillData = date;
    }

    setFromDate(date) {
        this.fromData = date;
    }

    setSummeryValue(value) {
        this.summaryValue = value;
    }

    setChosenTerminals(terminals) {
        this.chosenTerminals = terminals;
    }

    setResetPartViewFilterCallback(callback) {
        this.resetCallback = callback;
    }
}

export default new ReportsStore();
