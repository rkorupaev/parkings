import React, {useState} from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const Dashboard = ({user}) => {
    return (
        <>
            <Grid container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={1}>
                <Grid item >
                    <Box sx={{width: '400px', minHeight: '200px', backgroundColor: 'antiquewhite'}}>1</Box>
                </Grid>
                <Grid item >
                    <Box sx={{width: '400px', minHeight: '200px', backgroundColor: 'antiquewhite'}}>2</Box>
                </Grid>
                <Grid item >
                    <Box sx={{width: '400px', minHeight: '200px', backgroundColor: 'antiquewhite'}}>3</Box>
                </Grid>
                <Grid item >
                    <Box sx={{width: '400px', minHeight: '200px', backgroundColor: 'grey'}}>4</Box>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
