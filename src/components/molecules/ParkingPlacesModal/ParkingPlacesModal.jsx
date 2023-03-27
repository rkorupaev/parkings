import React, {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {observer} from "mobx-react-lite";
import Stack from "@mui/material/Stack";
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {checkForm} from "../../utils/utils";
import placesStore from "../../../store/placesStore";
import LoadingButton from "@mui/lab/LoadingButton";
import {toJS} from "mobx";
import parkingsStore from "../../../store/parkingsStore";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
};

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

const onlyDigits = /\D/g;

const ParkingPlacesModal = ({open, setOpen, item = {}, rerenderParkings, setCurrentPlace}) => {
    const handleCloseModal = () => {
        setOpen(false);
        setCurrentPlace(null);
    }

    const [placeData, setPlaceData] = useState(defaultData);
    const [initialPlaceData, setInitialPlaceData] = useState(defaultData);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (item) {
            setPlaceData(item);
            setInitialPlaceData(item);
        }
    }, [item]);

    const handleDataChange = (field, value) => {
        let newValue = value;
        if (value > placeData[field].total) newValue = placeData[field].total;
        if (value <= 0) newValue = 0;
        setPlaceData({...placeData, [field]: {...placeData[field], occupied: parseInt(newValue)}});
    }

    useEffect(() => {
        setIsChanged(!checkForm(initialPlaceData, placeData));
    }, [placeData]);

    const onSaveButtonCLickHandler = () => {
        let data = {};
        data.parkingNumber = item.parkingNumber;

        let promises = [];

        if (placeData.reservedPlaces.occupied !== initialPlaceData.reservedPlaces.occupied) {
            data.counterTag = 'RESERVED';
            data.changeValue = placeData.reservedPlaces.occupied - initialPlaceData.reservedPlaces.occupied;
            promises.push(placesStore.changePlaces(data));
        }

        if (placeData.nonReserved !== initialPlaceData.nonReserved) {
            data.counterTag = 'NON_RESERVED';
            data.changeValue = placeData.nonReserved - initialPlaceData.nonReserved;
            promises.push(placesStore.changePlaces(data));
        }

        Promise.all(promises).then((response) => {
            const lastData = response.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];
            placesStore.updatePlace(lastData);
            setIsChanged(false);
            setInitialPlaceData(structuredClone(placeData));
            rerenderParkings();
            handleCloseModal();
        });
    }

    const getParkingId = (number) => {
        return toJS(parkingsStore.parkings).find(parking => parking.parkingNumber === number).parkingId;
    }

    const onSaveButtonClickHandlerNew = () => {
        let promises = [];

        if (placeData.reservedPlaces.occupied !== initialPlaceData.reservedPlaces.occupied) {
            promises.push(placesStore.changeComplexPlaces(getParkingId(item.parkingNumber), {
                placeId: placeData.reservedPlaces.placeId,
                limit: placeData.reservedPlaces.total,
                counter: placeData.reservedPlaces.occupied,
                threshold: placeData.reservedPlaces.total,
            }));
        }

        if (placeData.nonReservedPlaces.occupied !== initialPlaceData.nonReservedPlaces.occupied) {
            promises.push(placesStore.changeComplexPlaces(getParkingId(item.parkingNumber), {
                placeId: placeData.nonReservedPlaces.placeId,
                limit: placeData.nonReservedPlaces.total,
                counter: placeData.nonReservedPlaces.occupied,
                threshold: placeData.nonReservedPlaces.total,
            }));
        }

        Promise.all(promises).then((response) => {
            console.log(response, 'response');
            response.forEach(res => {
                placesStore.updatePlace(res);
            })
            setIsChanged(false);
            setInitialPlaceData(structuredClone(placeData));
            placesStore.getDetailedPlaces().then(() => {
                rerenderParkings();
            });
            handleCloseModal();
        });
    }

    console.log(item, 'item');

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="p" component="p"
                            sx={{marginBottom: '12px', alignSelf: 'flex-start'}}>
                    Изменение текущих счетчиков парковочных мест
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{display: 'flex', pl: '210px', mb: '8px'}}>
                        <Typography variant='p' component='p' sx={{mr: '60px'}}>Текущие значения</Typography>
                        <Typography variant='p' component='p'>Предельные значения</Typography>
                    </Box>
                    <Stack spacing={0.7}>
                        <Box sx={{display: 'flex'}}>
                            <LabelAndInput label='Без резервирования' labelWidth='170px' labelMinWidth='170px'
                                           value={parseInt(placeData.nonReservedPlaces.occupied)}
                                           onChange={(e) => handleDataChange('nonReservedPlaces', e.target.value.replace(onlyDigits, ""))}
                            />
                            <TextField variant="outlined" size="small" disabled={true} sx={{ml: '8px'}}
                                       value={placeData.nonReservedPlaces.total}/>
                        </Box><Box sx={{display: 'flex'}}>
                        <LabelAndInput label='С резервированием' labelWidth='170px' labelMinWidth='170px'
                                       value={parseInt(placeData.reservedPlaces.occupied)}
                                       onChange={(e) => handleDataChange('reservedPlaces', e.target.value.replace(onlyDigits, ""))}
                                       disabled
                        />
                        <TextField variant="outlined" size="small" disabled={true} sx={{ml: '8px'}}
                                   value={placeData.reservedPlaces.total}/>
                    </Box><Box sx={{display: 'flex'}}>
                        <LabelAndInput label='Итого' labelWidth='170px'
                                       value={parseInt(placeData.reservedPlaces.occupied) + parseInt(placeData.nonReservedPlaces.occupied)}
                                       onChange={() => {
                                       }} disabled/>
                        <TextField variant="outlined" size="small" disabled={true} sx={{ml: '8px'}}
                                   value={parseInt(placeData.reservedPlaces.total) + parseInt(placeData.nonReservedPlaces.total)}
                        />
                    </Box>
                    </Stack>
                    <Box sx={{display: 'flex', width: '100%', justifyContent: 'flex-end', mt: '16px'}}>
                        <LoadingButton variant='outlined' startIcon={<SaveIcon color='inherit'/>}
                                       onClick={() => onSaveButtonClickHandlerNew()} sx={{mr: '8px'}}
                                       disabled={!isChanged}
                                       loading={placesStore.isLoading}
                                       loadingIndicator='Сохраняю...'>Сохранить</LoadingButton>
                        <Button variant='outlined' startIcon={<CancelIcon color='error'/>}
                                onClick={() => handleCloseModal()}>Отмена</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default observer(ParkingPlacesModal);
