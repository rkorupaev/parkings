import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import LabelAndDateTimePicker from "../../../LabelAndDateTimePicker/LabelAndDateTimePicker";
import Stack from "@mui/material/Stack";
import LabelAndInput from "../../../LabelAndInput/LabelAndInput";
import MultiSelectWithCheckbox from "../../../MultiSelectWithCheckbox/MultiSelectWithCheckbox";
import {toJS} from "mobx";
import parkingsStore from "../../../../../store/parkingsStore";
import terminalsStore from "../../../../../store/terminalsStore";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Button from "@mui/material/Button";
import {observer} from "mobx-react-lite";
import TerminalCheckboxList from "../TerminalCheckboxList/TerminalCheckboxList";
import {checkDateIsDate, dateToISOLikeButLocal, isAnyError, substractDays} from "../../../../utils/utils";
import reportsStore from "../../../../../store/reportsStore";
import LoadingButton from "@mui/lab/LoadingButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";

const TERMINAL_ID = 2;
const MANUAL_TERMINAL_ID = 3;
const onlyDigits = /\D/g;
const defaultData = {
    fromTime: dateToISOLikeButLocal(substractDays(2)).slice(0, 19),
    tillTime: dateToISOLikeButLocal(Date.now()).slice(0, 19),
    fiscalShiftNumber: '',
}

