import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const LabelAndInputUncontrolled = ({label, onChange, disabled, type = 'text', inputIcon = {}, error, inputProps, required, helperText, autoFocus, ref}) => {

    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography variant="p" component="p" sx={{width: '150px', minWidth: '117px'}}>
                {label} :
            </Typography>
            <TextField variant="outlined" size="small" sx={{
                flexGrow: 1, '& .MuiFormHelperText-root': {
                    position: 'absolute',
                    top: '7px',
                    left: '0',
                    pointerEvents: 'none'
                },
            }} disabled={disabled} type={type}
                       InputProps={inputIcon} error={error} inputProps={inputProps} required={required}
                       helperText={helperText} autoFocus={autoFocus} inputRef={ref}/>
        </Box>
    );
};

export default LabelAndInputUncontrolled;
