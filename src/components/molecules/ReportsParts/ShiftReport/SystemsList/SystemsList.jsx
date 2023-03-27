import React, {useEffect, useState} from 'react';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import {toJS} from "mobx";
import systemsStore from "../../../../../store/systemsStore";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import {observer} from "mobx-react-lite";

const SystemsList = ({setCurrentSystem, resetCallback = () => {}}) => {

    const [selectedSystem, setSelectedSystem] = useState(-1);

    const onListItemClickHandler = (id) => {
        setCurrentSystem(id);
        setSelectedSystem(parseInt(id));
        resetCallback();
    }

    return (
        <List dense sx={{border: '1px solid lightgray', height: '100%', overflowY: 'auto', borderRadius: '4px'}}>
            {systemsStore.isLoading ? <CircularProgress/> : ''}
            {!(toJS(systemsStore.systems).length) && !systemsStore.isLoading ? (
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary='Систем не найдено'/>
                    </ListItemButton>
                </ListItem>) : ''}
            {toJS(systemsStore.systems).map(system => (
                <ListItemButton key={system.systemId}
                                onClick={(e) => onListItemClickHandler(e.target.offsetParent.id)}
                                id={system.systemId}
                                selected={selectedSystem === system.systemId}
                                sx={{
                                    padding: 0,
                                    '& .MuiListItemText-root': {
                                        margin: 0,
                                        padding: '0 16px',
                                        '& .MuiTypography-root': {
                                            padding: '4px 0',
                                        }
                                    }
                                }}>
                    <ListItemText primary={`${system.systemNumber}: ${system.systemName}`}/>
                </ListItemButton>
            ))}
        </List>
    );
};

export default observer(SystemsList);
