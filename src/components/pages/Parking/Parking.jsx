import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ControlMenu from "./ControlMenu/ControlMenu";
import TerminalItem from "./TerminalItem/TerminalItem";
import terminalsStore from "../../../store/terminalsStore";
import {observer} from "mobx-react-lite";
import parkingsStore from "../../../store/parkingsStore";
import CashModal from "../../molecules/CashModal/CashModal";
import DevicesModal from "../../molecules/DevicesModal/DevicesModal";
import CircularProgress from "@mui/material/CircularProgress";
import LostTicketModal from "../../molecules/LostTicketModal/LostTicketModal";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import {toJS} from "mobx";

const getParkingInfo = (id) => {
    return parkingsStore.parkings.find(parking => parking.parkingId === +id) || '';
}

const Parking = () => {
    const {id} = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [currentTerminal, setCurrentTerminal] = useState(getParkingInfo(id));
    const [currentParking, setCurrentParking] = useState({});
    const [isCashModalOpened, setIsCashModalOpened] = useState(false);
    const [isDeviceModalOpened, setIsDeviceModalOpened] = useState(false);
    const [isLostTicketModalOpened, setIsLostTicketModalOpened] = useState(false);

    const openControlMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        // terminalsStore.getTerminalStatus(id);
        setCurrentParking(getParkingInfo(id));
    }, [parkingsStore.parkings]);

    useEffect(() => {
        terminalsStore.getTerminalStatus(id);
        setCurrentParking(getParkingInfo(id));
    }, [id]);

    if (!terminalsStore.statuses?.length && terminalsStore.isLoading) return (
        <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
            <CircularProgress size={80}/>
        </Box>
    );

    if (!terminalsStore.statuses?.length) return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: '16px'}}>
            <Typography variant='h5' component='h5'
                        sx={{mb: '16px'}}>Парковка: {currentParking.parkingName} ({currentParking.parkingNumber}) </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 113px)'
                }}>
                <Typography variant='h6' component='h6'>На парковке нет доступных терминалов</Typography>
                <AnnouncementIcon color='warning' sx={{ml: '16px'}}/>
            </Box>
        </Box>
    );

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: '16px'}}>
            <Typography variant='h5' component='h5'
                        sx={{mb: '16px'}}>Парковка: {currentParking.parkingName} ({currentParking.parkingNumber}) </Typography>
            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                {terminalsStore.statuses.length ? terminalsStore.statuses.map((item) => (
                    <TerminalItem key={item.terminalId} item={item} openControlMenu={openControlMenu}
                                  open={open}
                                  setCurrentTerminal={setCurrentTerminal}/>
                )) : ''}
                <ControlMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} open={open}
                             currentTerminal={currentTerminal} setCurrentTerminal={setCurrentTerminal}
                             openCashModal={setIsCashModalOpened}
                             openDeviceModal={setIsDeviceModalOpened} openLostTicketModal={setIsLostTicketModalOpened}/>
            </Box>
            <CashModal open={isCashModalOpened} setOpen={setIsCashModalOpened} item={currentTerminal}/>
            <DevicesModal open={isDeviceModalOpened} setOpen={setIsDeviceModalOpened} item={currentTerminal}/>
            <LostTicketModal open={isLostTicketModalOpened} setOpen={setIsLostTicketModalOpened} item={currentParking}
                             terminal={currentTerminal}/>
        </Box>
    );
};

export default observer(Parking);
