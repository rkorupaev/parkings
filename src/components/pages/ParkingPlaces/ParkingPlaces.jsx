import React, {useEffect, useState} from 'react';
import systemsStore from "../../../store/systemsStore";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SystemsList from "../../molecules/ReportsParts/ShiftReport/SystemsList/SystemsList";
import ParkingPlacesGrid from "./ParkingPlacesGrid/ParkingPlacesGrid";
import ParkingPlacesModal from "../../molecules/ParkingPlacesModal/ParkingPlacesModal";
import placesStore from "../../../store/placesStore";
import {toJS} from "mobx";
import parkingsStore from "../../../store/parkingsStore";
import {observer} from "mobx-react-lite";

const ParkingPlaces = () => {
    const [currentSystem, setCurrentSystem] = useState(null);
    const [currentPlace, setCurrentPlace] = useState(null);
    const [isPlacesModalOpened, setIsPlacesModalOpened] = useState(false);
    const [parkings, setParkings] = useState([]);

    const getParkingPlaces = (id) => {
        return toJS(placesStore.places).find(item => item.parkingNumber === id);
    }

    const rerenderParkings = () => {
        const filteredParking = toJS(parkingsStore.parkings).filter(parking => (parking.systemId == currentSystem && getParkingPlaces(parking.parkingNumber)?.reservedPlaces));
        setParkings([...filteredParking]);
    }

    useEffect(() => {
        systemsStore.getSystems();
        placesStore.getDetailedPlaces();
    }, []);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: '16px'}}>
            <Box sx={{display: 'flex'}}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '300px',
                    minWidth: '300px',
                    maxHeight: 'calc(100vh - 80px)',
                    height: 'calc(100vh - 80px)'
                }}>
                    <Typography variant='p' component='p' sx={{alignSelf: 'center'}}>Выбор системы</Typography>
                    <SystemsList setCurrentSystem={setCurrentSystem}/>
                </Box>
                <Box sx={{display: 'flex', flexGrow: 1, marginTop: '19px'}}>
                    {currentSystem ?
                        <ParkingPlacesGrid currentSystem={currentSystem} setIsPlacesModalOpened={setIsPlacesModalOpened}
                                           setCurrentPlace={setCurrentPlace} parkings={parkings}
                                           rerenderParkings={rerenderParkings} getParkingPlaces={getParkingPlaces}
                                           currentPlace={currentPlace}/>
                        : <Typography variant='h6' component='h6' sx={{textAlign: 'center', width: '100%'}}>Выберите
                            систему</Typography>}
                </Box>
            </Box>
            <ParkingPlacesModal open={isPlacesModalOpened} setOpen={setIsPlacesModalOpened} item={currentPlace}
                                rerenderParkings={rerenderParkings} setCurrentPlace={setCurrentPlace}/>
        </Box>
    );
};

export default observer(ParkingPlaces);
