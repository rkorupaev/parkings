import React, {useContext, useEffect, useState} from 'react';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LabelAndSelect from "../../../molecules/LabelAndSelect/LabelAndSelect";
import LabelAndInput from "../../../molecules/LabelAndInput/LabelAndInput";
import LabelAndDateTimePicker from "../../../molecules/LabelAndDateTimePicker/LabelAndDateTimePicker";
import SearchIcon from "@mui/icons-material/Search";
import {checkDateIsDate, dateToISOLikeButLocal, isAnyError} from "../../../utils/utils";
import {observer} from "mobx-react-lite";
import {AppContext} from "../../../../App";
import LoadingButton from "@mui/lab/LoadingButton";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import cardEventsStore from "../../../../store/cardEventsStore";
import {useLocation} from "react-router";
import terminalsStore from "../../../../store/terminalsStore";
import {toJS} from "mobx";

const onlyDigits = /\D/g;

const CardFilterForm = observer(({containerWidth, setCurrentPage}) => {
    const checkTerminal = (value) => {
        if (value === -1) {
            return ''
        }
        return value;
    }

    const {state} = useLocation();
    const {setSnackBarSettings} = useContext(AppContext);
    const [isError, setIsError] = useState({fromTime: false, tillTerminalEventTime: false});
    const [currentTemplate, setCurrentTemplate] = useState(-1);

    const setFromDate = (dayDelta) => {
        const date = new Date();
        date.setDate(date.getDate() - dayDelta);
        return date;
    }

    useEffect(() => {
        terminalsStore.getTerminals();
    }, []);

    const [data, setData] = useState({
        cardNumber: state?.cardId || '',
        terminalId: checkTerminal(currentTemplate),
        fromTerminalEventTime: dateToISOLikeButLocal(setFromDate(2)).slice(0, 19),
        tillTerminalEventTime: dateToISOLikeButLocal(Date.now()).slice(0, 19)
    });

    useEffect(() => {
        cardEventsStore.setQueryParams(data);
    }, [data])

    const handleDataChange = (field, value) => {
        setData({...data, [field]: value});
    }

    const handleDateChange = (field, value) => {
        if (checkDateIsDate(value)) {
            setIsError({...isError, [field]: false});
            setData({...data, [field]: value ? dateToISOLikeButLocal(value).slice(0, 19) : ''});
            if (!isAnyError(isError) && data.fromTerminalEventTime && data.tillTerminalEventTime) checkDate(field, value);
        } else {
            setIsError({...isError, [field]: true});
        }
    }

    const checkDate = (field, value) => {
        if (checkDateIsValid(field, value, data)) {
            setIsError({...isError, fromTerminalEventTime: false, tillTerminalEventTime: false});
        } else {
            setIsError({...isError, [field]: true});
        }
    }

    const checkDateIsValid = (field, value, data) => {
        if (field === 'tillTerminalEventTime') {
            return data.fromTerminalEventTime <= dateToISOLikeButLocal(value);
        } else if (field === 'fromTerminalEventTime') {
            return dateToISOLikeButLocal(value) <= data.tillTerminalEventTime;
        }
        return true;
    }

    const resetFilter = () => {
        cardEventsStore.resetQueryParams();
        setData({
            cardNumber: '',
            lpr: '',
            terminalId: '',
            fromTerminalEventTime: dateToISOLikeButLocal(setFromDate(2)).slice(0, 19),
            tillTerminalEventTime: dateToISOLikeButLocal(Date.now()).slice(0, 19)
        });
        setCurrentTemplate(-1);
        setIsError({...isError, fromTerminalEventTime: false, tillTerminalEventTime: false});
    }

    const handleTerminalSelectChange = (field, value) => {
        setData({...data, terminalId: checkTerminal(value)});
        setCurrentTemplate(value);
    }

    console.log(toJS(cardEventsStore.queryParams), 'query')

    const makeSelectArray = () => {
        return terminalsStore.terminals.length ? [{
            name: 'Все',
            number: -1
        }, ...terminalsStore.terminals.map((item, id) => ({
            name: `[${item.terminalNumber}] ${item.terminal}`,
            number: item.terminalId
        }))] : [];
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={1} sx={{flexGrow: 1}}>
                    <LabelAndInput value={data.cardNumber}
                                   onChange={(e) => handleDataChange('cardNumber', e.target.value.replace(onlyDigits, ""))}
                                   label='Номер карты'/>
                    <LabelAndInput value={data.lpr}
                                   onChange={(e) => handleDataChange('lpr', e.target.value)}
                                   label='Гос. номер'/>
                    <LabelAndSelect items={makeSelectArray()} onChange={handleTerminalSelectChange}
                                    currentItem={currentTemplate}
                                    label='Номер терминала'/>
                    <LabelAndDateTimePicker value={data.fromTerminalEventTime}
                                            onChange={(value) => handleDateChange('fromTerminalEventTime', value)} label='Начало'
                                            error={isError.fromTerminalEventTime}
                                            errorText={isError.fromTerminalEventTime && !checkDateIsDate(data.fromTerminalEventTime) ? 'Некорректный формат даты' : 'Дата старта контракта раньше даты конца'}/>
                    <LabelAndDateTimePicker value={data.tillTerminalEventTime}
                                            onChange={(value) => handleDateChange('tillTerminalEventTime', value)} label='Конец'
                                            error={isError.tillTerminalEventTime}
                                            errorText={isError.tillTerminalEventTime && !checkDateIsDate(data.tillTerminalEventTime) ? 'Некорректный формат даты' : 'Дата конца контракта раньше даты старта'}/>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <LoadingButton variant='contained' startIcon={<SearchIcon color='inherit'/>}
                                       sx={{width: '150px', mr: '16px'}}
                                       onClick={() => {
                                           setCurrentPage(0);
                                           cardEventsStore.setQueryParams({offset: 0});
                                           cardEventsStore.setGridQueryParams(cardEventsStore.queryParams);
                                           cardEventsStore.getCardEvents()
                                       }}
                                       loading={cardEventsStore.isLoading}
                                       loadingPosition="start" disabled={isAnyError(isError)}>Поиск</LoadingButton>
                        <Button variant='contained' startIcon={<RestartAltIcon color='inherit'/>}
                                onClick={() => resetFilter()}
                        >Очистить фильтр</Button>
                    </Box>
                </Stack>
            </LocalizationProvider>
        </>
    );
});

export default CardFilterForm;
