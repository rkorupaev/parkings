import React, {useEffect} from 'react';
import IconButton from "@mui/material/IconButton";
import SettingsIcon from '@mui/icons-material/Settings';
import Box from "@mui/material/Box";
import eventsStore from "../../../../store/eventsStore";
import GridNoRowBlock from "../../../molecules/GridNoRowBlock/GridNoRowBlock";
import {observer} from "mobx-react-lite";
import placesStore from "../../../../store/placesStore";
import ParkingCapacity from "./ParkingCapacity/ParkingCapacity";
import {DataGridPro} from "@mui/x-data-grid-pro";

const gridStyle = {
    marginBottom: '12px',
    fontSize: '12px',
}

const ParkingPlacesGrid = ({
                               currentSystem,
                               setIsPlacesModalOpened,
                               setCurrentPlace,
                               parkings,
                               rerenderParkings,
                               getParkingPlaces,
                               currentPlace,
                           }) => {

    useEffect(() => {
        rerenderParkings();
    }, [currentSystem, placesStore.places]);

    const onPlacesSettingsButtonClick = (id) => {
        setIsPlacesModalOpened(true);
        setCurrentPlace(getParkingPlaces(id));
    }

    const parkingsGrid = {
        columns: [
            {field: 'parkingName', headerName: 'Парковка', minWidth: 150, sortable: false,},
            {
                field: 'places', headerName: 'Места', minWidth: 200, flex: 1,
                renderCell: (cellValue) => {
                    return (
                        <ParkingCapacity parkingNumber={cellValue.row?.parkingNumber}
                                         getParkingPlaces={getParkingPlaces} currentPlace={currentPlace}/>
                    )
                },
                sortable: false,
            },
            {
                field: 'openPlacesModal', headerName: '', maxWidth: 30, renderCell: (cellValues) => {
                    return (
                        <IconButton onClick={(e) => onPlacesSettingsButtonClick(cellValues.row.parkingNumber)}
                                    size='small'
                                    aria-label='add comment'>
                            <SettingsIcon color="primary"/>
                        </IconButton>
                    )
                },
                sortable: false,
            },

        ]
    }

    return (
        <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'row', padding: '16px', pt: 0, pb: 0}}>
            <DataGridPro
                rowHeight={50}
                rows={parkings}
                columns={parkingsGrid.columns}
                density='compact'
                sx={gridStyle}
                disableColumnSelector
                disableColumnMenu
                loading={eventsStore.isLoading}
                getRowId={(row) => row.parkingId}
                components={{
                    NoRowsOverlay: () => (
                        <GridNoRowBlock label='Парковок'/>
                    )
                }}
                disableSelectionOnClick={true}
            />
        </Box>
    );
};

export default observer(ParkingPlacesGrid);
