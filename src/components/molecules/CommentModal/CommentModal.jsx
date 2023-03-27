import React, {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import LoadingButton from "@mui/lab/LoadingButton";
import {prettifyComment} from "../../utils/utils";

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

const CommentModal = ({open, setOpen, loading, handleSaveButton, comment = '', disable, confirmButtonLabel}) => {
    const [value, setValue] = useState(comment);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (disable) setDisabled(value.length === 0);
    }, []);

    useEffect(() => {
        setValue(prettifyComment(comment));
    }, [comment]);

    const handleCloseModal = () => {
        setOpen(false);
        setValue(prettifyComment(comment));
    }

    const handleChange = (value) => {
        setValue(value);
        if (disable) setDisabled(value.length === 0);
    }

    const handleSave = (value) => {
        handleSaveButton(value);
        setValue('');
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom: '12px'}}>
                    Введите комментарий
                </Typography>
                <LabelAndInput value={value} onChange={(e) => handleChange(e.target.value)}
                               label='Введите комментарий' autoFocus={true} helperText={value.length === 0 ? 'Это поле обязательное' : ''} error={value.length === 0}/>
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                    <Button variant='outlined' onClick={handleCloseModal} color='error' sx={{width: '150px'}}
                    >Отменить</Button>
                    <LoadingButton variant='contained'
                                   onClick={() => handleSave(value)}
                                   color='success'
                                   sx={{width: '150px'}}
                                   disabled={value.length === 0}
                                   loadingIndicator="Сохраняю..."
                                   loading={loading}>{confirmButtonLabel}</LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default CommentModal;
