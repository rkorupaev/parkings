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

const GrzConfirmModal = ({open, setOpen, handleConfirmButton, cellValue, loading}) => {
    const handleClose = () => {
        setOpen(false);
        setCellvalue(null);
    }

    const [cellvalue, setCellvalue] = useState(null);

    useEffect(() => {
        setCellvalue(cellValue);
    }, [cellValue]);

    const confirmDelete = (cellValue) => {
        if (cellValue) {
            handleConfirmButton(cellValue);
        } else {
            handleConfirmButton();
        }
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
                    Вы уверены, что хотите удалить выбранный элемент?
                </Typography>
                {cellvalue ? <Typography id="modal-modal-title" variant="h6" component="h2"
                                         sx={{marginBottom: '12px', textAlign: 'center'}}>
                    Номер "{cellvalue.row.grz}" прикреплен к карте!
                </Typography> : ''}
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                    <Button variant='outlined' onClick={handleClose} sx={{width: '150px'}}
                    >Отменить</Button>
                    <LoadingButton variant='contained' onClick={() => confirmDelete(cellvalue)} color='error'
                            sx={{width: '150px'}} loading={loading} loadingIndicator='Удаляю...'>Удалить</LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default GrzConfirmModal;
