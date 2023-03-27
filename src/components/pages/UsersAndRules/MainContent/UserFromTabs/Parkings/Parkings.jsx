import React, {useEffect, useState} from 'react';
import {Box, Divider, Typography} from "@mui/material";
import LabelAndSelect from "../../../../../molecules/LabelAndSelect/LabelAndSelect";
import {LoadingButton} from "@mui/lab";
import usersStore from "../../../../../../store/usersStore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import parkingsStore from "../../../../../../store/parkingsStore";
import {toJS} from "mobx";
import ParkingTreeView from "./ParkingTreeView/ParkingTreeView";
import {observer} from "mobx-react-lite";

const Parkings = ({currentItem}) => {
    const createSelectParkingsItems = () => {
        const user = toJS(usersStore.users).find(user => user.userId === currentItem.id);

        let parkings = toJS(parkingsStore.parkings).map(parking => ({
            name: parking.parkingName,
            number: parking.parkingId
        }));
        parkings = parkings.filter(parking => {
            let index = user.parkings.findIndex(item => item.parkingId === parking.number);
            if (index === -1) return parking;
        });
        return parkings;
    }

    const [currentParking, setCurrentParking] = useState('');
    const [availableParkings, setAvailableParkings] = useState(createSelectParkingsItems());

    useEffect(() => {
        setAvailableParkings(createSelectParkingsItems());
    }, [currentItem.id]);

    const updateAvailableParkings = () => {
        setAvailableParkings(createSelectParkingsItems());
    }

    const handleParkingSelectChange = (field, value) => {
        setCurrentParking(value);
    }

    const onAddAvailableParkingCLickHandler = () => {
        usersStore.addUserParking(currentItem.id, currentParking).then(() => {
            updateAvailableParkings();
        });
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', mt: '8px'}}>
                <LabelAndSelect items={availableParkings} label='Выбор парковки'
                                onChange={handleParkingSelectChange} currentItem={currentParking}/>
                <LoadingButton variant='outlined' onClick={() => onAddAvailableParkingCLickHandler()}
                               color='info'
                               sx={{ml: '8px', minWidth: '110px'}} loading={usersStore.isLoading}
                               loadingPosition="start"
                               size='small'
                               startIcon={<CheckCircleIcon color='inherit'/>}
                               disabled={false}>Добавить</LoadingButton>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', pt: '16px'}}>
                <Box sx={{display: 'flex', fontWeight: 500, borderBottom: '1px solid #1976d2', padding: '4px'}}>
                    <Typography variant='body' component='p' sx={{mr: '16px'}}>Парковка\Терминал</Typography>
                    <Divider orientation="vertical" flexItem sx={{ml: 'auto'}}/>
                    <Typography variant='body' component='p' sx={{ml: '24px', mr: '40px'}}>Действие</Typography>
                </Box>
                <ParkingTreeView currentItem={currentItem} updateAvailableParkings={updateAvailableParkings}/>
            </Box>
        </Box>
    );
};

export default observer(Parkings);
