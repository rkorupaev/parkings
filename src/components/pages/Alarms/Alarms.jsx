import React, {useContext, useEffect, useMemo, useState} from 'react';
import {AppContext} from "../../../App";
import TooltipTypography from "../../molecules/TooltipTypography/TooltipTypography";
import CommentModal from "../../molecules/CommentModal/CommentModal";
import ProcessButton from "./ProcessButton/ProcessButton";
import {dateToISOLikeButLocal, prettifyDate} from "../../utils/utils";
import Typography from "@mui/material/Typography";
import alarmsStore from "../../../store/alarmsStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import AlarmsService from "../../../services/AlarmsService";
import {DataGridPro} from "@mui/x-data-grid-pro";

const defaultAlarm = {
    alarmEndComment: null,
    alarmId: null,
    alarmTimeEnd: null,
    alarmTimeStart: '',
    deviceEventId: null,
    deviceEventTypeDescription: '',
    deviceEventTypeId: null,
    deviceId: null,
    login: null,
    lparam1: null,
    lparam2: null,
    status: 'NEW',
    terminalId: null,
    terminalName: '',
    userClosedId: null,
};

const getSortOption = (field) => {
    const sortOptions = {
        'alarmTimeStart': '_alarmObject.alarmTimeStart',
        'terminalName': '_terminalObject.terminal',
        'deviceEventTypeCustomDescription': '_deviceEventTemplateObject.eventText',
        'alarmTimeEnd': '_alarmObject.alarmStatusId',
    }
    return sortOptions[field];
}

const Alarms = observer(({containerWidth}) => {
    const [alarms, setAlarms] = useState([]);
    const [currentAlarm, setCurrentAlarm] = useState(defaultAlarm);
    const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [comment, setComment] = useState('');

    const {accessToken, setSnackBarSettings} = useContext(AppContext);

    useEffect(() => {
        alarmsStore.setAlarms([]);
        alarmsStore.setDefaultQueryParams();
        alarmsStore.getAlarms();

        return () => alarmsStore.controller.abort();
    }, []);

    // useEffect(() => {
    //     setComment(currentAlarm.alarmEndComment);
    // }, [currentAlarm]);

    const terminalNameComparator = (a, b) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }

    const alarmsData =useMemo(()=> ({
        columns: [
            {
                field: 'alarmTimeStart', headerName: 'Время', minWidth: 200, flex: 1,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p' component='p'>{prettifyDate(dateToISOLikeButLocal(cellValue.row.alarmTimeStart))}</Typography>
                    )
                },
            },
            {field: 'terminalName', headerName: 'Терминал', minWidth: 200, flex: 1},
            {
                field: 'deviceEventTypeCustomDescription', headerName: 'Событие', minWidth: 200, flex: 2,
                renderCell: (cellValue) => {
                    let text = cellValue.row.deviceEventTypeId + ': ' + cellValue.row.deviceEventTypeCustomDescription;
                    return (
                        <TooltipTypography text={text}/>
                    )
                },
                valueGetter: (cellValue) => cellValue.row.deviceEventTypeCustomDescription,
                sortComparator: terminalNameComparator,
            },
            {
                field: 'alarmTimeEnd', headerName: 'Статус', minWidth: 200, flex: 2,
                renderCell: (cellValue) => {
                    return (
                        <ProcessButton cellValue={cellValue} onCLick={onProcessButtonClick}/>
                    )
                },
                cellClassName: (params) => {
                    return 'comment__cell'
                },
                sortable: false,
            },
        ],
        rows: toJS(alarmsStore.alarms)
    }), [alarmsStore.alarms]);

    const onProcessButtonClick = (cellValue) => {
        setIsOpenCommentModal(true);
        setCurrentAlarm(cellValue.row);
        console.log(cellValue);
    }

    const processAlert = (value) => {
        setIsLoading(true);
        AlarmsService.processAlarm(currentAlarm.alarmId, {comment: value})
            .then((response) => {
                console.log(response.data);
                // updateAlarms(response.data);
                alarmsStore.updateAlarms(response.data);
                setCurrentAlarm(defaultAlarm);

                // setComment('');
                setIsOpenCommentModal(false);
                setSnackBarSettings({
                    opened: true,
                    severity: 'success',
                    label: 'Тревога обработана.'
                })
            })
            .catch((error) => {
                console.error(error)
                setSnackBarSettings({
                    opened: true,
                    severity: 'error',
                    label: 'Обработка тревоги не удалась!'
                })
            }).finally(() => {
            setIsLoading(false);
        });
    }

    const updateAlarms = (value) => {
        let copy = Object.assign([], alarms);
        const alarmIndex = alarms.findIndex(alarm => alarm.alarmId === value.alarmId);
        copy[alarmIndex] = {...value};
        alarmsStore.setAlarms(copy);
    }

    const handlePageChangeClick = (param, setting) => {
        alarmsStore.setQueryParams({...alarmsStore.queryParams, [setting]: param});
        alarmsStore.setAlarms([]);
        alarmsStore.controller.abort();
        setTimeout(() => {
            alarmsStore.getAlarms();
        });
    }

    const handleSortingClick = (param) => {
        alarmsStore.setQueryParams({
            ...alarmsStore.queryParams,
            orderDirection: param[0]?.sort || '',
            orderBy: getSortOption(param[0]?.field) || '',
        });
        alarmsStore.setAlarms([]);
        alarmsStore.controller.abort();
        setTimeout(() => {
            alarmsStore.getAlarms();
        });
    }

    return (
        <>
            <DataGridPro
                rowHeight={50}
                rowCount={alarmsStore.alarmsCount}
                paginationMode="server"
                onPageChange={(newPage) => handlePageChangeClick(newPage, 'offset')}
                onPageSizeChange={(size) => handlePageChangeClick(size, 'limit')}
                sortingMode="server"
                onSortModelChange={(model) => handleSortingClick(model)}
                loading={alarmsStore.isLoading}
                rows={alarmsData.rows}
                columns={alarmsData.columns}
                density='compact'
                sx={{
                    marginBottom: '12px',
                    fontSize: '12px',
                    pl: '12px',
                    '& .comment__cell': {
                        display: 'flex',
                    }
                }}
                disableColumnSelector
                disableColumnMenu
                getRowId={(row) => row.alarmId * Math.floor(Math.random() * 99999)}
            />
            <CommentModal open={isOpenCommentModal} setOpen={setIsOpenCommentModal}
                          handleSaveButton={processAlert} loading={isLoading} confirmButtonLabel="Обработать"/>
        </>
    );
});

export default Alarms;
