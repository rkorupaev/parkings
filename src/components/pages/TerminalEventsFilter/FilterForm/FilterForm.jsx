import React, {useEffect, useState} from 'react';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LabelAndSelect from "../../../molecules/LabelAndSelect/LabelAndSelect";
import LabelAndInput from "../../../molecules/LabelAndInput/LabelAndInput";
import LabelAndDateTimePicker from "../../../molecules/LabelAndDateTimePicker/LabelAndDateTimePicker";
import SearchIcon from "@mui/icons-material/Search";
import {checkDateIsDate, dateToISOLikeButLocal, isAnyError, substractDays} from "../../../utils/utils";
import eventsStore from "../../../../store/eventsStore";
import {observer} from "mobx-react-lite";
import LoadingButton from "@mui/lab/LoadingButton";
import {useLocation} from "react-router";
import terminalsStore from "../../../../store/terminalsStore";

const FilterForm = observer(({setCurrentPage}) => {
    const checkTerminal = (value) => {
        if (value === -1) {
            return ''
        }
        return value;
    }

    let {state} = useLocation();
    const [isError, setIsError] = useState({fromTime: false, tillTime: false});
    const [currentTemplate, setCurrentTemplate] = useState(state?.terminalId || -1);
    const [selectArray, setSelectArray] = useState([]);

    const [data, setData] = useState({
        name: '',
        terminalId: checkTerminal(currentTemplate),
        fromTime: dateToISOLikeButLocal(substractDays(2)).slice(0, 19),
        tillTime: dateToISOLikeButLocal(Date.now()).slice(0, 19)
    });

    useEffect(() => {
        terminalsStore.getTerminals().then(() => {
            makeSelectArray();
        });
    }, []);

    useEffect(() => {
        eventsStore.setQueryParams(data);
    }, [data]);

    const handleDataChange = (field, value) => {
        setData({...data, [field]: value});
    }

    const handleDateChange = (field, value) => {
        if (checkDateIsDate(value)) {
            setIsError({...isError, [field]: false});
            setData({...data, [field]: value ? dateToISOLikeButLocal(value).slice(0, 19) : ''});
            if (!isAnyError(isError) && data.fromTime && data.tillTime) checkDate(field, value);
        } else {
            setIsError({...isError, [field]: true});
        }
    }

    const checkDate = (field, value) => {
        if (checkDateIsValid(field, value, data)) {
            setIsError({...isError, fromTime: false, tillTime: false});
        } else {
            setIsError({...isError, [field]: true});
        }
    }

    const checkDateIsValid = (field, value, data) => {
        if (field === 'validUntil') {
            return data.validFrom <= dateToISOLikeButLocal(value);
        } else if (field === 'validFrom') {
            return dateToISOLikeButLocal(value) <= data.validUntil;
        }
        return true;
    }

    const handleTerminalSelectChange = (field, value) => {
        setData({...data, terminalId: checkTerminal(value)});
        setCurrentTemplate(value);
    }

    const makeSelectArray = () => {
        let selectArray = [{
            name: 'Все',
            number: -1
        }];
        if (terminalsStore.terminals) {
            terminalsStore.terminals.forEach((item, id) => {
                selectArray.push({
                    name: `[${item.terminalNumber}] ${item.terminal}`,
                    number: item.terminalId
                })
            })
        }
        setSelectArray(selectArray);
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={1} sx={{width: '50%', minWidth: '50%'}}>
                    <LabelAndSelect items={selectArray} onChange={handleTerminalSelectChange}
                                    currentItem={currentTemplate}
                                    label='Номер терминала'/>
                    <LabelAndInput value={data.name} onChange={(e) => handleDataChange('name', e.target.value)}
                                   label='Фильтр' labelMinWidth='150px'/>
                    <LabelAndDateTimePicker value={data.fromTime}
                                            onChange={(value) => handleDateChange('fromTime', value)} label='Начало'
                                            error={isError.fromTime}
                                            errorText={isError.fromTime && !checkDateIsDate(data.fromTime) ? 'Некорректный формат даты' : 'Дата старта контракта раньше даты конца'}/>
                    <LabelAndDateTimePicker value={data.tillTime}
                                            onChange={(value) => handleDateChange('tillTime', value)} label='Конец'
                                            error={isError.tillTime}
                                            errorText={isError.tillTime && !checkDateIsDate(data.tillTime) ? 'Некорректный формат даты' : 'Дата конца контракта раньше даты старта'}/>

                    <LoadingButton variant='contained' startIcon={<SearchIcon color='inherit'/>}
                                   sx={{width: '150px', alignSelf: 'flex-end'}}
                                   onClick={() => {
                                       setCurrentPage(0);
                                       eventsStore.setQueryParams({offset: 0});
                                       eventsStore.setGridQueryParams(eventsStore.queryParams);
                                       eventsStore.getEvents();
                                   }} loading={eventsStore.isLoading}
                                   loadingPosition="start" disabled={isAnyError(isError)}>Поиск</LoadingButton>
                </Stack>
            </LocalizationProvider>
        </>
    );
});

export default FilterForm;
