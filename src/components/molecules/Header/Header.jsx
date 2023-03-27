import {React, useContext, useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import UserSettings from "./UserSettings/UserSettings";
import ChangeUserPasswordModal from "../ChangeUserPasswordModal/ChangeUserPasswordModal";
import usersStore from "../../../store/usersStore";
import userStore from "../../../store/userStore";
import {toJS} from "mobx";
import {observer} from "mobx-react-lite";
import {AppContext} from "../../../App";

const Header = () => {
    const {setSnackBarSettings} = useContext(AppContext);

    const logOut = () => {
        userStore.setIsAuth(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    const findUserInfo = (login) => {
        let result = {};
        result = toJS(usersStore.users).find(user => user.login === login);
        return result;
    }

    const [user, setUser] = useState(localStorage.getItem('user'));
    const [userInfo, setUserInfo] = useState(findUserInfo(user));
    const [changeUserPasswordModalOpened, setChangeUserPasswordModalOpened] = useState(false);

    useEffect(() => {
        setUserInfo(findUserInfo(user));
    }, [usersStore.users]);

    console.log(userInfo, 'user info');

    const showSnackbar = (label, severity) => {
        setSnackBarSettings({
            severity: severity,
            opened: true,
            label: label
        });
    }

    const savePasword = (oldPassword, newPassword, closeCallback) => {
        userStore.changeUserPassword(userInfo.userId, {
            oldPassword: oldPassword,
            newPassword: newPassword
        }).then(response => {
            if (String(response.status)[0] == 4) {
                showSnackbar('Ошибка изменения пароля.', 'error');
            } else if (String(response.status)[0] == 2) {
                showSnackbar('Пароль успешно изменен.', 'success');
                closeCallback();
            }
        })
    }

    return (
        <AppBar position="static">
            <Container maxWidth={false}>
                <Toolbar disableGutters variant='dense' sx={{justifyContent: 'space-between'}}>
                    <Typography variant='h4' component='p'>[parkit]</Typography>
                    <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center'}}>
                        <Typography component='p' sx={{marginRight: '8px'}}>Пользователь: {user}</Typography>
                        <UserSettings setChangeUserPasswordModalOpened={setChangeUserPasswordModalOpened}/>
                        <Button variant='outlined' color='inherit' startIcon={<LogoutIcon/>} size='small'
                                onClick={logOut}>Logout</Button>
                    </Box>
                </Toolbar>
            </Container>
            <ChangeUserPasswordModal open={changeUserPasswordModalOpened} setOpen={setChangeUserPasswordModalOpened}
                                     handleSaveButton={savePasword}/>
        </AppBar>
    );
};

export default observer(Header);
