import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const LabelAndMultilineText = ({label, value, onChange }) => {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography id="modal-modal-title" variant="p" component="p" sx={{width: '150px', minWidth: '117px'}}>
                {label} :
            </Typography>
            <TextField id="outlined-basic" variant="outlined" size="small" value={value} onChange={onChange}
                       sx={{flexGrow: 1}} multiline rows={3}/>
        </Box>
    );
};

export default LabelAndMultilineText;
