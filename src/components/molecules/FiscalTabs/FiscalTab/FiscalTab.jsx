import React, {useContext, useEffect, useMemo, useState} from 'react';
import Box from "@mui/material/Box";
import {observer} from "mobx-react-lite";
import {Typography} from "@mui/material";
import LabelAndSelect from "../../LabelAndSelect/LabelAndSelect";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PrintIcon from '@mui/icons-material/Print';
import LabelAndInput from "../../LabelAndInput/LabelAndInput";
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import parkingsStore from "../../../../store/parkingsStore";
import {toJS} from "mobx";
import terminalsStore from "../../../../store/terminalsStore";
import TerminalService from "../../../../services/TerminalService";
import {AppContext} from "../../../../App";

const BOX_INDEX = 2;
const onlyDigits = /\D/g;
const defaultValues = {
    terminalId: '',
    terminalNumber: '',
    terminalName: '',
    amount: '',
    parkingNumber: '',
    printX: false,
}

const FiscalTab = ({value, currentSystem}) => {
        const [data, setData] = useState(defaultValues);
        const {setSnackBarSettings} = useContext(AppContext);

        const showSnackbar = (label, severity) => {
            setSnackBarSettings({
                severity: severity,
                opened: true,
                label: label
            });
        }

        const closeShift = (printZ, data) => {
            if (printZ) {
                return TerminalService.printReportZ(data);
            } else {
                return TerminalService.closeShiftZ(data);
            }
        }

        const fiscalOperation = {
            0: {
                label: 'Операции со сменой',
                renderPart: ({data, setData}) => <>
                    <FormControlLabel control={<Checkbox
                        onChange={(e) => setData({...data, printX: e.target.checked})}
                        inputProps={{'aria-label': 'controlled'}}/>}
                                      label='Печать Z-отчета'
                                      sx={{alignSelf: 'flex-end', mb: '16px'}} checked={data.printX}/>
                    <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
                        <Button variant='outlined' onClick={() => TerminalService.openShift(data).then(response => {
                            if (String(response.status)[0] == 4) {
                                showSnackbar('Произошла ошибка. Повторите запрос!', 'error');
                            } else if (String(response.status)[0] == 2) {
                                showSnackbar('Смена открыта', 'success');
                            }
                        })}
                                endIcon={<PlayCircleOutlineIcon color='inherit'/>} sx={{marginRight: '8px'}} size='small'
                                disabled={!data.terminalId}>Открыть
                            смену</Button>
                        <Button variant='outlined' onClick={() => closeShift(data.printX, data).then(response => {
                            if (String(response.status)[0] == 4) {
                                showSnackbar('Произошла ошибка. Повторите запрос!', 'error');
                            } else if (String(response.status)[0] == 2) {
                                showSnackbar('Смена открыта', 'success');
                            }
                        })}
                                endIcon={<StopCircleIcon color='inherit'/>} size='small' disabled={!data.terminalId}>Закрыть
                            смену</Button>
                    </Box>
                </>
            },
            1: {
                label: 'X-отчет',
                renderPart: ({data}) => <>
                    <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
                        <Button variant='outlined' onClick={() => TerminalService.printReportX(data).then(response => {
                            if (String(response.status)[0] == 4) {
                                showSnackbar('Произошла ошибка. Повторите запрос!', 'error');
                            } else if (String(response.status)[0] == 2) {
                                showSnackbar('Отчет отправлен на печать', 'success');
                            }
                        })}
                                endIcon={<PrintIcon color='inherit'/>} size='small' disabled={!data.terminalId}>Распечатать
                            Х отчет</Button>
                    </Box>
                </>
            },
            2: {
                label: 'Инкассация',
                renderPart: ({data, setData}) => <>
                    <LabelAndInput label='Cумма' labelWidth='160px' labelMinWidth='160px' value={data.amount}
                                   onChange={(e) => setData({...data, amount: e.target.value.replace(onlyDigits, '')})}/>
                    <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
                        <Button variant='outlined'
                                onClick={() => TerminalService.withdraw(data).then(response => {
                                    if (String(response.status)[0] == 4) {
                                        showSnackbar('Произошла ошибка. Повторите запрос!', 'error');
                                    } else if (String(response.status)[0] == 2) {
                                        showSnackbar('Запрос на изъятие отправлен', 'success');
                                    }
                                })}
                                endIcon={<MoneyOffIcon color='inherit'/>} size='small'
                                disabled={!data.terminalId || !data.amount}>Изъять</Button>
                    </Box>
                </>
            },
            3: {
                label: 'Подкрепление',
                renderPart: ({data, setData}) => <>
                    <LabelAndInput label='Cумма' labelWidth='160px' labelMinWidth='160px' value={data.amount}
                                   onChange={(e) => setData({...data, amount: e.target.value.replace(onlyDigits, '')})}/>
                    <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
                        <Button variant='outlined'
                                onClick={() => TerminalService.reinforce(data).then(response => {
                                    if (String(response.status)[0] == 4) {
                                        showSnackbar('Произошла ошибка. Повторите запрос!', 'error');
                                    } else if (String(response.status)[0] == 2) {
                                        showSnackbar('Запрос на внесение отправлен', 'success');
                                    }
                                })}
                                endIcon={<AttachMoneyIcon color='inherit'/>} size='small'
                                disabled={!data.terminalId || !data.amount}>Внести</Button>
                    </Box>
                </>
            }
        };

        const getType = (value) => {
            return fiscalOperation[value];
        }

        const [type, setType] = useState(getType(value));
        const [currentParking, setCurrentParking] = useState('');
        const [currentTerminal, setCurrentTerminal] = useState('');
        const [terminalsList, setTerminalsList] = useState([]);

        useEffect(() => {
            setData({...defaultValues});
            setCurrentTerminal('');
            setCurrentParking('');
        }, [currentSystem])

        const createParkingSelectItems = () => {
            let parkings = toJS(parkingsStore.parkings);
            parkings = parkings.filter(parking => parking.systemId == currentSystem);
            return parkings.map(parking => ({
                name: parking.parkingName,
                number: parking.parkingNumber,
            }))
        }

        const createTerminalSelectItem = (selectedItem) => {
            let result = [];
            if (selectedItem && toJS(terminalsStore.terminals).length) {
                result = toJS(terminalsStore.terminals).filter(terminal => terminal.parkingId === selectedItem && terminal.terminalTypeId === BOX_INDEX);
                result = result.map(item => ({
                    name: item.terminal,
                    number: item.terminalId
                }));
            }

            return result;
        }

        console.log(data, 'data');

        const handleParkingSelectChange = (field, value) => {
            setData({...defaultValues, parkingNumber: value});
            setCurrentParking(value);
            setCurrentTerminal('');
            setTerminalsList(createTerminalSelectItem(getParkingId(value)));
        }

        const handleTerminalSelectChange = (field, value) => {
            if (value) {
                let chosenTerminal = toJS(terminalsStore.terminals).find(terminal => terminal.terminalId === value);
                setData({
                    ...data,
                    terminalId: chosenTerminal.terminalId,
                    terminalNumber: chosenTerminal.terminalNumber,
                    terminalName: chosenTerminal.terminal,
                });
            }

            setCurrentTerminal(value);
        }

        const getParkingId = (number) => {
            if (number && parkingsStore.parkings.length) {
                return toJS(parkingsStore.parkings).find(parking => parking.parkingNumber === number).parkingId;
            }
        }

        console.log(data, 'data')

        return (
            <Box>
                <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
                    <Typography variant='body1' component='p'
                                sx={{alignSelf: 'center', marginTop: '8px', marginBottom: '8px'}}>{type.label}</Typography>
                    <Stack spacing={0.7}>
                        <LabelAndSelect onChange={handleParkingSelectChange} items={createParkingSelectItems()}
                                        label='Выберите парковку' labelWidth='160px' currentItem={currentParking}/>
                        <LabelAndSelect onChange={handleTerminalSelectChange} items={terminalsList} label='Выберите кассу'
                                        labelWidth='160px' currentItem={currentTerminal} disabled={!terminalsList.length}/>
                        {type.renderPart({data, setData})}
                    </Stack>
                </Box>
            </Box>
        );
    }
;

export default observer(FiscalTab);
