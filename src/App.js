import './App.scss';
import React, {createContext, useEffect, useState} from "react";
import AuthPage from "./components/pages/AuthPage/AuthPage";
import Box from "@mui/material/Box";
import CustomizedSnackbars from "./components/molecules/CustomizedSnackbars/CustomizedSnackbars";
import Layout from "./components/pages/Layout/Layout";
import {BrowserRouter as Router} from "react-router-dom";
import userStore from "./store/userStore";
import {observer} from "mobx-react-lite";
import jwt_decode from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import {SnackbarProvider} from "notistack";
import { LicenseInfo } from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(
    '70dbc723a7dbe040e93caec1a931b694Tz02MjQ4NCxFPTE3MTEwMjQ4MTE3MDcsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
);

export const AppContext = createContext();

const App = observer(() => {
    const [isAuth, setIsAuth] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [snackBarSettings, setSnackBarSettings] = useState({
        label: 'Сохранение успешно',
        severity: 'success',
        opened: false
    });

    useEffect(() => {
        checkTokenIsValid();
    }, []);

    const checkTokenIsValid = () => {
        if (localStorage.getItem('token')) {
            const expTime = new Date(jwt_decode(localStorage.getItem('token')).exp) * 1000;
            if (expTime > Date.now()) {
                userStore.setIsAuth(true);
            }
        }
        setIsChecked(true);
    }

    if (!isChecked) {
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
                <CircularProgress size={80}/>
            </Box>
        )
    }

    if (!userStore.isAuth) {
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
                <AuthPage setAccessToken={setAccessToken} setIsAuth={setIsAuth}
                          setSnackBarSettings={setSnackBarSettings}/>
                <CustomizedSnackbars snackBarSettings={snackBarSettings} callback={setSnackBarSettings}
                                     label={snackBarSettings.label}
                                     severity={snackBarSettings.severity}
                />
            </Box>
        )
    }

    return (
        <AppContext.Provider value={{accessToken, setSnackBarSettings, isAuth}}>
            <Router>
                <Box sx={{minHeight: '100vh', width: '100vw'}}>
                    <SnackbarProvider maxSnack={3} preventDuplicate anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }} disableWindowBlurListener autoHideDuration={3000}>
                        <Layout></Layout>
                    </SnackbarProvider>

                    <CustomizedSnackbars snackBarSettings={snackBarSettings} callback={setSnackBarSettings}
                                         label={snackBarSettings.label}
                                         severity={snackBarSettings.severity}
                    />
                </Box>
            </Router>
        </AppContext.Provider>
    );
})

export default App;
