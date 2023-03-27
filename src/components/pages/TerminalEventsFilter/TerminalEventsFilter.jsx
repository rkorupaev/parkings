import React, {useContext, useEffect, useMemo, useState} from 'react';
import Box from "@mui/material/Box";
import TooltipTypography from "../../molecules/TooltipTypography/TooltipTypography";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import FilterForm from "./FilterForm/FilterForm";
import InfoBlock from "./InfoBlock/InfoBlock";
import IconButton from "@mui/material/IconButton";
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentModal from "../../molecules/CommentModal/CommentModal";
import eventsStore from "../../../store/eventsStore";
import {AppContext} from "../../../App";
import Typography from "@mui/material/Typography";
import {dateToISOLikeButLocal, prettifyDate} from "../../utils/utils";
import {useLocation} from "react-router";
import GridNoRowBlock from "../../molecules/GridNoRowBlock/GridNoRowBlock";
import InfoModal from "../../molecules/InfoModal/InfoModal";
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

const TerminalEventsFilter = observer(({containerWidth}) => {

        const [gridStyle, setGridStyle] = useState({
            marginBottom: '12px',
            fontSize: '12px',
        });
        const [rowValue, setRowValue] = useState({});
        const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
        const [isInfomodalOpened, setIsInfomodalOpened] = useState(false);
        const [currentPage, setCurrentPage] = useState(0);
        const [pageSize, setPageSize] = useState(100);
        const {setSnackBarSettings} = useContext(AppContext);
        const {state} = useLocation();


        useEffect(() => {
            eventsStore.setEvents([]);
            if (state?.terminalId) {
                console.log(state.terminalId);
                eventsStore.setQueryParams({
                    name: '',
                    terminalId: state.terminalId,
                });
            }
            eventsStore.getEvents();
            return () => {
                eventsStore.controller.abort();
            }
        }, []);

        const eventsData = useMemo(() => ({
            columns: [
                {
                    field: 'addComment', headerName: '', maxWidth: 30, renderCell: (cellValues) => {
                        return (
                            <IconButton onClick={(e) => setIsOpenCommentModal(true)} size='small'
                                        aria-label='add comment'>
                                <AddCommentIcon color="primary"/>
                            </IconButton>
                        )
                    },
                    sortable: false,
                },
                {
                    field: 'eventTime', headerName: 'Время', minWidth: 200,
                    renderCell: (cellValue) => {
                        return (
                            <Typography variant='p'
                                        component='p'>{prettifyDate(dateToISOLikeButLocal(cellValue.row.eventTime))}</Typography>
                        )
                    },
                },
                {field: 'terminalName', headerName: 'Терминал', minWidth: 150,},
                {
                    field: 'deviceEventTypeCustomDescription', headerName: 'Событие', minWidth: 200,
                },
                {
                    field: 'lparam1', headerName: 'Параметр 1', minWidth: 200,
                },
                {
                    field: 'lparam2', headerName: 'Параметр 2', minWidth: 200,
                },
            ],
            rows: [...toJS(eventsStore.modifiedEvents)]
        }), [eventsStore.modifiedEvents]);

        const onRowClick = (params, event, details) => {
            setRowValue(params.row);
        }

        const saveComment = (value) => {
            return eventsStore.saveComment(rowValue.deviceEventId, value)
                .then((response) => {
                    console.log(response.data);
                    updateEvents(response.data.commentText);
                    setRowValue({...rowValue, commentText: response.data.commentText});
                    setIsOpenCommentModal(false);
                    setSnackBarSettings({
                        opened: true,
                        severity: 'success',
                        label: 'Комментарий успешно сохранен!'
                    })
                }).then((response) => response)
                .catch((error) => {
                    console.error(error)
                    setSnackBarSettings({
                        opened: true,
                        severity: 'error',
                        label: 'Сохранение не удалось!'
                    })
                }).finally(() => {
                    eventsStore.setIsLoading(false);
                });
        }

        const updateEvents = (value) => {
            let copy = Object.assign([], eventsStore.modifiedEvents);
            const eventIndex = eventsStore.modifiedEvents.findIndex(event => event.deviceEventId === rowValue.deviceEventId);
            copy[eventIndex].commentText = value;
            eventsStore.setModifiedEvents(copy);
        }

        const handlePageChangeClick = (param, setting) => {
            eventsStore.setQueryParams({...eventsStore.queryParams, [setting]: param});
            eventsStore.setGridQueryParams({...eventsStore.gridQueryParams, [setting]: param});
            eventsStore.setModifiedEvents([]);
            eventsStore.controller.abort();
            setTimeout(() => {
                eventsStore.getEvents(true);
            });
        }

        console.log(toJS(eventsStore.isLoading), ' is lodaijg');

        const handleSortingClick = (param) => {
            eventsStore.setQueryParams({
                ...eventsStore.queryParams,
                orderDirection: param[0]?.sort || '',
                orderBy: getSortOption(param[0]?.field) || '',
            });
            eventsStore.setGridQueryParams({
                ...eventsStore.gridQueryParams,
                orderDirection: param[0]?.sort || '',
                orderBy: getSortOption(param[0]?.field) || '',
            });
            eventsStore.setModifiedEvents([]);
            eventsStore.controller.abort();
            setTimeout(() => {
                eventsStore.getEvents(true);
            });
        }

        return (
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <Box sx={{display: 'flex', padding: '16px', minHeight: '252px'}}>
                    <FilterForm containerWidth={containerWidth} setCurrentPage={setCurrentPage}/>
                    <InfoBlock rowValue={rowValue} setIsInfomodalOpened={setIsInfomodalOpened}/>
                </Box>
                <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'row', padding: '16px', pt: 0}}>
                    <DataGridPro
                        rowHeight={50}
                        rowCount={eventsStore.eventsCount}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                            handlePageChangeClick(newPage, 'offset');
                            setCurrentPage(newPage);
                        }}
                        onPageSizeChange={(size) => {
                            handlePageChangeClick(size, 'limit');
                            setPageSize(size);
                        }}
                        sortingMode="server"
                        onSortModelChange={(model) => handleSortingClick(model)}
                        rows={toJS(eventsStore.modifiedEvents)}
                        columns={eventsData.columns}
                        density='compact'
                        sx={gridStyle}
                        disableColumnSelector
                        disableColumnMenu
                        loading={eventsStore.isLoading}
                        getRowId={(row) => row.deviceEventId * Math.floor(Math.random() * 99999)}
                        onRowClick={onRowClick}
                        components={{
                            NoRowsOverlay: () => (
                                <GridNoRowBlock/>
                            ),
                            NoResultsOverlay: () => (
                                <GridNoRowBlock/>
                            )
                        }}
                        page={currentPage}
                        pageSize={pageSize}
                    />
                </Box>
                <CommentModal open={isOpenCommentModal} setOpen={setIsOpenCommentModal}
                              confirmButtonLabel='Сохранить' comment={rowValue.commentText}
                              handleSaveButton={saveComment} loading={eventsStore.isLoading}/>
                <InfoModal open={isInfomodalOpened} setOpen={setIsInfomodalOpened}/>
            </Box>
        );
    }
);

export default TerminalEventsFilter;
