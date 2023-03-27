import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import systemsStore from "../../../../store/systemsStore";
import {observer} from "mobx-react-lite";
import SystemsList from "./SystemsList/SystemsList";
import ShiftGrid from "./ShiftGrid/ShiftGrid";
import ShiftFilters from "./ShiftFilters/ShiftFilters";
import SideShiftReport from "./ShiftGrid/SideShiftReport/SideShiftReport";
import reportsStore from "../../../../store/reportsStore";

const ShiftReport = ({reportData}) => {
    const [showMainReport, setShowMainReport] = useState(true)
    const [currentSystem, setCurrentSystem] = useState(null);
    const [resetCallback, setResetCallback] = useState(null);
    const [resetGridCallback, setResetGrid] = useState(null);

    useEffect(() => {
        systemsStore.getSystems();
    }, []);

    useEffect(() => {
        setShowMainReport(true);
        reportsStore.reports = [];
    }, [currentSystem]);

    const resetCallbackInvoke = () => {
        console.log('reset')
        resetCallback();
    }

    const resetGrid = () => {
        resetGridCallback();
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: '16px'}}>
            <Typography variant='h5' component='h5'>Отчет за смену</Typography>
            <Box sx={{display: 'flex'}}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '220px',
                    maxHeight: 'calc(100vh - 116px)',
                    height: 'calc(100vh - 116px)'
                }}>
                    <Typography variant='p' component='p' sx={{alignSelf: 'center'}}>выбор системы</Typography>
                    <SystemsList setCurrentSystem={setCurrentSystem} resetCallback={resetCallbackInvoke}/>
                </Box>
                {showMainReport ?
                    <>
                        <ShiftFilters currentSystem={currentSystem} setResetCallback={setResetCallback} resetGrid={resetGrid}/>
                        <ShiftGrid reportData={reportData} setShowMainReport={setShowMainReport} setResetGrid={setResetGrid}/>
                    </> : <SideShiftReport setShowMainReport={setShowMainReport}/>}
            </Box>
        </Box>
    );
};

export default observer(ShiftReport);
