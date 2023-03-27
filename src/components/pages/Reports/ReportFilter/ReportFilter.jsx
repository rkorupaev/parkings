import React, {useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import LabelAndDateTimePicker from "../../../molecules/LabelAndDateTimePicker/LabelAndDateTimePicker";
import MultiSelectWithCheckbox from "../../../molecules/MultiSelectWithCheckbox/MultiSelectWithCheckbox";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import {Box} from "@mui/material";
import parkingsStore from "../../../../store/parkingsStore";
import terminalsStore from "../../../../store/terminalsStore";
import {toJS} from "mobx";
import {checkDateIsDate, dateToISOLikeButLocal, isAnyError, substractDays} from "../../../utils/utils";
import reportsStore from "../../../../store/reportsStore";
import {observer} from "mobx-react-lite";

const defaultData = {
    fromTime: dateToISOLikeButLocal(substractDays(2)).slice(0, 19),
    tillTime: dateToISOLikeButLocal(Date.now()).slice(0, 19),
}

const ReportFilter = ({setResetFunc, renderComp = '', type, disableButton, setCurrentPage, setPageSize}) => {
    const createSelectParkingsItems = () => {
        return toJS(parkingsStore.parkings).map(parking => ({
            id: parking.parkingId,
            name: parking.parkingName
        }));
    }

    const [parkings, setParkings] = useState([]);
    const [terminals, setTerminals] = useState([]);
    const [selectedTerminals, setSelectedTerminals] = useState([]);
    const [selectedParkings, setSelectedParkings] = useState([]);
    const [isAllTerminalsChecked, setIsAllTerminalsChecked] = useState(false);
    const [isAllParkingsChecked, setIsAllParkingsChecked] = useState(false);
    const [isError, setIsError] = useState({fromTime: false, tillTime: false});
    const [data, setData] = useState(defaultData);

    useEffect(() => {
        setResetFunc(() => resetData);
        setParkings(createSelectParkingsItems());
    }, []);

    useEffect(() => {
        setParkings(createSelectParkingsItems());
    }, [parkingsStore.parkings.length]);

    useEffect(() => {
        setData(defaultData);
        setSelectedTerminals([]);
        setSelectedParkings([]);
    }, [type]);

    useEffect(() => {
        reportsStore.setQueryParams(data);
        // reportsStore.setQueryParams({offset: 0, limit: 100});
    }, [data]);

    useEffect(() => {
        console.log(selectedParkings, 'selected parkings');
        if ((type === 'capacity' || type === 'payment_movement_summary' || type === 'payment_movement_distribution') && !selectedParkings.length) {
            disableButton(true);
        } else {
            disableButton(false);
        }

        handleParkingSelect(selectedParkings);
    }, [selectedParkings]);

    useEffect(() => {
        if ((type === 'capacity' || type === 'payment_movement_summary' || type === 'payment_movement_distribution') && !selectedParkings.length) {
            disableButton(true);
        } else {
            disableButton(isAnyError(isError));
        }
    }, [isError]);

    console.log(toJS(reportsStore.queryParams), 'query params');

    useEffect(() => {
        reportsStore.setQueryParams({terminals: selectedTerminals.map(item => ({terminalId: item}))});
        // reportsStore.setQueryParams({offset: 0, limit: 100});
    }, [selectedTerminals]);

    useEffect(() => {
        isAllParkingsChecked ? setSelectedParkings(parkingsStore.getAllParkingIds()) : setSelectedParkings([]);
    }, [isAllParkingsChecked]);

    const getParkingsTitles = (parkingIds) => {
        let titlesArray = [];
        parkingIds.forEach(id => {
            titlesArray.push(parkingsStore.parkings.find(parking => parking.parkingId === id).parkingName);
        })
        return titlesArray.join(", ")
    }

    const getTerminalsTitles = (terminalsIds) => {
        console.log(terminalsIds)
        let titlesArray = [];
        if (terminalsIds.length) {
            terminalsIds.forEach(id => {
                titlesArray.push(terminalsStore.terminals.find(terminal => terminal.terminalId === id).terminal);
            });
        }
        return titlesArray.join(", ")
    }

    const handleParkingSelect = (parkings) => {
        let finalArray = [];
        parkings.forEach(parking => {
            if (terminalsStore.allTerminals.length) {
                toJS(terminalsStore.allTerminals).forEach(terminal => {
                    if (terminal.parkingId === parking) finalArray.push(terminal);
                });
            }
        });
        setTerminals(createSelectTerminalItems(finalArray));
        setSelectedTerminals(finalArray.map(item => item.terminalId));
        const parkingsArray = parkings.map(parking => ({parkingId: parking}));
        reportsStore.setQueryParams({parkings: parkingsArray});
        // reportsStore.setQueryParams({offset: 0, limit: 100});
    }

    const createSelectTerminalItems = (terminals) => {
        return terminals.map(terminal => ({id: terminal.terminalId, name: terminal.terminal}));
    }

    const handleDateChange = (field, value) => {
        if (checkDateIsDate(value)) {
            setIsError({...isError, [field]: false});
            setData({...data, [field]: dateToISOLikeButLocal(value).slice(0, 19)});
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

    const allTerminalsCheckboxHandler = (checked) => {
        checked ? setSelectedTerminals(terminalsStore.getAllTerminalIds(selectedParkings)) : setSelectedTerminals([]);
        setIsAllTerminalsChecked(!checked);
    }

    const checkDateIsValid = (field, value, data) => {
        //TODO не работает, надо разобраться
        if (field === 'validUntil') {
            return data.validFrom <= dateToISOLikeButLocal(value);
        } else if (field === 'validFrom') {
            return dateToISOLikeButLocal(value) <= data.validUntil;
        }
        return true;
    }

    const resetData = () => {
        setData({
            fromTime: dateToISOLikeButLocal(substractDays(2)).slice(0, 19),
            tillTime: dateToISOLikeButLocal(Date.now()).slice(0, 19),
            offset: 0,
        });
        setSelectedTerminals([]);
        setSelectedParkings([]);
        setIsAllParkingsChecked(false);
        setIsAllTerminalsChecked(false);
        setIsError({fromTime: false, tillTime: false});
        if (reportsStore.resetCallback) reportsStore.resetCallback();
    }

    if (type === 'user_actions') {
        return (
            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                <Box sx={{display: 'flex', alignItems: 'center', mb: '8px'}}>
                    <Typography component='p' variant='p' sx={{marginRight: '8px'}}>Фильтры: </Typography>
                    <LabelAndDateTimePicker value={data.fromTime}
                                            onChange={(value) => handleDateChange('fromTime', value)}
                                            label='с' style={{width: '30px', minWidth: '30px'}} error={isError.fromTime}
                                            errorText={isError.fromTime && !checkDateIsDate(data.fromTime) ? 'Некорректный формат даты' : 'Дата "c" раньше даты "по"'}/>
                    <LabelAndDateTimePicker value={data.tillTime}
                                            onChange={(value) => handleDateChange('tillTime', value)} label='по'
                                            style={{width: '40px', minWidth: '40px', marginLeft: '16px'}}
                                            error={isError.tillTime}
                                            errorText={isError.tillTime && !checkDateIsDate(data.tillTime) ? 'Некорректный формат даты' : 'Дата "c" раньше даты "по"'}/>
                </Box>
                {renderComp()}
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
            <Typography component='p' variant='p' sx={{marginRight: '8px'}}>Фильтры: </Typography>
            <LabelAndDateTimePicker value={data.fromTime}
                                    onChange={(value) => handleDateChange('fromTime', value)}
                                    label='с' style={{width: '30px', minWidth: '30px'}}
                                    error={isError.fromTime}
                                    errorText={isError.fromTime && !checkDateIsDate(data.fromTime) ? 'Некорректный формат даты' : 'Дата "c" раньше даты "по"'}/>
            <LabelAndDateTimePicker value={data.tillTime}
                                    onChange={(value) => handleDateChange('tillTime', value)} label='по'
                                    style={{width: '40px', minWidth: '40px', marginLeft: '16px'}}
                                    error={isError.tillTime}
                                    errorText={isError.tillTime && !checkDateIsDate(data.tillTime) ? 'Некорректный формат даты' : 'Дата "c" раньше даты "по"'}/>
            <MultiSelectWithCheckbox items={parkings} label='Парковки'
                                     renderCallback={getParkingsTitles}
                                     selectedItems={selectedParkings}
                                     setSelectedItems={setSelectedParkings}/>
            <Tooltip title={isAllParkingsChecked ? "Снять выбор со всех парковок" : "Выбрать все парковки"}
                     placement='top'>
                <Checkbox onChange={() => setIsAllParkingsChecked(!isAllParkingsChecked)}
                          checked={isAllParkingsChecked}/>
            </Tooltip>
            {type !== 'capacity' &&
                <>
                    <MultiSelectWithCheckbox items={terminals}
                                             label='Терминалы'
                                             renderCallback={getTerminalsTitles}
                                             selectedItems={selectedTerminals}
                                             setSelectedItems={setSelectedTerminals}
                                             disabled={!terminals.length}
                    />
                    <Tooltip
                        title={isAllTerminalsChecked ? "Снять выбор со всех терминалов" : "Выбрать все терминалы"}
                        placement='top'>
                        <Checkbox onChange={() => allTerminalsCheckboxHandler(isAllTerminalsChecked)}
                                  checked={terminals.length === selectedTerminals.length && terminals.length}
                                  disabled={!terminals.length}/>
                    </Tooltip>
                </>
            }
            {renderComp()}
        </Box>
    );
};

export default observer(ReportFilter);
