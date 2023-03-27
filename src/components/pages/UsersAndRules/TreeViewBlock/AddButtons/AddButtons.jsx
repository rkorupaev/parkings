import React, {useContext, useState} from 'react';
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const AddButtons = ({setCurrentItem, setIsNew = null}) => {
    const [isOpened, setIsOpened] = useState(false);

    let opacity;
    isOpened ? opacity = 1 : opacity = 0;
    let zIndex;
    isOpened ? zIndex = 5 : zIndex = -1;

    const buttonHandlerClick = (type) => {
        setIsOpened(false);
        setCurrentItem({id: `new_${type}`, type});
    }

    const addItemButtonClick = () => {
        setIsOpened(!isOpened);
    };

    const handleClickAway = () => {
        setIsOpened(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{width: '100%', fontSize: '14px', position: 'relative'}}>
                <Button variant="outlined"
                        startIcon={<AddCircleIcon/>}
                        endIcon={<ArrowDropDownIcon color='action'/>}
                        sx={{width: '100%', marginBottom: '2px', fontSize: '14px'}}
                        size='small'
                        onClick={() => addItemButtonClick()}>Добавить</Button>
                <Stack sx={{
                    border: '1px solid #1976d2',
                    borderBottomLeftRadius: '5px',
                    borderBottomRightRadius: '5px',
                    position: 'absolute',
                    width: '100%',
                    zIndex: zIndex,
                    backgroundColor: 'white',
                    transition: 'all 0.3s',
                    opacity: opacity
                }}>
                    <Button variant="text" startIcon={<PersonIcon/>} sx={{borderBottom: '1px solid'}}
                            onClick={() => buttonHandlerClick('user')}>Пользователя</Button>
                    <Button variant="text" startIcon={<GroupsIcon/>} sx={{borderBottom: '1px solid'}}
                            onClick={() => buttonHandlerClick('group')}>Группу доступа</Button>
                </Stack>
            </Box>
        </ClickAwayListener>
    );
};

export default AddButtons;
