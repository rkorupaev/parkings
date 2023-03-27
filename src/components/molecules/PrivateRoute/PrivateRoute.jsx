import React, {useContext, useEffect} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {AppContext} from "../../../App";

const PrivateRoute = () => {
    const useAuth = () => {
        const {auth} = useContext(AppContext);
        return  true;
    }
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to="/auth"/>;
}

export default PrivateRoute;
