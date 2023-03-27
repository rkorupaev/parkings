import React, {useEffect, useRef, useState} from 'react';
import styles from './AuthPage.module.scss';
import LabelAndInput from "../../molecules/LabelAndInput/LabelAndInput";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import ParkLogo from "../../../assets/images/park-sign.png";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import {AccountCircle} from "@mui/icons-material";
import PasswordIcon from '@mui/icons-material/Password';
import userStore from "../../../store/userStore";
import AuthService from "../../../services/AuthService";

const AuthPage = ({setAccessToken, setSnackBarSettings, setIsAuth}) => {
    const [data, setData] = useState({
        user: '',
        password: ''
    });

    const userData = useRef();
    userData.current = data;

    useEffect(() => {
        const onKeyDown = e => {
            if (e.keyCode === 13 && userData.current.user.length !== 0 && userData.current.password.length !== 0) {
                onLogInButtonClick();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const onLogInButtonClick = () => {
        AuthService.login(userData.current.user, userData.current.password)
            .then((response) => {
                console.log(response.data);
                if (!response.data?.error) {
                    userStore.setUser(userData.current.user);
                    userStore.setPassword(userData.current.password);
                    setData({
                        user: '',
                        password: ''
                    });
                    setAccessToken(response.data.accessToken);
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('user', response.data.login);
                    setIsAuth(true);
                    userStore.setIsAuth(true);
                } else {
                    setSnackBarSettings({
                        label: 'Неверный логин или пароль! ' + response.data.error,
                        severity: 'error',
                        opened: true
                    });
                }
            })
    }

    const onClearButtonCLick = () => {
        setData({
            user: '',
            password: ''
        });
    }

    return (
        <>
            <form className={styles.auth__form}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                    <Icon sx={{marginRight: '8px'}}>
                        <img src={ParkLogo} height={25} width={25} alt="logo"/>
                    </Icon>
                    <Typography id="modal-modal-title" variant="h5" component="h5">
                        Авторизация
                    </Typography>
                </Box>
                <Stack spacing={1}>
                    <LabelAndInput label='Пользователь' value={data.user}
                                   onChange={(e) => setData({...data, user: e.target.value})} inputIcon={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle color="primary"/>
                            </InputAdornment>
                        )
                    }}/>
                    <LabelAndInput label='Пароль' value={data.password}
                                   onChange={(e) => setData({...data, password: e.target.value})} type='password'
                                   inputIcon={{
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <PasswordIcon color="primary"/>
                                           </InputAdornment>
                                       )
                                   }}/>
                </Stack>
                <Box className={styles.buttons__container}>
                    <Button variant="outlined" onClick={onClearButtonCLick}>Очистить</Button>
                    <Button variant="contained" onClick={onLogInButtonClick}
                            disabled={data.user.length === 0 || data.password.length === 0}>Вход</Button>
                </Box>
            </form>
        </>
    );
};

export default AuthPage;
