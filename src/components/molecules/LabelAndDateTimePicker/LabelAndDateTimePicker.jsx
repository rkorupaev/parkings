import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";

const LabelAndDateTimePicker = ({label, value, onChange, onClose, disabled, error, errorText, style}) => {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography id="modal-modal-title" variant="p" component="label" sx={Object.assign({}, {width: '150px', minWidth: '150px'}, style)}>
                {label} :
            </Typography>
            <DateTimePicker
                value={value}
                onChange={onChange}
                onClose={onClose}
                inputFormat="yyyy-MM-dd HH:mm:ss"
                mask="____-__-__ __:__:__"
                disableMaskedInput={false}
                renderInput={(params) => <TextField {...params} size="small" sx={{
                    flexGrow: 1,
                }} error={error} helperText={error ? errorText : ''}/>}
                disabled={disabled}
            />
        </Box>
    );
};

export default LabelAndDateTimePicker;
