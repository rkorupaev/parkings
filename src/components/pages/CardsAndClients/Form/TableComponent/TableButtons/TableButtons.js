import React from 'react';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const TableButtons = ({onAddButtonClick, label}) => {
    return (
        <ButtonGroup variant="contained" aria-label="outlined button group" sx={{alignSelf: 'flex-end'}}>
            <Button startIcon={<AddCircleIcon/>}
                    onClick={() => onAddButtonClick()} sx={{fontSize: '10px'}}>Добавить {label}</Button>
        </ButtonGroup>
    );
};

export default TableButtons;
