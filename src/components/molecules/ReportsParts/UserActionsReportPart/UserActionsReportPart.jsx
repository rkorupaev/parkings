import React, {useEffect, useState} from 'react';
import LabelAndInput from "../../LabelAndInput/LabelAndInput";
import LabelAndSelect from "../../LabelAndSelect/LabelAndSelect";
import Box from "@mui/material/Box";
import reportsStore from "../../../../store/reportsStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import parkingsStore from "../../../../store/parkingsStore";
import terminalsStore from "../../../../store/terminalsStore";

const objectNamesArray = [
    {name: 'Не выбрано', number: 0, value: 0,},
    {name: 'Создание', number: 1, value: 2001,},
    {name: 'Редактирование', number: 2, value: 2002,},
    {name: 'Удаление', number: 3, value: 2003,},
    {name: 'Ручное открытие шлагбаума', number: 4, value: 3001,},
    {name: 'Ручное закрытие шлагбаума', number: 5, value: 3002,},
    {name: 'Блокирование шлагбаума', number: 6, value: 3003,},
    {name: 'Вход в основное приложение', number: 7, value: 1001,},
    {name: 'Разблокирование шлагбаума', number: 8, value: 3004,},
    {name: 'Включение терминала', number: 9, value: 3005,},
    {name: 'Выключение терминала', number: 10, value: 3006,},
    {name: 'Перезагрузка терминала: уровень 0', number: 11, value: 3007,},
    {name: 'Перезагрузка терминала: уровень 1', number: 12, value: 3008,},
    {name: 'Перезагрузка терминала: уровень 2', number: 13, value: 3009,},
    {name: 'Команда на включение функции затор', number: 14, value: 3101,},
    {name: 'Команда на увеличение времени функции затор', number: 15, value: 3102,},
    {name: 'Команда на уменьшение времени функции затор', number: 16, value: 3103,},
    {name: 'Команда на выключение функции затор', number: 17, value: 3104,},
];

const defaultData = {
    userLogin: '',
    userEventTypeId: '',
    parkingId: '',
    terminalId: '',
    objectName: '',
}

const UserActiosReportPart = () => {

    const [data, setData] = useState(defaultData);
    const [currentObject, setCurrentObject] = useState(0);
    const [currentParking, setCurrentParking] = useState('');
    const [currentTerminal, setCurrentTerminal] = useState('');
    const [terminals, setTerminals] = useState([]);

    console.log(data, 'data');

    useEffect(() => {
        reportsStore.setResetPartViewFilterCallback(resetData);
    }, []);

    useEffect(() => {
        if (currentParking) {
            terminalsStore.getTerminalStatus(currentParking).then(response => {
                setTerminals(response.map(res => ({name: res.terminal, number: res.terminalId})));
            });
        }
    }, [currentParking]);

    useEffect(() => {
        reportsStore.setQueryParams(data);
    }, [data]);

    const handleChange = (field, value) => {
        setData({...data, [field]: value.trimStart()});
    }

    const handleObjectSelectChange = (field, value) => {
        console.log(value, 'value')
        if (value === 0) {
            let changedData = {...data};
            delete changedData.userEventTypeId;
            reportsStore.deleteFieldQueryParams('userEventTypeId');
            setData(changedData);
        } else {
            setData({...data, userEventTypeId: value});
        }
        setCurrentObject(value);
    }

    const createSelectParkingsItems = () => {
        return toJS(parkingsStore.parkings).map(parking => ({
            number: parking.parkingId,
            name: parking.parkingName
        }));
    }

    const handleParkingSelectChange = (field, value) => {
        setData({...data, parkingId: value});
        setCurrentParking(value);
    }

    const handlegTerminalSelectChange = (field, value) => {
        setData({...data, terminalId: value});
        setCurrentTerminal(value);
    }

    const resetData = () => {
        setData(defaultData);
        setCurrentTerminal('');
        setCurrentObject(0);
        setCurrentParking('');
    }

    console.log(toJS(reportsStore.gridQueryParams), 'grid query');

    //FIXME сделай резину на поля фильтра
    return (
        <>
            <LabelAndInput label='Пользователь (логин)' labelWidth='120px' labelMinWidth='120px' value={data.userLogin}
                           onChange={(e) => handleChange('userLogin', e.target.value)} style={{mb: '8px', ml: '8px',}}/>
            <Box sx={{width: '400px', mb: '8px', ml: '8px',}}>
                <LabelAndSelect items={objectNamesArray} currentItem={currentObject} label='Тип совершенного действия'
                                onChange={handleObjectSelectChange} labelWidth='150px'/>
            </Box>
            <Box sx={{width: '400px', mb: '8px', ml: '8px',}}>
                <LabelAndSelect items={createSelectParkingsItems()} currentItem={currentParking} label='Парковка'
                                onChange={handleParkingSelectChange} labelWidth='90px'/>
            </Box>

            <Box sx={{width: '400px', mb: '8px', ml: '8px',}}>
                <LabelAndSelect items={terminals} currentItem={currentTerminal} label='Терминал'
                                onChange={handlegTerminalSelectChange} labelWidth='90px' disabled={!terminals.length}/>
            </Box>
            <LabelAndInput label='Подробности действия' labelWidth='110px' labelMinWidth='110px' value={data.objectName}
                           onChange={(e) => handleChange('objectName', e.target.value)} style={{ml: '8px',}}/>
        </>
    );
};

export default observer(UserActiosReportPart);
