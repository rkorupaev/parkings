import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const LabelAndInput = ({label, value, onChange, onFocus = () => {}, disabled, type = 'text', inputIcon = {},
                           error, inputProps, required, helperText, autoFocus, labelWidth = '150px', labelMinWidth = '117px', style = {}}) => {
    return (
        <Box sx={Object.assign({} , {display: 'flex', alignItems: 'center', justifyContent: 'space-between'}, style)}>
            <Typography variant="p" component="p" sx={{width: labelWidth, minWidth: labelMinWidth}}>
                {label} :
            </Typography>
            <TextField variant="outlined" size="small" value={value} onChange={onChange}
                       sx={{
                           flexGrow: 1, '& .MuiFormHelperText-root': {
                               position: 'absolute',
                               top: '7px',
                               right: '0',
                               pointerEvents: 'none'
                           },
                       }} disabled={disabled} type={type}
                       InputProps={inputIcon} error={error} inputProps={inputProps} required={required}
                       helperText={helperText} autoFocus={autoFocus} onFocus={onFocus}/>
        </Box>
    );
};

export default LabelAndInput;
