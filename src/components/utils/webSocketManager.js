import terminalsStore from "../../store/terminalsStore";

const processWebSocketMessage = (data) => {
    const types = {
        3: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierClose: false}),
        9: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierClose: false}),
        80: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierClose: false}),
        4: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierClose: true}),
        10: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierClose: true}),
        81: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierClose: true}),
        14: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierLock: true}),
        15: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusBarrierLock: false}),
        20: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusOn: true}),
        21: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusOn: false}),
        25: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusLoopABusy: true}),
        26: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusLoopABusy: false}),
        27: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusLoopBBusy: true}),
        28: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusLoopBBusy: false}),
        29: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusLoopCBusy: true}),
        30: () => terminalsStore.updateTerminalStatus(data.terminal_id, {statusLoopCBusy: false}),
        67: () => terminalsStore.updateTerminalStatus(data.terminal_id, {mashValue: 0}),
        69: () => terminalsStore.updateTerminalStatus(data.terminal_id, {mashValue: 600}),
        63: () => terminalsStore.updateTerminalMashValue(data.terminal_id, 'increase'),
        65: () => terminalsStore.updateTerminalMashValue(data.terminal_id, 'decrease'),
    }
    if (data.terminal_id && types[data.event_type_id]) types[data.event_type_id]();
}

export {processWebSocketMessage};
