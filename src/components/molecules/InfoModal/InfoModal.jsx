import React, {useState} from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {observer} from "mobx-react-lite";
import Stack from "@mui/material/Stack";
import LabelAndText from "../LabelAndText/LabelAndText";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import cardStore from "../../../store/cardStore";
import {prettifyDate} from "../../utils/utils";
import eventsStore from "../../../store/eventsStore";
import {toJS} from "mobx";
import parkingsStore from "../../../store/parkingsStore";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const InfoModal = ({open, setOpen, rowValue}) => {
    const handleCloseModal = () => {
        setOpen(false);
        eventsStore.setPayInfo({});
    }

    const getStatus = (status) => {
        const statuses = {
            'ACTIVE': 'Карта активна',
            'BLOCKED': 'Карта заблокирована',
            'DELETED': 'Карта удалена',
        }
        return statuses[status];
    }

    const getLocation = (location) => {
        const locations = {
            'INSIDE': 'Внутри',
            'OUTSIDE': 'Снаружи',
            'NEUTRAL': 'Нейтрально',
        }
        return locations[location];
    }

    console.log(toJS(eventsStore.payInfo), 'pay info');

    const setValidParkingsArray = () => {
        let parkingsNameArray = []
        if (cardStore.card) {
            cardStore.card?.validParkings.forEach(item => {
                parkingsStore.parkings.forEach(parking => {
                    if (parking.parkingNumber === item) parkingsNameArray.push(parking.parkingName);
                })
            })
        }
        return parkingsNameArray;
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="p" component="p"
                            sx={{marginBottom: '14px', color: 'green'}}>
                    Общая информация
                </Typography>
                <Stack spacing={0.7} sx={{width: '100%'}}>
                    <LabelAndText label='Состояние карты' text={getStatus(cardStore.card?.cardStatus) || 'нет данных'} variant='medium_regular'/>
                    <LabelAndText label='Номер карты' text={cardStore.card?.singleCardNumber || 'нет данных'} variant='medium_regular'/>
                    <LabelAndText label='Доступные парковки' text={setValidParkingsArray() || 'нет данных'} variant='medium_regular'/>
                    <LabelAndText label='Шаблон карты' text={cardStore.card?.singleCardTemplateName || 'нет данных'} variant='medium_regular'/>
                    <LabelAndText label='Метоположение' text={getLocation(cardStore.card?.cardLocation) || 'нет данных'}
                                  variant='medium_regular'/>
                    <LabelAndText label='Последний ГРЗ' text={cardStore.card?.lastLpr || 'нет данных'}
                                  variant='medium_regular'/>
                    <LabelAndText label='Начало действия' text={prettifyDate(cardStore.card?.cardDateFrom) || 'нет данных'}
                                  variant='medium_regular'/>
                    <LabelAndText label='Окончание действия' text={prettifyDate(cardStore.card?.cardDateTo) || 'нет данных'}
                                  variant='medium_regular'/>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', fontSize: '14px'}}>
                        <FormControlLabel control={<Checkbox checked={cardStore.card?.cardCheating || false} disabled
                                                             inputProps={{'aria-label': 'controlled'}} size='small'/>}
                                          label='Обман на парковке'
                                          sx={{'.MuiFormControlLabel-label': {fontSize: '14px'}}}/>
                        <FormControlLabel control={<Checkbox checked={cardStore.card?.flagIo || false} disabled
                                                             inputProps={{'aria-label': 'controlled'}} size='small'/>}
                                          label='Контроль въезд\выезд'
                                          sx={{'.MuiFormControlLabel-label': {fontSize: '14px'}}}/>
                        <FormControlLabel control={<Checkbox checked={cardStore.card?.flagBlocked || false} disabled
                                                             inputProps={{'aria-label': 'controlled'}} size='small'/>}
                                          label='Заблокирована'
                                          sx={{'.MuiFormControlLabel-label': {fontSize: '14px'}}}/>
                    </Box>
                </Stack>
                {Object.keys(eventsStore.payInfo).length ?
                    <>
                        <Typography id="modal-modal-title" variant="p" component="p"
                                    sx={{marginBottom: '14px', color: 'green'}}>
                            Информация о платеже
                        </Typography>
                        <Stack spacing={0.7} sx={{width: '100%'}}>
                            <LabelAndText label='Парковка' text={eventsStore.payInfo.parkingName} variant='medium_regular'/>
                            <LabelAndText label='Терминал оплаты' text={eventsStore.payInfo.terminalName}
                                          variant='medium_regular'/>
                            <LabelAndText label='Время оплаты' text={prettifyDate(eventsStore.payInfo.paymentDateTime)}
                                          variant='medium_regular'/>
                            <LabelAndText label='Тип оплаты' text={eventsStore.payInfo.paymentType} variant='medium_regular'/>
                            <LabelAndText label='Сумма оплаты' text={eventsStore.payInfo.amount}
                                          variant='medium_regular'/>
                            <LabelAndText label='Внесено' text={eventsStore.payInfo.accept}
                                          variant='medium_regular'/>
                            <LabelAndText label='Сдача' text={eventsStore.payInfo.dispense}
                                          variant='medium_regular'/>
                            <LabelAndText label='Детали платежа' text={eventsStore.payInfo.paymentDetail}
                                          variant='medium_regular'/>
                        </Stack>
                    </> : ''}
            </Box>
        </Modal>
    );
};

export default observer(InfoModal);
