import React, {useCallback, useEffect, useRef, useState} from 'react';
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar/Sidebar";
import {Routes, Route} from "react-router-dom";
import CardsAndClients from "../CardsAndClients/CardsAndClients";
import Events from "../Events/Events";
import Alarms from "../Alarms/Alarms";
import TerminalEventsFilter from "../TerminalEventsFilter/TerminalEventsFilter";
import CardsEventsFilter from "../CardsEventFilter/CardsEventsFilter";
import PageNotFound from "../PageNotFound/PageNotFound";
import RootPage from "../RootPage/RootPage";
import Parking from "../Parking/Parking";
import Header from "../../molecules/Header/Header.jsx";
import Reports from "../Reports/Reports.jsx";
import FiscalManager from "../FiscalManager/FiscalManager";
import ParkingPlaces from "../ParkingPlaces/ParkingPlaces";
import UsersAndRules from "../UsersAndRules/UsersAndRules";
import {observer} from "mobx-react-lite";
import parkingsStore from "../../../store/parkingsStore";
import eventsStore from "../../../store/eventsStore";
import {processWebSocketMessage} from "../../utils/webSocketManager";
import cardTemplatesStore from "../../../store/cardTemplatesStore";
import terminalsStore from "../../../store/terminalsStore";
import ReconnectingWebSocket from 'reconnecting-websocket';
import {ALERTS_CONFIG} from "../../../config";
import {useSnackbar} from "notistack";
import {WS_BASE_IP} from "../../../environment";
import alarmsStore from "../../../store/alarmsStore";
import usersStore from "../../../store/usersStore";

const init = () => {
    parkingsStore.getParkings();
    eventsStore.getEventTypes();
    eventsStore.getEventTemplates();
    cardTemplatesStore.getLongTermTemplates();
    cardTemplatesStore.getShortTermTemplates();
    terminalsStore.getTerminals();
    terminalsStore.getAllTerminals();
    usersStore.getUsers();
}


const Layout = ({children}) => {
    const container = useRef();
    const [containerWidth, setContainerWidth] = useState(0);
    const [initEvents, setInitEvents] = useState(null);
    const {enqueueSnackbar} = useSnackbar();

    const showNotification = useCallback((id, text) => {
        const {notificationText, severity} = ALERTS_CONFIG[id];

        enqueueSnackbar((text || notificationText), {variant: severity});
    }, []);

    const webSocketConnect = useCallback(() => {
        const wsOptions = {
            maxReconnectionDelay: 3000,
            maxRetries: 20,
        }
        const ws = new ReconnectingWebSocket(`ws://${WS_BASE_IP}:8080/APIServer/SocketsServer/endpoints/${WS_BASE_IP}/application`, [], wsOptions);
        ws.onopen = () => {
            console.log(ws);
            console.log('connected to ws');
        }

        ws.onmessage = (event) => {
            const wsData = JSON.parse(event.data);
            console.log(wsData, 'ws event');

            if (wsData.event_id) {
                eventsStore.getEventsFromWs(wsData);
            } else if (wsData.alarmId) {
                alarmsStore.getAlarmsFromWs(wsData);
            }
            processWebSocketMessage(wsData);

            //TODO проверку alarm.
            try {
                showNotification(wsData.event_type_id);
            } catch (error) {
                throw new Error('В конфигурационном файле нет параметров для данного типа событий. Добавьте параметры в файле src/config.js');
            }
        }

        // ws.onerror = function (err) {
        //     console.error('Socket encountered error: ', err.message, 'Closing socket');
        //     ws.close();
        // };
        //
        ws.onclose = (event) => {
            if (event.wasClean) {
                console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                console.log('[close] Соединение прервано');
            }
        };

        return ws;
    }, []);

    useEffect(() => {
        if (container.current) {
            setContainerWidth(container.current.clientWidth);
        }

        init();

        const ws = webSocketConnect();

        const closeWSConnection = () => {
            console.log('logout')
            ws.close(1000, 'Отключение при логауте');
        }

        return () => {
            closeWSConnection();
        }
    }, []);

    useEffect(() => {
        const listener = () => {
            if (container.current) {
                setContainerWidth(container.current.clientWidth);
            }
        }
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    });

    const resize = () => {
        setContainerWidth(container.current.clientWidth);
    }

    return (
        <>
            <Header/>
            <Box sx={{display: 'flex', height: 'calc(100vh - 48px)'}}>
                <Sidebar resize={resize}/>
                <Box sx={{flexGrow: 1, display: 'flex'}} ref={container}>
                    {/*{children}*/}
                    <Routes>
                        <Route path='/' element={<RootPage/>}/>
                        <Route path='/clients-and-cards' element={<CardsAndClients/>}/>
                        <Route path='/events'
                               element={<Events containerWidth={containerWidth} setInitEvents={setInitEvents}/>}/>
                        <Route path='/alarms' element={<Alarms containerWidth={containerWidth}/>}/>
                        <Route path='/terminal_events'
                               element={<TerminalEventsFilter containerWidth={containerWidth}/>}/>
                        <Route path='/card_events' element={<CardsEventsFilter containerWidth={containerWidth}/>}/>
                        <Route path='/parkings/:id' element={<Parking containerWidth={containerWidth}/>}/>
                        <Route path='/reports/:type' element={<Reports containerWidth={containerWidth}/>}/>
                        <Route path='/fiscal' element={<FiscalManager containerWidth={containerWidth}/>}/>
                        <Route path='/places' element={<ParkingPlaces containerWidth={containerWidth}/>}/>
                        <Route path='/users_config' element={<UsersAndRules containerWidth={containerWidth}/>}/>
                        <Route path='*' element={<PageNotFound containerWidth={containerWidth}/>}/>
                    </Routes>
                </Box>
            </Box>
        </>
    );
};

export default observer(Layout);
