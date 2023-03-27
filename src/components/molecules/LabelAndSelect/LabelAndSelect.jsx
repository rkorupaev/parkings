import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {v4 as uuidv4} from 'uuid';

//Хочу получить массив items вида
// {
//     name: string,
//     number: number,
//     value: string (опицонально)
// }

const LabelAndSelect = ({label, items, currentItem, disabled, onChange, tabWidth, labelWidth = '150px'}) => {
    const [selectedItem, setSelectedItem] = useState(currentItem);
    const selectStyle = {
        flexGrow: 1,
        maxWidth: tabWidth+'px' || 'auto',
    }

    useEffect(() => {
        setSelectedItem(currentItem);
    }, [currentItem])

    const handleChange = (event) => {
        setSelectedItem(event.target.value);
    };

    useEffect(() => {
        onChange('', selectedItem);
    }, [selectedItem])

    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Typography id="modal-modal-title" variant="p" component="p" sx={{width: labelWidth, minWidth: labelWidth}}>
                {label} :
            </Typography>
            <TextField
                id="outlined-select-currency"
                select
                size="small"
                value={selectedItem}
                onChange={handleChange}
                sx={Object.assign({}, selectStyle)}
                disabled={disabled}
                SelectProps={{autoWidth: false}}
            >
                {items.map((option) => (
                    <MenuItem key={uuidv4()} value={option.value ? option.value : option.number} id={option.number}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>
        </Box>

    );
};

export default LabelAndSelect;
