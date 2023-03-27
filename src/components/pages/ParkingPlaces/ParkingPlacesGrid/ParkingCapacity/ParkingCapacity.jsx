import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const ERROR_COLOR_LIMIT = 80;
const WARNING_COLOR_LIMIT = 60;

const setColor = (capacity) => {
    if (capacity > WARNING_COLOR_LIMIT && capacity < ERROR_COLOR_LIMIT) return 'warning';
    if (capacity > ERROR_COLOR_LIMIT) return 'error';
    return 'success'
}

const setCapacityValue = (parking) => {
    return Math.floor((parking.reservedPlaces.occupied + parking.nonReservedPlaces.occupied) / (parking.reservedPlaces.total + parking.nonReservedPlaces.total) * 100);
}

const defaultData = {
    nonReservedPlaces: {
        free: 0,
        occupied: 0,
        total: 0,
    },
    reservedPlaces: {
        free: 0,
        occupied: 0,
        total: 0,
    }
}

const ParkingCapacity = ({parkingNumber, getParkingPlaces, currentPlace}) => {
    const [capacity, setCapacity] = useState(setCapacityValue(getParkingPlaces(parkingNumber)));
    const [placeData, setPlaceData] = useState(defaultData);

    useEffect(() => {
        const places = getParkingPlaces(parkingNumber);
        setPlaceData({nonReservedPlaces: places.nonReservedPlaces, reservedPlaces: places.reservedPlaces});
    }, []);

    useEffect(() => {
        setCapacity(setCapacityValue(getParkingPlaces(parkingNumber)));
        const places = getParkingPlaces(parkingNumber);
        setPlaceData({nonReservedPlaces: places.nonReservedPlaces, reservedPlaces: places.reservedPlaces});
    }, [currentPlace]);

    const setTooltipText = () => {
        return (
            <Stack spacing={0.5}>
                <Typography variant={'body2'} component={'p'}>Всего
                    мест: {placeData.nonReservedPlaces.occupied + placeData.reservedPlaces.occupied} / {placeData.nonReservedPlaces.total + placeData.reservedPlaces.total}</Typography>
                <Typography variant={'body2'} component={'p'}>Без
                    резервирования: {placeData.nonReservedPlaces.occupied} / {placeData.nonReservedPlaces.total}</Typography>
                <Typography variant={'body2'} component={'p'}>С
                    резервированием: {placeData.reservedPlaces.occupied} / {placeData.reservedPlaces.total}</Typography>
            </Stack>
        )
    }

    return (
        <Box sx={{width: '100%'}}>
            <Tooltip title={setTooltipText()} placement={"left"}>
                <LinearProgress variant="determinate" value={capacity}
                                sx={{height: '14px', borderRadius: '4px'}}
                                color={setColor(capacity)}/>
            </Tooltip>
        </Box>
    )
};

export default observer(ParkingCapacity);