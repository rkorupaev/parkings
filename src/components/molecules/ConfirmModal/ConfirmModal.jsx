import React, {useEffect, useState} from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const ConfirmModal = ({open, setOpen, handleConfirmButton, loading, type}) => {
    const getVariant = (type) => {
        const variants = {
            'reset': {
                text: 'Сбросить все настройки?',
                buttonLabel: 'Сбросить',
                loadingText: 'Сбрасываю...'
            },
            'deleteUser': {
                text: 'Удалить выбранного пользователя',
                buttonLabel: 'Удалить',
                loadingText: 'Удаляю...'
            },
            'deleteRole': {
                text: 'Удалить выбранную группу',
                buttonLabel: 'Удалить',
                loadingText: 'Удаляю...'
            },
            'deleteCompanyReservePlace': {
                text: 'Удалить выбранный счетчик',
                buttonLabel: 'Удалить',
                loadingText: 'Удаляю...'
            },
        }

        return variants[type];
    }

    const [variant, setVariant] = useState(getVariant(type));

    const handleClose = () => {
        setOpen(false);
    }

    const confirmDelete = () => {
        handleConfirmButton();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2"
                            sx={{marginBottom: '12px', textAlign: 'center'}}>
                    {variant.text}
                </Typography>

                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                    <Button variant='outlined' onClick={handleClose} sx={{width: '150px'}} disabled={loading}
                    >Отменить</Button>
                    <LoadingButton variant='contained' onClick={() => confirmDelete()} color='error'
                                   sx={{width: '150px'}} loading={loading}
                                   loadingIndicator={variant.loadingText}>{variant.buttonLabel}</LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmModal;
