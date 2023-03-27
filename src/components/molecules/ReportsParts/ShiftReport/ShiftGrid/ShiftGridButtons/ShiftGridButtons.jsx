import React from 'react';
import Button from "@mui/material/Button";
import {observer} from "mobx-react-lite";
import reportsStore from "../../../../../../store/reportsStore";

const ShiftGridButtons = ({onShowSideReportsClick}) => {
    return (
        <>
            <Button variant='outlined' sx={{marginRight: '8px'}} size='small'
                    onClick={() => onShowSideReportsClick(true)}
                    disabled={!reportsStore.currentReportRow || !reportsStore.queryParams.parkings.length}
            >Отобразить
                выделеное</Button>
            <Button variant='outlined' size='small' onClick={() => onShowSideReportsClick(false)}
                    disabled={!reportsStore.queryParams.parkings?.length || !reportsStore?.reports.length}
            >Отобразить все</Button>
        </>
    );
};

export default observer(ShiftGridButtons);