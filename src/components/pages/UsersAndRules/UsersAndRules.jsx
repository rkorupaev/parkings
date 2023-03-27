import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import usersStore from "../../../store/usersStore";
import {observer} from "mobx-react-lite";
import TreeViewBlock from "./TreeViewBlock/TreeViewBlock";
import MainContent from "./MainContent/MainContent";

const UsersAndRules = () => {
    const [currentItem, setCurrentItem] = useState(null);
    const [expanded, setExpanded] = useState(['root']);

    useEffect(() => {
        usersStore.getUsers();
        usersStore.getRoleGroups();
    }, []);

    console.log(currentItem, 'current item')

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: '16px'}}>
            <Typography variant='h5' component='p'>Права и пользователи</Typography>
            <Box sx={{display: 'flex', flexGrow: 1}}>
                <TreeViewBlock setCurrentItem={setCurrentItem} expanded={expanded} setExpanded={setExpanded}/>
                {currentItem ? <MainContent currentItem={currentItem} setCurrentItem={setCurrentItem}/> :
                    <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant='h5' component='h5'>Выберите элемент</Typography>
                    </Box>}
            </Box>

        </Box>
    );
};

export default observer(UsersAndRules);
