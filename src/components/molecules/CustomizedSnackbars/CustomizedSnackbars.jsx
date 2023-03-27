import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {forwardRef} from "react";

const Alert = forwardRef(function Alert( props, ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbars = ({snackBarSettings, callback}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        callback({
            ...snackBarSettings,
            opened: false
        });
    };

    return (
        <Snackbar open={snackBarSettings.opened} autoHideDuration={3000} onClose={handleClose} anchorOrigin={snackBarSettings.anchorOrigin}>
            <Alert onClose={handleClose} severity={snackBarSettings.severity} sx={{ width: '100%' }} size={snackBarSettings.size}>
                {snackBarSettings.label}
            </Alert>
        </Snackbar>
    );
};

export default CustomizedSnackbars;