const ShiftFilters = ({currentSystem, setResetCallback, resetGrid}) => {
    const [parkingsItems, setParkingsItems] = useState([]);
    const [selectedParkings, setSelectedParking] = useState([]);
    const [terminalsItems, setTerminalsItems] = useState([]);
    const [selectedTerminals, setSelectedTerminals] = useState([]);
    const [filterData, setFilterData] = useState(defaultData);
    const [isError, setIsError] = useState({fromTime: false, tillTime: false});

    useEffect(() => {
        const {fromTime, tillTime, fiscalShiftNumber, parkings, terminals} = toJS(reportsStore.queryParams);
        setFilterData({fromTime, tillTime, fiscalShiftNumber});
        setSelectedParking(() => {
            if (parkings) return [...parkings.map(item => item.parkingId)];
            return [];
        });
        setSelectedTerminals(() => {
            if (terminals) return [...terminals.map(item => terminalsStore.getTerminalById(item.terminalId))];
            return [];
        });
        setResetCallback(() => resetFilter);
    }, []);

    useEffect(() => {
        reportsStore.setQueryParams({...filterData});
    }, [filterData]);

    useEffect(() => {
        setParkingsItems(createSelectParkingsItems());
    }, [currentSystem]);

    useEffect(() => {
        reportsStore.setQueryParams({parkings: selectedParkings.map(parking => ({parkingId: parking}))});
        reportsStore.setGridQueryParams({parkings: selectedParkings.map(parking => ({parkingId: parking}))});
        handleParkingSelect(selectedParkings);
    }, [selectedParkings]);

    useEffect(() => {
        reportsStore.setQueryParams({terminals: selectedTerminals.map(terminal => ({terminalId: terminal.terminalId}))});
        reportsStore.setGridQueryParams({terminals: selectedTerminals.map(terminal => ({terminalId: terminal.terminalId}))});
    }, [selectedTerminals]);

    const resetFilter = () => {
        setTerminalsItems([]);
        setSelectedParking([]);
        setSelectedTerminals([]);
        setFilterData({
            fromTime: dateToISOLikeButLocal(substractDays(2)).slice(0, 19),
            tillTime: dateToISOLikeButLocal(Date.now()).slice(0, 19),
            fiscalShiftNumber: '',
        });
        setIsError({fromTime: false, tillTime: false});
    }

    const createSelectParkingsItems = () => {
        let parkings = [];
        toJS(parkingsStore.parkings).map(parking => {
            if (parking.systemId == currentSystem) {
                parkings.push({
                    id: parking.parkingId,
                    name: parking.parkingName
                });
            }
        });
        return parkings;
    }

    const handleParkingSelect = (parkings) => {
        let finalArray = [];
        parkings.forEach(parking => {
            toJS(terminalsStore.terminals).forEach(terminal => {
                if (terminal.parkingId === parking && (terminal.terminalTypeId === TERMINAL_ID || terminal.terminalTypeId === MANUAL_TERMINAL_ID)) finalArray.push(terminal);
            })
        })
        setTerminalsItems(finalArray);
    }

    const getParkingsTitles = (parkingIds) => {
        let titlesArray = [];
        parkingIds.forEach(id => {
            titlesArray.push(parkingsStore.parkings.find(parking => parking.parkingId === id).parkingName);
        })
        return titlesArray.join(", ")
    }

    const handleDateChange = (field, value) => {
        if (checkDateIsDate(value)) {
            setIsError({...isError, [field]: false});
            setFilterData({...filterData, [field]: dateToISOLikeButLocal(value).slice(0, 19)});
        } else {
            setIsError({...isError, [field]: true});
        }
    }

    const handleFilterDataChange = (field, value) => {
        setFilterData({...filterData, [field]: value});
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{display: 'flex', flexDirection: 'column', p: '0 8px', width: '295px'}}>
                    <Stack spacing={0.7} sx={{flexGrow: 1, maxHeight: 'calc(100vh - 154px)'}}>
                        <LabelAndDateTimePicker onChange={(value) => handleDateChange('fromTime', value)}
                                                value={filterData.fromTime} label='Начало периода'
                                                style={{fontSize: '14px', width: '70px', minWidth: '70px'}}
                                                error={isError.fromTime}
                                                disabled={!currentSystem}
                                                errorText={isError.fromTime && !checkDateIsDate(filterData.fromTime) ? 'Некорректный формат даты' : 'Дата "c" раньше даты "по"'}/>
                        <LabelAndDateTimePicker onChange={(value) => handleDateChange('tillTime', value)}
                                                value={filterData.tillTime} label='Конец периода'
                                                style={{fontSize: '14px', width: '70px', minWidth: '70px'}}
                                                error={isError.tillTime}
                                                disabled={!currentSystem}
                                                errorText={isError.tillTime && !checkDateIsDate(filterData.tillTime) ? 'Некорректный формат даты' : 'Дата "c" раньше даты "по"'}/>
                        <Tooltip
                            title={!currentSystem ? "Выберите систему" : ""} placement='top'>
                                <span>
                                  <LabelAndInput label='Смена' labelWidth='70px' labelMinWidth='70px'
                                                 value={filterData.fiscalShiftNumber}
                                                 onChange={(e) => handleFilterDataChange('fiscalShiftNumber', e.target.value.replace(onlyDigits, ""))}
                                                 disabled={!currentSystem}/>
                                </span>
                        </Tooltip>
                        <Tooltip
                            title={!currentSystem ? "Выберите систему" : ""} placement='top'>
                                <span>
                                  <MultiSelectWithCheckbox items={parkingsItems} label='Парковки'
                                                           renderCallback={getParkingsTitles}
                                                           setSelectedItems={setSelectedParking}
                                                           width='100%'
                                                           margin={0}
                                                           selectedItems={selectedParkings}
                                                           disabled={!parkingsItems.length}
                                  />
                                </span>
                        </Tooltip>
                        <TerminalCheckboxList terminalsItems={terminalsItems}
                                              setSelectedTerminals={setSelectedTerminals} selectedTerminals={selectedTerminals}/>
                    </Stack>
                    <Box sx={{display: 'flex', marginTop: '8px', justifyContent: 'space-around'}}>
                        <Button variant='outlined' sx={{marginRight: '8px'}} size='small' onClick={() => resetFilter()}>Сбросить
                            фильтр</Button>
                        <Tooltip
                            title={!selectedParkings.length ? "Выберите хотя бы 1 парковку" : ""} placement='top'>
                                <span>
                                   <LoadingButton variant='outlined' size='small'
                                                  disabled={!selectedParkings.length || isAnyError(isError)}
                                                  onClick={() => {
                                                      reportsStore.setQueryParams({limit: 100, offset: 0});
                                                      reportsStore.getReports('getShiftReport');
                                                      reportsStore.setGridQueryParams({...filterData});
                                                      resetGrid();
                                                  }}
                                                  loading={reportsStore.isLoading}
                                                  loadingIndicator='...поиск'>Поиск</LoadingButton>
                                </span>
                        </Tooltip>
                    </Box>
                </Box>
            </LocalizationProvider>
        </>
    );
};

export default observer(ShiftFilters);
