import React, {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {observer} from "mobx-react-lite";
import {Button, Chip, Stack} from "@mui/material";
import LabelAndText from "../LabelAndText/LabelAndText";
import LabelAndSelect from "../LabelAndSelect/LabelAndSelect";
import LabelAndDateTimePicker from "../LabelAndDateTimePicker/LabelAndDateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import cardTemplatesStore from "../../../store/cardTemplatesStore";
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import terminalsStore from "../../../store/terminalsStore";
import {toJS} from "mobx";
import {dateToISOLikeButLocal} from "../../utils/utils";
import TerminalService from "../../../services/TerminalService"

const onlyDigits = /\D/g;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 570,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const ENTRY_BARRIER_TYPE_ID = 0;

const LostTicketModal = ({open, setOpen, item, terminal}) => {
    const handleCloseModal = () => {
        setOpen(false);
    }

    const getTemplate = (id) => {
        return cardTemplatesStore.shortTermTemplates.find(template => template.cardTemplateId === id);
    }

    const getTerminalData = (id) => {
        return terminalsStore.terminals.find(terminal => terminal.terminalId === id);
    }

    const setExitTerminalSelectItems = () => {
        let result = [];
        if (terminalsStore.terminals.length) {
            terminalsStore.terminals.forEach((terminal) => {
                if (terminal.terminalTypeId === ENTRY_BARRIER_TYPE_ID && terminal.parkingId === item.parkingId) {
                    result.push({
                        number: terminal.terminalId,
                        name: terminal.terminal
                    });
                }
            });
        }
        return result;
    }

    const [currentTemplate, setCurrentTemplate] = useState(getTemplate(item.templateId));
    const [currentExitTerminal, setCurrentExitTerminal] = useState('');
    const [modalUiData, setModalUiData] = useState({
        datePickerDisabled: true,
        fineInputDisabled: true,
    })
    const [modalData, setModalData] = useState({
        dateEnter: dateToISOLikeButLocal(Date.now()),
        price: '',
        terminalId: terminal.terminalId,
        terminalNumber: terminal.terminalNumber,
        parkingId: item.parkingId,
        parkingNumberEnter: item.parkingNumber,
    });
    const [exitTerminals, setExitTerminals] = useState([]);

    useEffect(() => {
        setModalData({
            ...modalData,
            parkingId: item.parkingId,
            parkingNumberEnter: item.parkingNumber,
            terminalId: terminal.terminalId,
            terminalNumber: terminal.terminalNumber,
        });
        setCurrentTemplate(getTemplate(item.templateId));
        setCurrentExitTerminal();
    }, [terminal]);

    useEffect(() => {
        setCurrentTemplate(getTemplate(item.templateId));
        setExitTerminals(setExitTerminalSelectItems());
    }, [item]);

    useEffect(() => {
        if (currentTemplate) {
            setModalData({
                ...modalData,
                price: currentTemplate.lostCardCost,
            });
        }
    }, [currentTemplate]);

    useEffect(() => {
        if (exitTerminals.length) setCurrentExitTerminal(exitTerminals[0].number);
    }, [exitTerminals.length]);

    const handleChange = (data, field) => {
        setCurrentTemplate({...currentTemplate, [field]: data});
    }

    const handleExitTerminalSelectChange = (field, value) => {
        if (terminalsStore.terminals.length) setModalData({
            ...modalData,
            terminalNumberEnter: getTerminalData(value)?.terminalNumber
        });
        setCurrentExitTerminal(value);
    }

    const handleDateChange = (field, value) => {
        setModalData({
            ...modalData,
            [field]: dateToISOLikeButLocal(value),
        });
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Typography id="modal-modal-title" variant="p" component="p"
                                sx={{marginBottom: '12px', alignSelf: 'flex-start'}}>
                        Производство утерянного билета
                    </Typography>
                    <Stack spacing={0.7}>
                        <LabelAndText label='Парковка въезда' text={item.parkingName}/>
                        <LabelAndSelect label='Терминал въезда' onChange={handleExitTerminalSelectChange}
                                        currentItem={currentExitTerminal} items={exitTerminals}/>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <LabelAndDateTimePicker label='Время въезда'
                                                    onChange={(value) => handleDateChange('dateEnter', value)}
                                                    value={modalData.dateEnter}
                                                    disabled={modalUiData.datePickerDisabled}/>
                            <Chip clickable
                                  label={modalUiData.datePickerDisabled ? 'Разблокировать поле' : 'Заблокировать поле'}
                                  color={'info'}
                                  sx={{ml: '16px', minWidth: '161px'}}
                                  onClick={() => setModalUiData({
                                      ...modalUiData,
                                      datePickerDisabled: !modalUiData.datePickerDisabled
                                  })}
                            />
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <LabelAndInput label='Штраф за потерю'
                                           value={`${modalData?.price} руб.`}
                                           onChange={(e) => handleChange(e.target.value.replace(onlyDigits, ""), 'lostCardCost')}
                                           style={{flexGrow: 1}} disabled={modalUiData.fineInputDisabled}/>
                            <Chip clickable
                                  label={currentTemplate?.isFixedLostCardCost ? 'Запрещено шаблоном' : modalUiData.fineInputDisabled ? 'Разблокировать поле' : 'Заблокировать поле'}
                                  color={'info'}
                                  sx={{ml: '16px', minWidth: '161px'}}
                                  onClick={() => setModalUiData({
                                      ...modalUiData,
                                      fineInputDisabled: !modalUiData.fineInputDisabled
                                  })}
                                  disabled={currentTemplate?.isFixedLostCardCost || false}
                            />
                        </Box>
                    </Stack>
                    <Button variant='outlined'
                            size='small'
                            sx={{fontSize: '12px', mt: '8px', alignSelf: 'flex-end'}}
                            startIcon={<CheckCircleIcon color='success'/>}
                            onClick={() => TerminalService.produceLostTicket({...modalData})}
                    >Отправить команду на кассу</Button>
                </LocalizationProvider>
            </Box>
        </Modal>
    );
};

export default observer(LostTicketModal);
