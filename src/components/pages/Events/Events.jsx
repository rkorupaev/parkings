import React, {useContext, useEffect, useMemo, useState} from 'react';
import RowContols from "./RowControls/RowContols";
import {AppContext} from "../../../App";
import CommentModal from "../../molecules/CommentModal/CommentModal";
import TooltipTypography from "../../molecules/TooltipTypography/TooltipTypography";
import SettingsModal from "./SettingsModal/SettingsModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {dateToISOLikeButLocal, prettifyDate} from "../../utils/utils";
import eventsStore from "../../../store/eventsStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import {DataGridPro} from "@mui/x-data-grid-pro";

const getSortOption = (field) => {
    const sortOptions = {
        'eventTime': '_deviceEventObject.eventTime',
        'terminalName': '_terminalObject.terminal',
        'deviceEventTypeCustomDescription': '_deviceEventTemplateObject.eventText',
        'lparam1': 'lparam1',
        'lparam2': 'lparam2',
    }
    return sortOptions[field];
}

const Events = ({containerWidth, setInitEvents}) => {
    const [events, setEvents] = useState([]);
    const [modifiedEvents, setModifiedEvents] = useState([]);
    const [settingsTemplates, setSettingsTemplate] = useState([]);
    const [rowValue, setRowValue] = useState({});
    const [comment, setComment] = useState('');
    const [currentEvent, setCurrentEvent] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
    const [isOpenSettingsModal, setIsOpenSettingsModal] = useState(false);
    const [gridStyle, setGridStyle] = useState({
        marginBottom: '12px',
        fontSize: '12px',
        pl: '12px'
    });
    const {accessToken, setSnackBarSettings} = useContext(AppContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const openControlMenu = (event, cellValue) => {
        setAnchorEl(event.currentTarget);
        setRowValue({...cellValue.row});
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const makeModifiedEvents = () => {
        eventsStore.getEvents();
        makeCustomizedSettingsArray();
        applySettings();
    }

    useEffect(() => {
        eventsStore.setDefaultQueryParams();
        eventsStore.setEvents([]);
        eventsStore.getEvents();
        setInitEvents(() => makeModifiedEvents)
        return () => eventsStore.controller.abort();
    }, []);

    useEffect(() => {
        setComment(rowValue?.commentText || '');
        setCurrentEvent(rowValue);
    }, [rowValue]);

    useEffect(() => {
        console.log(makeCustomizedSettingsArray(), 'customized')
        if (eventsStore.eventTemplates.length && eventsStore.events.length) {
            eventsStore.setModifiedEvents([...applySettings()]);
            getRowColor();
        }
    }, [eventsStore.eventTemplates, eventsStore.events]);

    const makeCustomezedColorSettings = (settings) => {
        return settings.filter(item => item.eventColor !== '#FFFFFF')
    }

    const makeCustomizedSettingsArray = () => {
        let customizedSeetings = [];
        let isCustomized = false;
        toJS(eventsStore.eventTemplates).forEach(template => {
            if (template.deviceEventTypeCustomDescription !== template.deviceEventTypeDescription) isCustomized = true;
            if (template.eventColor !== '#FFFFFF') isCustomized = true;
            if (template.eventSound !== '') isCustomized = true;
            if (!template.isVisible) isCustomized = true;

            if (isCustomized) {
                customizedSeetings.push(template)
                isCustomized = false;
            }
        })
        return customizedSeetings;
    }

    const applySettings = () => {
        const settingList = makeCustomizedSettingsArray();
        const visibleSetting = settingList.filter(setting => !setting.isVisible);
        let copy = structuredClone(toJS(eventsStore.events));

        visibleSetting.forEach(setting => {
            copy = copy.filter(event => event.deviceEventTypeId !== setting.deviceEventTypeId);
        })

        copy.forEach((event, index) => {
            settingList.forEach(setting => {
                if (event.deviceEventTypeId === setting.deviceEventTypeId) {
                    copy[index] = {
                        ...event,
                        deviceEventTypeCustomDescription: setting.deviceEventTypeCustomDescription,
                    }
                }
            });
        });

        return copy;
    }


    const eventsData = useMemo(() => ({
        columns: [
            {
                field: 'funcButton', headerName: '', width: 50,
                renderCell: (cellValue) => {
                    return (
                        <IconButton onClick={(e) => openControlMenu(e, cellValue)} size='small'
                                    aria-label='open'>
                            <MoreVertIcon color="primary"/>
                        </IconButton>
                    )
                },
                sortable: false,
                menu: false
            },
            {
                field: 'eventTime', headerName: 'Время', minWidth: 150, flex: 1,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p' component='p'>{prettifyDate(dateToISOLikeButLocal(cellValue.row.eventTime))}</Typography>
                    )
                },
            },
            {field: 'terminalName', headerName: 'Терминал', minWidth: 150, flex: 1},
            {
                field: 'deviceEventTypeCustomDescription', headerName: 'Событие', minWidth: 150, flex: 1,
            },
            {
                field: 'lparam1', headerName: 'Параметр 1', minWidth: 150, flex: 1,
            },
            {
                field: 'commentText', headerName: 'Комментарий', minWidth: 500,
                sortable: false,
            },
        ],
        rows: toJS(eventsStore.modifiedEvents),
    }), [toJS(eventsStore.modifiedEvents)]);

    const saveComment = (value) => {
        setIsLoading(true);
        eventsStore.saveComment(rowValue.deviceEventId, value)
            .then((response) => {
                console.log(response.data);
                updateEvents(response.data.commentText);
                setRowValue({});
                setComment('');
                setIsOpenCommentModal(false);
                handleClose();
                setSnackBarSettings({
                    opened: true,
                    severity: 'success',
                    label: 'Комментарий успешно сохранен!'
                });
            })
            .catch((error) => {
                console.error(error)
                setSnackBarSettings({
                    opened: true,
                    severity: 'error',
                    label: 'Сохранение не удалось!'
                })
            }).finally(() => {
            setIsLoading(false);
            eventsStore.setIsLoading(false);
        });
    }

    const updateEvents = (value) => {
        let copy = structuredClone(toJS(eventsStore.modifiedEvents));
        const eventIndex = copy.findIndex(event => event.deviceEventId === rowValue.deviceEventId);
        copy[eventIndex].commentText = value;
        eventsStore.setModifiedEvents(copy);
        eventsStore.setEvents(copy);
    }

    const getRowColor = () => {
        let style = {
            marginBottom: '12px',
            fontSize: '12px',
            pl: '12px'
        };
        eventsStore.events.forEach(event => {
            makeCustomezedColorSettings(toJS(eventsStore.eventTemplates)).forEach(template => {
                if (template.deviceEventTypeId === event.deviceEventTypeId) {
                    style[`& .custom_row_class_${event.deviceEventTypeId}`] = {
                        bgcolor: template.eventColor,
                        // '&:hover': {bgcolor: `${darken(template.eventColor, 0.2)}`},
                        // '& Mui-selected': {bgcolor: `${darken(template.eventColor, 0.2)}`}
                    }
                }
            })
        })
        setGridStyle({...style});
    }

    const handlePageChangeClick = (param, setting) => {
        eventsStore.setQueryParams({...eventsStore.queryParams, [setting]: param});
        eventsStore.setModifiedEvents([]);
        eventsStore.controller.abort();
        setTimeout(() => {
            eventsStore.getEvents();
        });
    }

    const handleSortingClick = (param) => {
        eventsStore.setQueryParams({
            ...eventsStore.queryParams,
            orderDirection: param[0]?.sort || '',
            orderBy: getSortOption(param[0]?.field) || '',
        });
        eventsStore.setModifiedEvents([]);
        eventsStore.controller.abort();
        setTimeout(() => {
            eventsStore.getEvents();
        });
    }

    return (
        <>
            <DataGridPro
                rowHeight={50}
                rowCount={eventsStore.eventsCount}
                paginationMode="server"
                onPageChange={(newPage) => handlePageChangeClick(newPage, 'offset')}
                onPageSizeChange={(size) => handlePageChangeClick(size, 'limit')}
                sortingMode="server"
                onSortModelChange={(model) => handleSortingClick(model)}
                loading={eventsStore.isLoading}
                rows={eventsData.rows}
                columns={eventsData.columns}
                density='compact'
                sx={gridStyle}
                disableColumnSelector
                disableColumnMenu
                getRowId={(row) => row.deviceEventId * Math.floor(Math.random() * 99999)}
                getRowClassName={(params) => {
                    return `custom_row_class_${params.row.deviceEventTypeId}`
                }}
            />
            <CommentModal comment={comment} open={isOpenCommentModal} setOpen={setIsOpenCommentModal}
                          handleSaveButton={saveComment} loading={isLoading} disable={true}
                          confirmButtonLabel="Сохранить комментарий" handleClose={handleClose}/>
            <SettingsModal currentEvent={currentEvent} open={isOpenSettingsModal} setOpen={setIsOpenSettingsModal}
                           settingsTemplates={settingsTemplates}
                           setEvents={setEvents} setSettingsTemplate={setSettingsTemplate} handleClose={handleClose}/>
            <RowContols setIsOpenCommentModal={setIsOpenCommentModal} setIsOpenSettingsModal={setIsOpenSettingsModal}
                        anchorEl={anchorEl} open={open} handleClose={handleClose} rowValue={rowValue}/>
        </>
    );
};

export default observer(Events);
