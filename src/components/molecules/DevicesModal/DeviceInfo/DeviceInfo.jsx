import React from 'react';
import {Box} from "@mui/material";
import LabelAndText from "../../LabelAndText/LabelAndText";
import Typography from "@mui/material/Typography";

const DeviceInfo = ({item}) => {

    const getPaperStatus = (status) => {
        const paperStatus = {
            0: {label: 'Отсутствует', color: 'red'},
            1: {label: 'Мало', color: 'orange'},
            2: {label: 'Достаточно', color: 'green'},
        }
        return paperStatus[status];
    }

    const getHopperStatus = (status) => {
        const hopperStatus = {
            null: {label: 'Неопределено', color: 'orange'},
            0: {label: 'Сдача отсутствует', color: 'red'},
            1: {label: 'Надо уточнить классификацию', color: 'blue'},
            2: {label: 'Сдача присутствует', color: 'green'},
        }
        return hopperStatus[status];
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minWidth: "272px", marginBottom: '16px'}}>
            <Typography variant='p' component='p'
                        sx={{
                            fontSize: '12px',
                            fontWeight: 700,
                            alignSelf: 'center',
                            marginBottom: '8px'
                        }}>{item.deviceName}</Typography>
            <LabelAndText label='Номер' text={item.deviceNumber} variant='info'/>
            {item.hasOwnProperty('isConnected') &&
                <LabelAndText label='Подключен или не подключен' text={item.isConnected ? 'Подключен' : 'Не подключен'}
                              variant='info' color={item.isConnected ? 'green' : 'red'}/>}
            <LabelAndText label='Исправен или неисправен' text={item.isOk ? 'Исправно' : 'Неисправно'} variant='info'
                          color={item.isOk ? 'green' : 'red'}/>
            {item.statusPaper ?
                <LabelAndText label='Наличие билетов' text={getPaperStatus(item.statusPaper).label || ''} variant='info'
                              color={getPaperStatus(item.statusPaper).color}/> : ''}
            {item.hopper1Capacity ?
                <LabelAndText label='Блок сдачи 1' text={getHopperStatus(item.hopper1Capacity).label || ''} variant='info'
                              color={getHopperStatus(item.hopper1Capacity).color}/> : ''}
            {item.hopper2Capacity ?
                <LabelAndText label='Блок сдачи 2' text={getHopperStatus(item.hopper1Capacity).label || ''} variant='info'
                              color={getHopperStatus(item.hopper1Capacity).color}/> : ''}
            {item.hopper3Capacity ?
            <LabelAndText label='Блок сдачи 3' text={getHopperStatus(item.hopper1Capacity).label || ''} variant='info'
                          color={getHopperStatus(item.hopper1Capacity).color}/> : ''}
            {item.hopper4Capacity ?
            <LabelAndText label='Блок сдачи 4' text={getHopperStatus(item.hopper1Capacity).label || ''} variant='info'
                          color={getHopperStatus(item.statusPaper).color}/> : ''}
        </Box>
    );
};

export default DeviceInfo;
