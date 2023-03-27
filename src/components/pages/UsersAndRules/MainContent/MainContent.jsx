import React from 'react';
import UserFormTabs from "./UserFromTabs/UserFormTabs";
import RulesForm from "./RulesForm/RulesForm";
import {Box, Typography} from "@mui/material";

const MainContent = ({currentItem, setCurrentItem}) => {
    const renderContent = (type) => {
        switch (type) {
            case 'user':
                return (
                    <>
                        <UserFormTabs currentItem={currentItem} setCurrentItem={setCurrentItem}/>
                    </>
                )
            case 'group':
                return (
                    <>
                        <RulesForm currentItem={currentItem} setCurrentItem={setCurrentItem}/>
                    </>
                )
            default:
                return (
                    <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant='h5' component='h5'>Выберите элемент</Typography>
                    </Box>
                )
        }
    }
    return (
        <>
            {renderContent(currentItem.type)}
        </>
    );
};

export default MainContent;