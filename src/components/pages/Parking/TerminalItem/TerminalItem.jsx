import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ext_base from "../../../../assets/images/terminals/ext_base.png";
import ent_base from "../../../../assets/images/terminals/ent_base.png";
import akt_base from "../../../../assets/images/terminals/akt_base.png";
import manual_akt_base from "../../../../assets/images/terminals/manual_akt_base.png";
import virtual_akt_base from "../../../../assets/images/terminals/virtual_akt_base.png";
import online from "../../../../assets/images/terminals/is_online.png";
import offline from "../../../../assets/images/terminals/is_offline.png";
import is_on from "../../../../assets/images/terminals/is_on.png";
import is_off from "../../../../assets/images/terminals/is_off.png";
import barrier_broken from "../../../../assets/images/terminals/barrier_broken.png";
import barrier_close from "../../../../assets/images/terminals/barrier_close.png";
import barrier_open from "../../../../assets/images/terminals/barrier_open.png";
import is_blocked from "../../../../assets/images/terminals/is_blocked.png";
import is_unblocked from "../../../../assets/images/terminals/is_unblocked.png";
import loop_a from "../../../../assets/images/terminals/A.png";
import loop_b from "../../../../assets/images/terminals/B.png";
import loop_c from "../../../../assets/images/terminals/C.png";
import TooltipTypography from "../../../molecules/TooltipTypography/TooltipTypography";
import {observer} from "mobx-react-lite";

const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '96px',
    height: '96px'
}

const terminalTypes = {
    '0': ent_base,
    '1': ext_base,
    '2': akt_base,
    '3': manual_akt_base,
    '4': virtual_akt_base,
    '5': ''
}

const ENTRY_BARRIER_TYPE_ID = 0;
const EXT_BARRIER_TYPE_ID = 1;
const AKT_BASE_TYPE_ID = 2;
const VIRT_AKT_BASE_TYPE_ID = 4;
const MANUAL_AKT_BASE = 3;
const PASS_BARRIER_TYPE_ID = 5;

const TerminalItem = ({item, openControlMenu, open, setCurrentTerminal}) => {

    const onTerminalClickHandler = (event) => {
        setCurrentTerminal(item);
        openControlMenu(event);
    }

    const getBusyLoop = () => {
        let loops = {};
        if (item) {
            loops.loop_a = item.statusLoopABusy && loop_a;
            loops.loop_b = item.statusLoopBBusy && loop_b;
            loops.loop_c = item.statusLoopCBusy && loop_c;

            for (let loop in loops) {
                if (loops[loop]) {
                    console.log(loop, 'loop');
                    return loop;
                }
            }
        }

        return '';
    }

    const getTerminalType = (type) => {
        return terminalTypes[type];
    }

    const getHoursAndMinutes = () => {
        let minutes = item.mashValue / 60;
        const hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;
        return `${hours}ч ${minutes}м`;
    }

    return (
        <Box
            sx={{
                width: '96px',
                minHeight: '120px',
                mr: '16px',
                mb: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            onClick={onTerminalClickHandler} aria-controls={open ? 'basic-menu' : undefined}>
            {item.terminal.length > 15 ?
                <TooltipTypography text={item.terminal} noWrap={true} style={{fontSize: '12px'}} position='top'/> :
                <Typography variant='p' component='p' sx={{fontSize: '12px'}} noWrap>{item.terminal}</Typography>}
            <Box sx={{position: 'relative', minHeight: '96px'}}>
                {(item.terminalTypeId === EXT_BARRIER_TYPE_ID && item.mashValue !== 0) &&
                    <Typography variant='body' component='p' sx={{
                        fontSize: '12px',
                        color: 'white',
                        background: 'red',
                        zIndex: '1000',
                        position: 'absolute',
                        left: '5px',
                        top: '5px',
                        borderRadius: '3px',
                        padding: '3px'
                    }}>Затор: {getHoursAndMinutes()}</Typography>}
                {item.terminalTypeId !== 5 && <img
                    src={getTerminalType(item.terminalTypeId)}
                    loading="lazy"
                    style={imageStyle}
                />
                }
                {item.terminalTypeId !== VIRT_AKT_BASE_TYPE_ID &&
                    <>
                        <img
                            src={item.statusOnline ? online : offline}
                            loading="lazy"
                            style={imageStyle}
                        />
                        <img
                            src={item.statusOn ? is_on : is_off}
                            loading="lazy"
                            style={Object.assign({}, imageStyle, {zIndex: 999})}
                        />
                    </>
                }
                {(item.terminalTypeId === ENTRY_BARRIER_TYPE_ID || item.terminalTypeId === EXT_BARRIER_TYPE_ID || item.terminalTypeId === PASS_BARRIER_TYPE_ID) ?
                    <>
                        {
                            item.statusBarrierFailed ? <img
                                    src={barrier_broken}
                                    loading="lazy"
                                    style={imageStyle}
                                /> :
                                <img
                                    src={item.statusBarrierClose ? barrier_close : barrier_open}
                                    loading="lazy"
                                    style={imageStyle}
                                />
                        }
                        <img
                            src={item.statusBarrierLock ? is_blocked : is_unblocked}
                            loading="lazy"
                            style={imageStyle}
                        />
                        {getBusyLoop() && <img
                            src={getBusyLoop()}
                            loading="lazy"
                            style={imageStyle}
                        />}
                    </> : ''}

            </Box>
        </Box>
    );
};

export default observer(TerminalItem);
