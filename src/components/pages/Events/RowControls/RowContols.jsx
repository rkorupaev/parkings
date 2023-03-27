import React, {useState} from 'react';
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TerminalIcon from '@mui/icons-material/Terminal';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {useNavigate} from "react-router";
import eventsStore from "../../../../store/eventsStore";

const RowContols = ({setIsOpenCommentModal, setIsOpenSettingsModal, anchorEl, open, handleClose, rowValue}) => {
        const navigate = useNavigate();

        const navigateToTerminalEvents = () => {
            navigate('/terminal_events', {state: {terminalId: rowValue.terminalId}});
            eventsStore.setModifiedEvents([]);
        }

        const navigateToCardEvents = () => {
            navigate('/card_events', {state: {cardId: rowValue.lparam1}});
            eventsStore.setModifiedEvents([]);
        }

        return (
            <Box>
                <Menu id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                          'aria-labelledby': 'basic-button',
                      }}>
                    <MenuItem onClick={navigateToTerminalEvents}>
                        <ListItemIcon>
                            <TerminalIcon fontSize="small" color='primary'/>
                        </ListItemIcon>
                        <ListItemText>События по терминалу</ListItemText>
                    </MenuItem>
                    {rowValue.uuid && <MenuItem onClick={navigateToCardEvents}>
                        <ListItemIcon>
                            <CreditCardIcon fontSize="small" color='primary'/>
                        </ListItemIcon>
                        <ListItemText>События по карте</ListItemText>
                    </MenuItem>}
                    <MenuItem onClick={() => setIsOpenCommentModal(true)}>
                        <ListItemIcon>
                            <AddCommentIcon fontSize="small" color='primary'/>
                        </ListItemIcon>
                        <ListItemText>Добавить комментарий</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => setIsOpenSettingsModal(true)}>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" color='primary'/>
                        </ListItemIcon>
                        <ListItemText>Настройка события</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        );
    }
;

export default RowContols;
