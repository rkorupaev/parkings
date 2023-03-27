import axiosInstance from "../components/utils/axiosInstance";

const setQueryForUrl = (config) => {
    let query = '?';
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            query += `${key}=${config[key]}&`;
        }
    }

    query = query.slice(0, -1);
    console.log(query, 'query');
    return query;
}

export default class ReportsService {
    static async getEventsReport(params, config) {
        return axiosInstance.post('/APIServer/api/v2/reportEvents', params, config);
    }

    static async getUserActionsReport(params, config) {
        return axiosInstance.get('/APIServer/api/v2/reportUserJournal' + setQueryForUrl(params), config);
    }

    static async getCapacityReport(params, config) {
        return axiosInstance.post('/APIServer/api/v2/reportPlace', params, config);
    }

    static async getPaymentAndMovementSummaryReport(params, config) {
        return axiosInstance.post('/APIServer/api/v2/reportPayment', params, config);
    }

    static async getPaymentAndMovementDistributionReport(params, config) {
        return axiosInstance.post('/APIServer/api/v2/reportAvgTransaction', params, config);
    }

    static async getPaymentAndMovementReport(params, config) {
        return axiosInstance.post('/APIServer/api/v2/reportTransaction', params, config);
    }

    static async getLongtermCardsReport(params, config) {
        return axiosInstance.post('/APIServer/api/v2/reportCardTransaction', params, config);
    }

    static async getShiftReport(params ,config) {
        return axiosInstance.post('/APIServer/api/v2/reportFiscalOperationsMain', params, config);
    }

    static async getShiftReportSide(params, config) {
        return axiosInstance.post('/APIServer/api/v2/reportFiscalOperations', params, config);
    }

    static async getEventsReportFile(config) {
        return axiosInstance.post('/APIServer/api/v2/reportEventsFile', config, {responseType: 'blob'});
    }

    static async getUserActionsReportFile(config) {
        return axiosInstance.get('/APIServer/api/v2/reportUserJournalFile' + setQueryForUrl(config), {responseType: 'blob'});
    }

    static async getCapacityReportFile(config) {
        return axiosInstance.post('/APIServer/api/v2/reportPlaceFile', config, {responseType: 'blob'});
    }

    static async getPaymentAndMovementSummaryReportFile(config) {
        return axiosInstance.post('/APIServer/api/v2/reportPaymentFile', config, {responseType: 'blob'});
    }

    static async getPaymentAndMovementDistributionReportFile(config) {
        return axiosInstance.post('/APIServer/api/v2/reportAvgTransactionFile', config, {responseType: 'blob'});
    }

    static async getPaymentAndMovementReportFile(config) {
        return axiosInstance.post('/APIServer/api/v2/reportTransactionFile', config, {responseType: 'blob'});
    }

    static async getLongtermCardsReportFile(config) {
        return axiosInstance.post('/APIServer/api/v2/reportCardTransactionFile', config, {responseType: 'blob'});
    }

    static async getShiftReportFile(config) {
        return axiosInstance.post('/APIServer/api/v2/reportFiscalOperationsFile', config, {responseType: 'blob'});
    }
}
