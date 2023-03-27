import React from 'react';
import {Menu, MenuItem, SidebarContent, SubMenu} from "react-pro-sidebar";
import {NavLink} from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

const NewNestedList = ({items}) => {
    return (
        <Menu>
            {items.map(({key, label, icon: Icon, items, color, route}) => {

                return (
                    <SubMenu key={key} title={label} icon={<Icon color={color}/>}>
                        {items.map(({key: childKey, label: childLabel, icon: ChildIcon, route, color}) => {
                            return (
                                <MenuItem key={childKey}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        {ChildIcon ?
                                        <ListItemIcon sx={{minWidth: '40px'}}>
                                            <ChildIcon color={color}/>
                                        </ListItemIcon> : ''}
                                        <ListItemText primary={childLabel}/>
                                        <NavLink to={route}/>
                                    </Box>
                                </MenuItem>
                            )
                        })}
                    </SubMenu>
                )
            })
            }
        </Menu>
    );
};

export default NewNestedList;
