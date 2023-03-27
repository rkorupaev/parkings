import React, {useState} from 'react';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import TerminalService from "../../../../services/TerminalService";
import {useNavigate} from "react-router";
import Box from "@mui/material/Box";
import cashStore from "../../../../store/cashStore";
import terminalsStore from "../../../../store/terminalsStore";
import {observer} from "mobx-react-lite";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import eventsStore from "../../../../store/eventsStore";

const AKT_BASE_TYPE_ID = 2;
const VIRT_AKT_BASE_TYPE_ID = 4;
const EXT_BARRIER_TYPE_ID = 1;
const MANUAL_AKT_BASE = 3;
const GATE = 5;

const ControlMenu = ({
                         anchorEl,
                         setAnchorEl,
                         open,
                         currentTerminal,
                         setCurrentTerminal,
                         openCashModal,
                         openDeviceModal,
                         openLostTicketModal
                     }) => {
    const navigate = useNavigate();
    const [reloadMenuAnchorEl, setReloadMenuAnchorEl] = useState(null);
    const [traficMenuAnchorEl, setTraficMenuAnchorEl] = useState(null);
    const isReloadMenuOpened = Boolean(reloadMenuAnchorEl);
    const isTraficMenuOpened = Boolean(traficMenuAnchorEl);

    const openReloadMenu = (event) => {
        setReloadMenuAnchorEl(event.currentTarget);
    }

    const closeReloadMenu = () => {
        setReloadMenuAnchorEl(null);
    }

    const openTraficMenu = (event) => {
        setTraficMenuAnchorEl(event.currentTarget);
    }

    const closeTraficMenu = () => {
        setTraficMenuAnchorEl(null);
    }

    const navigateToTerminalEvents = () => {
        navigate('/terminal_events', {state: {terminalId: currentTerminal.terminalId}});
        eventsStore.setModifiedEvents([]);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const turnOffTerminal = () => {
        TerminalService.turnOffTerminal(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        handleClose();
    };

    const turnOnTerminal = () => {
        TerminalService.turnOnTerminal(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        handleClose();
    };

    const closeBarier = () => {
        if (currentTerminal.terminalTypeId === GATE) {
            TerminalService.closeGateBarier(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        } else {
            TerminalService.closeBarier(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        }
        handleClose();
    };

    const openBarier = () => {
        if (currentTerminal.terminalTypeId === GATE) {
            TerminalService.openGateBarier(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        } else {
            TerminalService.openBarier(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        }
        handleClose();
    };

    const blockBarier = () => {
        if (currentTerminal.terminalTypeId === GATE) {
            TerminalService.blockGateBarier(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        } else {
            TerminalService.blockBarier(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        }
        handleClose();
    };

    const unblockBarier = () => {
        TerminalService.unblockBarier(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        handleClose();
    };

    const restartTerminal = () => {
        if (currentTerminal.terminalTypeId === GATE) {
            TerminalService.restartGateTerminal(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        } else {
            TerminalService.restartTerminal(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        }
        handleClose();
    };

    const restartTerminalApp = () => {
        if (currentTerminal.terminalTypeId === GATE) {
            TerminalService.restartGateTerminalApp(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        } else {
            TerminalService.restartTerminalApp(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        }
        handleClose();
    };

    const restartTerminalSystem = () => {
        if (currentTerminal.terminalTypeId === GATE) {
            TerminalService.restartGateTerminalSystem(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        } else {
            TerminalService.restartTerminalSystem(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
        }
        handleClose();
    };

    const handleOpenCashModelClick = () => {
        openCashModal(true);
        cashStore.getCashInfo(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
    }

    const handleOpenDeviceModelClick = () => {
        openDeviceModal(true);
        terminalsStore.getTerminalDevices(currentTerminal.terminalId);
    }

    const handleTraficOnClick = () => {
        setCurrentTerminal({...currentTerminal, mashValue: 600});
        TerminalService.turnOnStuckFunc(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
    }

    const handleTraficOffClick = () => {
        setCurrentTerminal({...currentTerminal, mashValue: 0});
        TerminalService.turnOffStuckFunc(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
    }

    const handleIncreaseTraficTimeClick = () => {
        TerminalService.increaseFreeExitTime(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
    }

    const handleDecreaseTraficTimeClick = () => {
        TerminalService.decreaseFreeExitTime(currentTerminal.parkingNumber, currentTerminal.terminalNumber);
    }

    const handleProduceLostTicketButtonClick = () => {
        openLostTicketModal(true);
    }

    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <>
                {(currentTerminal.terminalTypeId !== VIRT_AKT_BASE_TYPE_ID && currentTerminal.terminalTypeId !== MANUAL_AKT_BASE) &&
                    <>
                        {
                            currentTerminal.statusOn ?
                                <MenuItem onClick={turnOffTerminal}
                                          disabled={!currentTerminal.statusOnline}>Выключить</MenuItem>
                                :
                                <MenuItem onClick={turnOnTerminal}
                                          disabled={!currentTerminal.statusOnline}>Включить</MenuItem>
                        }
                        {
                            currentTerminal.terminalTypeId !== AKT_BASE_TYPE_ID && (
                                currentTerminal.statusBarrierClose ?
                                    <MenuItem onClick={openBarier}
                                              disabled={!currentTerminal.statusOnline || currentTerminal.statusBarrierLock || !currentTerminal.statusOnline}>Открыть
                                        шлагбаум</MenuItem>
                                    : <MenuItem onClick={closeBarier}
                                                disabled={!currentTerminal.statusOnline || currentTerminal.statusBarrierLock || !currentTerminal.statusOnline}>Закрыть
                                        шлагбаум</MenuItem>
                            )
                        }
                        {
                            currentTerminal.terminalTypeId !== AKT_BASE_TYPE_ID && (
                                currentTerminal.statusBarrierLock ?
                                    <MenuItem onClick={unblockBarier} disabled={!currentTerminal.statusOnline}>Разблокировать
                                        шлагбаум</MenuItem>
                                    : <MenuItem onClick={blockBarier} disabled={!currentTerminal.statusOnline}>Заблокировать
                                        шлагбаум</MenuItem>
                            )
                        }
                        <MenuItem onClick={(e) => {
                            !isReloadMenuOpened ? openReloadMenu(e) : closeReloadMenu()
                        }} disabled={!currentTerminal.statusOnline}>Перезагрузка
                            <Menu open={isReloadMenuOpened}
                                  id="reload-menu"
                                  anchorEl={reloadMenuAnchorEl}
                                  MenuListProps={{
                                      'aria-labelledby': 'basic-button',
                                  }}
                            >
                                <MenuItem onClick={restartTerminalApp}>Уровень 0 (приложение терминала)</MenuItem>
                                <MenuItem onClick={restartTerminal}>Уровень 1 (устройство терминала)</MenuItem>
                                <MenuItem onClick={restartTerminalSystem}>Уровень 2 (система терминала)</MenuItem>
                            </Menu>
                            {!isReloadMenuOpened ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                        </MenuItem>
                        {
                            currentTerminal.terminalTypeId === EXT_BARRIER_TYPE_ID && (
                                <MenuItem onClick={(e) => {
                                    !isTraficMenuOpened ? openTraficMenu(e) : closeTraficMenu()
                                }}>Затор
                                    <Menu open={isTraficMenuOpened}
                                          id="trafic-menu"
                                          anchorEl={traficMenuAnchorEl}
                                          MenuListProps={{
                                              'aria-labelledby': 'basic-button',
                                          }}
                                    >
                                        <MenuItem onClick={handleTraficOnClick} disabled={!!currentTerminal.mashValue}>Включить
                                            затор</MenuItem>
                                        <MenuItem onClick={handleIncreaseTraficTimeClick}
                                                  disabled={!currentTerminal.mashValue}>Увеличить
                                            время для функции затор</MenuItem>
                                        <MenuItem onClick={handleDecreaseTraficTimeClick}
                                                  disabled={!currentTerminal.mashValue}>Уменьшить
                                            время для функции затор</MenuItem>
                                        <MenuItem onClick={handleTraficOffClick} disabled={!currentTerminal.mashValue}>Выключить
                                            затор</MenuItem>
                                    </Menu>
                                    {!isTraficMenuOpened ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                                </MenuItem>
                            )
                        }
                        <Divider/>
                    </>}
            </>
            {
                currentTerminal.terminalTypeId === AKT_BASE_TYPE_ID && (
                    <Box>
                        <MenuItem onClick={handleProduceLostTicketButtonClick} disabled={!currentTerminal.statusOnline}>Производство
                            утерянного билета</MenuItem>
                        <MenuItem onClick={() => handleOpenCashModelClick()}>Наличность</MenuItem>
                    </Box>
                )
            }
            <MenuItem onClick={navigateToTerminalEvents}>События по терминалу</MenuItem>
            <MenuItem onClick={handleOpenDeviceModelClick}>Информация о терминале</MenuItem>
        </Menu>
    );
};

export default observer(ControlMenu);
