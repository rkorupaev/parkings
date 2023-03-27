import axiosInstance from "../components/utils/axiosInstance";

const URL = '/APIServer/api/v1/classic_command';
const URL_FOR_GATE = '/api/v1/classic_command';
const commands = {
    OPEN_BARIER: 1,
    CLOSE_BARIER: 2,
    BLOCK_BARIER: 12,
    UNBLOCK_BARIER: 13,
    TURN_ON_TERMINAL: 18,
    TURN_OFF_TERMINAL: 19,
    TURN_ON_STUCK_FUNC: 59,
    INCREASE_FREE_EXIT_TIME: 60,
    DECREASE_FREE_EXIT_TIME: 61,
    TURN_OFF_STUCK_FUNC: 62,
    PRODUCE_LOST_TICKET: 101,
    PRINT_REPORT_X: 700,
    CLOSE_SHIFT_Z: 701,
    CLOSE_SHIFT_WITHOUT_Z: 702,
    PRINT_REPORT_Z: 703,
    REINFORCE: 704,
    WITHDRAW: 705,
    OPEN_SHIFT: 722,
    UPDATE_CONFIG: 806,
    DELETE_CONFIG: 807,
    RESTART_TERMINAL: 813,
    RESTART_TERMINAL_APP: 814,
    RESTART_TERMINAL_SYSTEM: 815,
}

export default class TerminalService {
    static async openBarier(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.OPEN_BARIER,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async openGateBarier(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL_FOR_GATE, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.OPEN_BARIER,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async closeBarier(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.CLOSE_BARIER,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async closeGateBarier(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL_FOR_GATE, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.CLOSE_BARIER,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async blockBarier(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.BLOCK_BARIER,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async blockGateBarier(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL_FOR_GATE, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.BLOCK_BARIER,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async unblockBarier(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.UNBLOCK_BARIER,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async turnOnTerminal(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.TURN_ON_TERMINAL,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async turnOffTerminal(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.TURN_OFF_TERMINAL,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async turnOnStuckFunc(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.TURN_ON_STUCK_FUNC,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async increaseFreeExitTime(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.INCREASE_FREE_EXIT_TIME,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async decreaseFreeExitTime(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.DECREASE_FREE_EXIT_TIME,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async turnOffStuckFunc(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.TURN_OFF_STUCK_FUNC,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async printReportX({terminalName, terminalNumber, terminalId}) {
        return axiosInstance.post('/APIServer/application/v1/xorder', {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_PRINT_XREPORT',
            terminalName: terminalName,
            terminalNumber: terminalNumber,
            terminalId: terminalId,
        });
    }

    static async closeShiftZ({terminalName, terminalNumber, terminalId}) {
        return axiosInstance.post('/APIServer/application/v1/zorder', {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_CLOSE_SHIFT',
            terminalId: terminalId,
            terminalNumber: terminalNumber,
            terminalName: terminalName,
        });
    }

    // static async closeShiftWithoutZ(parkingNumber, terminalNumber) {
    //     return axiosInstance.post(URL, {
    //         timestamp: new Date().toISOString(),
    //         commandNumber: commands.CLOSE_SHIFT_WITHOUT_Z,
    //         parkingNumber: parkingNumber,
    //         terminalNumber: terminalNumber
    //     });
    // }

    static async printReportZ({terminalName, terminalNumber, terminalId, parkingNumber}) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_PRINT_ZREPORT',
            commandNumber: commands.CLOSE_SHIFT_Z,
            terminalId: terminalId,
            terminalNumber: terminalNumber,
            terminalName: terminalName,
            parkingNumber: parkingNumber,
        })
    }

    static async reinforce({terminalName, terminalNumber, terminalId, amount}) {
        return axiosInstance.post('/APIServer/application/v1/reinforcement', {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_CASH_INCOME',
            terminalNumber: terminalNumber,
            terminalName: terminalName,
            terminalId: terminalId,
            amount: +amount,
        });
    }

    static async withdraw({terminalName, terminalNumber, terminalId, amount}) {
        return axiosInstance.post('/APIServer/application/v1/encashment', {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_CASH_OUTCOME',
            terminalNumber: terminalNumber,
            terminalName: terminalName,
            terminalId: terminalId,
            amount: +amount,
        });
    }

    static async openShift({terminalName, terminalNumber, terminalId}) {
        return axiosInstance.post('/APIServer/application/v1/open_shift', {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_OPEN_SHIFT',
            terminalNumber: terminalNumber,
            terminalName: terminalName,
            terminalId: terminalId,
        });
    }

    static async produceLostTicket(data) {
        return axiosInstance.post('/APIServer/application/v1/produce_lost_ticket_command', {commandName: 'CMD_PRODUCE_LOST_TICKET', ...data});
    }

    static async updateConfig(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.UPDATE_CONFIG,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async deleteConfig(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandNumber: commands.DELETE_CONFIG,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async restartTerminal(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_REBOOT_DEVICES',
            commandNumber: commands.RESTART_TERMINAL,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async restartGateTerminal(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL_FOR_GATE, {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_REBOOT_DEVICES',
            commandNumber: commands.RESTART_TERMINAL,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async restartTerminalApp(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_REBOOT_SOFT',
            commandNumber: commands.RESTART_TERMINAL_APP,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async restartGateTerminalApp(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL_FOR_GATE, {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_REBOOT_SOFT',
            commandNumber: commands.RESTART_TERMINAL_APP,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async restartTerminalSystem(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL, {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_REBOOT_HARD',
            commandNumber: commands.RESTART_TERMINAL_SYSTEM,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async restartGateTerminalSystem(parkingNumber, terminalNumber) {
        return axiosInstance.post(URL_FOR_GATE, {
            timestamp: new Date().toISOString(),
            commandName: 'CMD_REBOOT_HARD',
            commandNumber: commands.RESTART_TERMINAL_SYSTEM,
            parkingNumber: parkingNumber,
            terminalNumber: terminalNumber
        });
    }

    static async getTerminals(config) {
        return axiosInstance.get('/APIServer/api/v2/userTerminals', config);
    }

    static async getTerminalsStatus(config) {
        return axiosInstance.get('/APIServer/api/v2/terminalStatus', {params: {status: 'ACTIVE', ...config}});
    }

    static async getTerminalsDevices(config) {
        return axiosInstance.get('/APIServer/api/v2/terminalDevices?terminalId=' + config);
    }
}
