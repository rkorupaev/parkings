import React from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const RootPage = () => {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
            <Typography variant='h2' component='h2'>
                Выберите модуль
            </Typography>
        </Box>
    );
};

export default RootPage;
