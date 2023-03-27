import './Sidebar.scss';
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportIcon from '@mui/icons-material/Report';
import {Box} from "@mui/material";
import TerminalIcon from '@mui/icons-material/Terminal';
import StyleIcon from '@mui/icons-material/Style';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {observer} from "mobx-react-lite";
import parkingsStore from "../../../../store/parkingsStore";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SummarizeIcon from '@mui/icons-material/Summarize';
import React, {useEffect, useMemo, useState} from "react";
import {ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, SubMenu, MenuItem} from 'react-pro-sidebar';
import NewNestedList from "./NestedList/NewNestedList";
import ReceiptIcon from '@mui/icons-material/Receipt';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';


const Sidebar = observer(({resize}) => {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        resize();
    }, [collapsed])

    const parkingsArray = parkingsStore.parkings.map(item => ({
        key: '/parkings/' + item.parkingId,
        label: item.parkingName,
        route: '/parkings/' + item.parkingId,
        color: 'info',
    }));

    console.log(parkingsArray, 'array')
    console.log(collapsed, 'collapsed')

    const listItems = useMemo(() => [
        {
            key: "main_menu",
            label: "Основные функции",
            icon: EventIcon,
            color: 'info',
            items: [
                {
                    key: "events",
                    label: "События",
                    icon: EventIcon,
                    route: '/events',
                    color: 'info'
                },
                {
                    key: "terminal_events",
                    label: "События по терминалу",
                    icon: TerminalIcon,
                    route: '/terminal_events',
                    color: 'info'
                },
                {
                    key: "card_events",
                    label: "События по карте",
                    icon: StyleIcon,
                    route: '/card_events',
                    color: 'info'
                },
                {
                    key: "alarms",
                    label: "Тревоги",
                    icon: WarningAmberIcon,
                    route: '/alarms',
                    color: 'warning'
                },
                {
                    key: "places",
                    label: "Парковочные места",
                    icon: ZoomInMapIcon,
                    route: '/places',
                    color: 'info'
                },
                {
                    key: "fiscal",
                    label: "Фискальный менеджер",
                    icon: ReceiptIcon,
                    route: '/fiscal',
                    color: 'info'
                },
            ]
        },
        // {
        //     key: "favorite_parkings",
        //     label: "Избранные",
        //     icon: StarOutlineIcon,
        //     color: 'info',
        //     items: []
        // },
        {
            key: "parkings",
            label: "Парковки",
            icon: LocalParkingIcon,
            color: 'info',
            items: parkingsArray
        },

        {
            key: "clients_and_cards",
            label: "Клиенты и карты",
            icon: GroupsIcon,
            color: 'info',
            items: [
                {
                    key: "clients_and_cards",
                    label: "Клиенты и карты",
                    icon: GroupsIcon,
                    route: '/clients-and-cards',
                    color: 'info',
                }
            ]
        },
        {
            key: "reports",
            label: "Отчеты",
            icon: SummarizeIcon,
            color: 'info',
            items: [
                {
                    key: "/reports/events",
                    label: "Отчет по событиям",
                    // icon: SettingsApplicationsIcon,
                    route: '/reports/events',
                    color: 'info',
                },
                {
                    key: "/reports/user_actions",
                    label: "Журнал действий пользователя",
                    // icon: SettingsAccessibilityIcon,
                    route: '/reports/user_actions',
                    color: 'info',
                },
                {
                    key: "/reports/capacity",
                    label: "Отчет по заполняемости",
                    // icon: PointOfSaleIcon,
                    route: '/reports/capacity',
                    color: 'info',
                },
                {
                    key: "/reports/payment_movement_summary",
                    label: "Суммарный отчет по оплатам и передвижениям",
                    // icon: PointOfSaleIcon,
                    route: '/reports/payment_movement_summary',
                    color: 'info',
                },
                {
                    key: "/reports/payment_movement_distribution",
                    label: "Отчет по распределениям оплат и передвижений",
                    // icon: PointOfSaleIcon,
                    route: '/reports/payment_movement_distribution',
                    color: 'info',
                },
                {
                    key: "/reports/payment_movement",
                    label: "Отчет по оплатам и передвижениям",
                    // icon: PointOfSaleIcon,
                    route: '/reports/payment_movement',
                    color: 'info',
                },
                {
                    key: "/reports/longterm_card",
                    label: "Отчет по абонементам",
                    // icon: PointOfSaleIcon,
                    route: '/reports/longterm_card',
                    color: 'info',
                },
                {
                    key: "/reports/shift",
                    label: "Отчет за смену",
                    // icon: PointOfSaleIcon,
                    route: '/reports/shift',
                    color: 'info',
                },
            ]
        },
        {
            key: "settings",
            label: "Настройки",
            icon: SettingsIcon,
            color: 'info',
            items: [
                // {
                //     key: "config",
                //     label: "Конфигурация",
                //     icon: SettingsApplicationsIcon,
                //     route: '/config',
                //     color: 'info',
                // },
                {
                    key: "users_config",
                    label: "Права и пользователи",
                    icon: SettingsAccessibilityIcon,
                    route: '/users_config',
                    color: 'info',
                },
                // {
                //     key: "fares_config",
                //     label: "Тарифы",
                //     icon: PointOfSaleIcon,
                //     route: '/fares_config',
                //     color: 'info',
                // },
            ]
        }
    ], [parkingsArray]);

    return (
        <ProSidebar collapsed={collapsed}>
            <SidebarContent>
                <NewNestedList items={listItems}/>
            </SidebarContent>
            <SidebarFooter>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    {!collapsed ? <IconButton onClick={() => setCollapsed(true)} color='primary' size='large'
                                              sx={{marginRight: '15px'}}>
                            <KeyboardDoubleArrowLeftIcon fontSize='inherit'/>
                        </IconButton> :
                        <IconButton onClick={() => setCollapsed(false)} color='primary' size='large'
                                    sx={{marginRight: '15px'}}>
                            <KeyboardDoubleArrowRightIcon fontSize='inherit'/>
                        </IconButton>}
                </Box>
            </SidebarFooter>
        </ProSidebar>
    );
});

export default Sidebar;
