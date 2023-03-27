import React from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

const SubList = ({keyProp, items, activeSubmenu, submenuStyles}) => {
    const checkIsActive = () => {
        if (keyProp.includes(activeSubmenu)) {
            return {...submenuStyles, display: 'block'};
        } else {
            return {...submenuStyles, display: 'none'};
        }
    }

    return (
        <List sx={checkIsActive()}>
            {items.map(item => {
                return <ListItem key={item.key}>
                    <Typography>{item.label}</Typography>
                </ListItem>
            })}
        </List>
    );
};

export default SubList;
