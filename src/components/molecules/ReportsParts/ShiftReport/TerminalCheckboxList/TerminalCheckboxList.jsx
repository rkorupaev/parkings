import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";

const CheckboxList = ({terminalsItems, setSelectedTerminals, selectedTerminals = []}) => {
    const [checked, setChecked] = useState(selectedTerminals);

    useEffect(() => {
        setChecked(selectedTerminals);
    }, [selectedTerminals.length]);

    const handleToggle = (value) => {
        const currentIndex = processChecked(value, true);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedTerminals(newChecked);
    };

    const processChecked = (value, handler) => {
        let result = handler ? -1 : false;
        checked.forEach((item,index) => {
            if (JSON.stringify(item) === JSON.stringify(value)) result = handler? index: true;
        });
        return result;
    }

    return (
        <List dense sx={{border: '1px solid lightgray', height: '100%', overflowY: 'auto', borderRadius: '4px'}}>
            {terminalsItems.map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                    <ListItem
                        key={value.terminalId}
                        disablePadding
                        divider
                    >
                        <ListItemButton role={undefined} onClick={() => handleToggle(value)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={processChecked(value)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{'aria-labelledby': labelId}}
                                />
                            </ListItemIcon>
                            <ListItemText id={value.terminalId} primary={value.terminal}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default observer(CheckboxList);
