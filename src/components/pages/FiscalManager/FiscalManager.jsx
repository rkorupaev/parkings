import React, {useContext, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import systemsStore from "../../../store/systemsStore";
import SystemsList from "../../molecules/ReportsParts/ShiftReport/SystemsList/SystemsList";
import Typography from "@mui/material/Typography";
import FiscalTabs from "../../molecules/FiscalTabs/FiscalTabs";
import parkingsStore from "../../../store/parkingsStore";
import terminalsStore from "../../../store/terminalsStore";

const FiscalManager = () => {
    const [currentSystem, setCurrentSystem] = useState(null);

    useEffect(() => {
        systemsStore.getSystems();
        parkingsStore.getParkings();
        terminalsStore.getTerminals();
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
                {currentSystem ? <FiscalTabs currentSystem={currentSystem}/> : ''}
            </Box>
        </Box>
    );
};

export default FiscalManager;
