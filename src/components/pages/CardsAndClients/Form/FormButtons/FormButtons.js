import React, {useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from "@mui/lab/LoadingButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

const FormButtons = ({
                         isChanged,
                         onSaveButtonClick,
                         onCancelButtonClick,
                         onDeleteButtonClick,
                         label,
                         isError,
                         loading,
                         isNew,
                         formData,
                     }) => {
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setShowError(false);
        for (let prop in isError) {
            if (isError[prop] === true) {
                setShowError(true);
            }
        }
    }, [isError]);

    const setTooltipText = (type) => {
        const text = {
            company: 'Удалите всех клиентов у компании',
            client: 'Удалите все карты у клиента',
        }
        return text[type];
    }

    return (
        <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
            <LoadingButton variant="outlined" disabled={showError || !isChanged}
                           startIcon={<CheckCircleIcon color='success'/>}
                           onClick={() => onSaveButtonClick()} sx={{fontSize: '10px'}} loading={loading}
                           loadingPosition="start">Сохранить</LoadingButton>
            <LoadingButton variant="outlined" disabled={!isChanged} startIcon={<CancelIcon color='error'/>}
                           onClick={() => onCancelButtonClick()} sx={{fontSize: '10px', ml: '8px'}} loading={loading}
                           loadingPosition="start">Отмена</LoadingButton>
            {!isNew &&
                <Tooltip
                    title={(!!formData?.clients?.length || !!formData?.cards?.length) ? setTooltipText(formData.type) : ''}>
                    <span>
                        <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={() => onDeleteButtonClick(true)}
                                sx={{fontSize: '10px', ml: '8px'}}
                                disabled={(!!formData?.clients?.length || !!formData?.cards?.length)}>Удалить</Button>
                    </span>
                </Tooltip>}

        </Box>
    );
};

export default FormButtons;
