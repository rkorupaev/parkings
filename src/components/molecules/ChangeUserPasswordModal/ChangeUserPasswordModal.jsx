import React, {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import LoadingButton from "@mui/lab/LoadingButton";
import {prettifyComment} from "../../utils/utils";
import Stack from "@mui/material/Stack";
import userStore from "../../../store/userStore";
import {observer} from "mobx-react-lite";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const ChangeUserPasswordModal = ({
                                     open,
                                     setOpen,
                                     loading,
                                     handleSaveButton,
                                 }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [validatePassword, setValidatePassword] = useState('');
    const [error, setError] = useState(false);
    const [isTouched, setIsTouched] = useState({newPassword: false, oldPassword: false, validatePassword: false});

    useEffect(() => {
        if (newPassword !== validatePassword) {
            setError(true);
        } else {
            setError(false);
        }
    }, [newPassword, validatePassword]);

    const handleCloseModal = () => {
        setOpen(false);
        setNewPassword('');
        setOldPassword('');
        setValidatePassword('');
        setError(false);
        setIsTouched({newPassword: false, oldPassword: false, validatePassword: false});
    }

    const handleSave = () => {
        handleSaveButton(oldPassword, newPassword, handleCloseModal);
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
                    Введите новый пароль
                </Typography>
                <Stack spacing={0.5}>
                    <LabelAndInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                                   label='Старый пароль' autoFocus={true}
                                   helperText={oldPassword.length === 0 ? 'Это поле обязательное' : ''}
                                   error={oldPassword.length === 0}
                                   type={'password'}
                                   onFocus={() => setIsTouched({...isTouched, oldPassword: true})}/>
                    <LabelAndInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                   label='Новый пароль'
                                   helperText={newPassword.length === 0 ? 'Это поле обязательное' : ''}
                                   error={newPassword.length === 0}
                                   type={'password'}
                                   onFocus={() => setIsTouched({...isTouched, newPassword: true})}/>
                    <LabelAndInput value={validatePassword} onChange={(e) => setValidatePassword(e.target.value)}
                                   label='Повторите новый пароль'
                                   helperText={ error ? 'Пароли не совпадают' : ''}
                                   error={error}
                                   type={'password'}
                                   onFocus={() => setIsTouched({...isTouched, validatePassword: true})}/>
                </Stack>
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                    <Button variant='outlined' onClick={handleCloseModal} color='error' sx={{width: '150px'}}
                    >Отменить</Button>
                    <LoadingButton variant='contained'
                                   onClick={() => handleSave()}
                                   color='success'
                                   sx={{width: '250px'}}
                                   disabled={newPassword.length === 0 || oldPassword.length === 0 || error}
                                   loadingIndicator="Сохраняю..."
                                   loading={userStore.isLoading}>Сохранить новый пароль</LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default observer(ChangeUserPasswordModal);
