import React, {useContext, useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {observer} from "mobx-react-lite";
import Stack from "@mui/material/Stack";
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import {Button} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import placesStore from "../../../store/placesStore";
import LoadingButton from "@mui/lab/LoadingButton";
import LabelAndSelect from "../LabelAndSelect/LabelAndSelect";
import parkingsStore from "../../../store/parkingsStore";
import {toJS} from "mobx";
import {toString} from "underscore/modules/_setup";
import {CardAndClientsContext} from "../../pages/CardsAndClients/CardsAndClients";
import form from "../../pages/CardsAndClients/Form/Form";
import {isAnyError} from "../../utils/utils";

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
    limit: 0,
    counter: 0,
}

const defaultErrors = {limit: false, counter: false}

const onlyDigits = /\D/g;

const ReservedPlacesModal = ({open, setOpen, formData, setFormData, isEdit, setIsEdit, companies}) => {

    const {setSnackBarSettings} = useContext(CardAndClientsContext);

    const [placesData, setPlacesData] = useState({
        limit: 0,
        counter: 0,
    });
    const [parkings, setParkings] = useState([]);
    const [selectedParking, setSelectedParking] = useState('');
    const [isError, setIsError] = useState(defaultErrors);
    const [placeLimit, setPlaceLimit] = useState(0);

    const filterParkings = (isEdit) => {
        let filteredParkings = parkingsStore.parkings;
        if (!isEdit) {
            placesStore.itemPlaces.forEach(place => {
                filteredParkings = filteredParkings.filter(item => item.parkingId !== place.parkingId);
            });
        }
        filteredParkings = filteredParkings.map(parking => ({
            name: parking.parkingName,
            number: parking.parkingId,
            limit: parking.maxValue,
        }));
        return filteredParkings;
    }

    const getParkingId = (number) => {
        return toJS(parkingsStore.parkings).find(parking => parking.parkingNumber === number).parkingId;
    }

    const filterClientParkings = (isEdit) => {
        let filteredClientParkings = toJS(placesStore.itemPlaces);
        console.log(filteredClientParkings, 'filteredClientParkings');
        if (!isEdit && placesStore.clientItemPlaces?.length) {
            placesStore.clientItemPlaces.forEach(parking => {
                filteredClientParkings = filteredClientParkings.filter(item => item.parkingName !== parking.parkingName);
            });
        }

        filteredClientParkings = filteredClientParkings.map(parking => ({
            name: parking.parkingName + ` (свободно - ${parking.freeForRezerv})`,
            number: parking.parkingId,
            limit: parking.freeForRezerv,
        }));
        return filteredClientParkings;
    }

    const findParkingPlaces = (id) => {
        const parkingPlace = placesStore.itemPlaces.find(place => place.parkingId === id);
        return {
            limit: parkingPlace.limitValue,
            counter: parkingPlace.counterValue,
        }
    }

    const findClientParkingPlaces = (id) => {
        const parkingPlace = placesStore.clientItemPlaces.find(place => place.parkingId === id);
        return {limit: parkingPlace.limitValue, counter: parkingPlace.counterValue}
    }

    const findParking = (number) => {
        return toJS(parkingsStore.parkings).find(parking => parking.parkingId === number);
    }

    const findPlaceId = (parkingId) => {
        return placesStore.itemPlaces.find(item => item.parkingId === parkingId).parkingPlaceId;
    }

    const findCompanyPlaceId = (parkingId) => {
        return placesStore.itemPlaces.find(item => item.parkingId === parkingId).parkingPlaceId;
    }

    const findClientPlaceId = (parkingId) => {
        return placesStore.clientItemPlaces.find(item => item.parkingId === parkingId).parkingPlaceId;
    }

    const initModal = () => {
        if (isEdit) {
            if (formData.type === 'company') {
                setPlacesData(findParkingPlaces(isEdit));
                setParkings(filterParkings(isEdit));
            } else {
                setPlacesData(findClientParkingPlaces(isEdit));
                setParkings(filterClientParkings(isEdit));
            }
            setSelectedParking(findParking(isEdit).parkingId);
        } else {
            if (formData.type === 'company') {
                setParkings(filterParkings());
            } else {
                setParkings(filterClientParkings());
            }
            if (parkings.length) {
                setSelectedParking(parkings[0].number)
            }
            setPlacesData(defaultData);
        }
    }


    useEffect(() => {
        if (open) {
            if (isEdit) {
                if (formData.type === 'company') {
                    setPlacesData(findParkingPlaces(isEdit));
                    setParkings(filterParkings(isEdit));
                } else {
                    setPlacesData(findClientParkingPlaces(isEdit));
                    setParkings(filterClientParkings(isEdit));
                }
                setSelectedParking(findParking(isEdit).parkingId);
            } else {
                if (formData.type === 'company') {
                    setParkings(filterParkings());
                } else {
                    setParkings(filterClientParkings());
                }
                if (parkings.length) {
                    setSelectedParking(parkings[0].number)
                }
                setPlacesData(defaultData);
            }
        }
    }, [open]);

    useEffect(() => {
        if (parkings.length && !isEdit) {
            setSelectedParking(parkings[0].number)
        }
    }, [parkings]);


    useEffect(() => {
        if (isEdit) {
            if (formData.type === 'company') {
                setPlacesData(findParkingPlaces(isEdit));
                setParkings(filterParkings(isEdit));
            } else {
                setPlacesData(findClientParkingPlaces(isEdit));
                setParkings(filterClientParkings(isEdit));
            }
            setSelectedParking(findParking(isEdit).parkingId);
        } else {
            if (formData.type === 'company') {
                setParkings(filterParkings());
            } else {
                setParkings(filterClientParkings());
            }
            if (parkings.length) {
                setSelectedParking(parkings[0].number)
            }
            setPlacesData(defaultData);
        }
    }, [isEdit]);

    const handleCloseModal = () => {
        setOpen(false);
        setIsEdit(false);
        setIsError(defaultErrors);
    }

    const handleDataChange = (field, value) => {
        let limit = 0;
        let clientLimit = 0;
        if (formData.type === 'client') {
            clientLimit = toJS(placesStore.clientItemPlaces).find(item => item.parkingId === placesData.parkingId)?.limitValue || 0;
            limit = toJS(placesStore.itemPlaces).find(item => item.parkingId === placesData.parkingId).freeForRezerv;
        }
        let amount;

        if (value === '') {
            amount = 0;
        } else {
            amount = parseInt(value, 10);
        }

        setPlacesData({
            ...placesData,
            [field]: amount,
        });

        if (formData.type === 'client') {
            if (field === 'limit') {
                if (amount > limit + clientLimit) {
                    setIsError({counter: false, limit: true});
                } else if (amount < placesData.counter) {
                    setIsError({limit: false, counter: true});
                } else {
                    setIsError(defaultErrors);
                }
            } else if (field === 'counter') {
                setIsError({...isError, counter: false});
                if (amount > placesData.limit) {
                    setIsError({...isError, counter: true});
                }
            }
        } else {
            if (amount < placesData.counter) {
                setIsError({limit: true, counter: false});
            } else {
                setIsError(defaultErrors);
            }
        }
    }

    console.log(isError, 'is Error');

    const onSaveButtonCLickHandler = () => {
        let data = placesData;
        let type = formData.type;
        let id = type === 'company' ? formData.companyNumber : formData.clientNumber;

        if (isEdit) {
            data.threshold = 0;

            if (type === 'company') {
                data.placeId = findPlaceId(data.parkingId);
            } else {
                data.placeId = findClientPlaceId(isEdit);
                delete data.parkingId;
            }

            placesStore.changeReservedPlaces(type, id, data).then(response => {
                if (response.status.toString()[0] === '2') {
                    if (type === 'client') {
                        placesStore.updateClientPlace(response.data);
                        placesStore.updatePlace(response.data);
                    } else {
                        placesStore.updatePlace(response.data);

                    }
                    handleCloseModal();
                    setPlacesData(defaultData);
                    setSnackBarSettings({
                        label: 'Машиноместо успешно обновлено',
                        severity: 'success',
                        opened: true
                    });
                } else {
                    setSnackBarSettings({
                        label: 'Ошибка:' + response.data.errorMsg,
                        severity: 'error',
                        opened: true
                    });
                }
            });
        } else {
            if (type === 'client' && !isEdit) {
                data.placeId = findCompanyPlaceId(data.parkingId);
                delete data.parkingId;
            }

            placesStore.addReservedPlaces(type, id, data).then(response => {
                if (response.status.toString()[0] === '2') {
                    if (type === 'client') {
                        placesStore.setClientItemPlaces(response.data.complexPlaces);
                    } else {
                        placesStore.setItemPlaces(response.data.complexPlaces);
                    }
                    handleCloseModal();
                    setPlacesData(defaultData);
                    setSnackBarSettings({
                        label: 'Машиноместо успешно добавлено',
                        severity: 'success',
                        opened: true
                    });
                } else {
                    setSnackBarSettings({
                        label: 'Ошибка:' + response.data.errorMsg,
                        severity: 'error',
                        opened: true
                    });
                }
            });
        }

    }

    const findCompanyParkingPlaces = (id) => {
        return placesStore.places.find(place => place.parkingNumber === id);
    }

    const handleParkingSelectChange = (field, value) => {
        // const place = findCompanyParkingPlaces(parseInt(value, 10));
        setPlacesData({...placesData, parkingId: value});
        setSelectedParking(value);
    }

    console.log(isEdit, 'is edit');
    console.log(placesData, 'placesData');

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack spacing={0.6}>
                    <LabelAndSelect label='Выберите парковку' onChange={handleParkingSelectChange} items={parkings}
                                    currentItem={selectedParking} labelWidth='320px'
                                    disabled={!!isEdit || !parkings.length}/>
                    <LabelAndInput label='Максимальное значение резерва (шт.)' labelWidth='320px' labelMinWidth='320px'
                                   value={placesData.limit}
                                   onChange={(e) => handleDataChange('limit', e.target.value.replace(onlyDigits, ""))}
                                   helperText={isError.limit ? 'Ошибка' : ''}
                                   error={isError.limit}
                    />
                    <LabelAndInput label='Текущее значение резерва (шт.)' labelWidth='320px' labelMinWidth='320px'
                                   value={placesData.counter}
                                   onChange={(e) => handleDataChange('counter', e.target.value.replace(onlyDigits, ""))}
                                   disabled={formData.type === 'company'}
                                   helperText={isError.counter ? 'Ошибка' : ''}
                                   error={isError.counter}
                    />
                </Stack>
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'flex-end', mt: '16px'}}>
                    <LoadingButton variant='outlined' startIcon={<SaveIcon color='inherit'/>}
                                   onClick={() => onSaveButtonCLickHandler()} sx={{mr: '8px'}}
                                   disabled={!placesData.limit || isAnyError(isError)}
                                   loading={placesStore.isLoading}
                                   loadingIndicator='Сохраняю...'>Сохранить</LoadingButton>
                    <Button variant='outlined' startIcon={<CancelIcon color='error'/>}
                            onClick={() => handleCloseModal()}>Отмена</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default observer(ReservedPlacesModal);
