import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import TooltipTypography from "../../molecules/TooltipTypography/TooltipTypography";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import cardEventsStore from "../../../store/cardEventsStore";
import CardFilterForm from "./CardFilterForm/CardFilterForm";
import {dateToISOLikeButLocal, prettifyDate} from "../../utils/utils";
import {useLocation} from "react-router";
import GridNoRowBlock from "../../molecules/GridNoRowBlock/GridNoRowBlock";
import Typography from "@mui/material/Typography";
import {DataGridPro} from "@mui/x-data-grid-pro";

const getSortOption = (field) => {
    const sortOptions = {
        'terminalEventTime': 'terminalEventTime',
        'terminalName': 'terminal',
        'cardNumber': 'cardNumber',
        'cardTypeDescription': 'cardTypeDescription',
        'lpr': 'lpr',
        'deviceEventTypeCustomDescription': '_deviceEventTemplateObject.event_text',
        'paidTypeDescription': '_paidTypeObject.paid_type_description',
        'paidValue': 'paidValue',
        'acceptValue': 'acceptValue',
        'dispenseValue': 'dispenseValue',
        'lparam1': 'lparam1',
    }
    return sortOptions[field];
}

const CardsEventsFilter = observer(({containerWidth}) => {
        const [gridStyle, setGridStyle] = useState({
            marginBottom: '12px',
            fontSize: '12px',
        });
        const {state} = useLocation();

        const [currentPage, setCurrentPage] = useState(0);
        const [pageSize, setPageSize] = useState(100);

        useEffect(() => {
            cardEventsStore.setCardEvents([]);
            if (state?.cardId) {
                console.log(state.cardId);
                cardEventsStore.setQueryParams({
                    name: '',
                    cardNumber: state.cardId,
                });
            }
            cardEventsStore.getCardEvents();

            return () => cardEventsStore.controller.abort();
        }, [])

        const handlePageChangeClick = (param, setting) => {
            cardEventsStore.setQueryParams({...cardEventsStore.queryParams, [setting]: param});
            cardEventsStore.setGridQueryParams({...cardEventsStore.gridQueryParams, [setting]: param});
            cardEventsStore.setCardEvents([]);
            cardEventsStore.controller.abort();
            setTimeout(() => {
                cardEventsStore.getCardEvents(true);
            });
        }

        const handleSortingClick = (param) => {
            cardEventsStore.setQueryParams({
                ...cardEventsStore.queryParams,
                orderDirection: param[0]?.sort || '',
                orderBy: getSortOption(param[0]?.field) || '',
            });
            cardEventsStore.setGridQueryParams({
                ...cardEventsStore.gridQueryParams,
                orderDirection: param[0]?.sort || '',
                orderBy: getSortOption(param[0]?.field) || '',
            });
            cardEventsStore.setCardEvents([]);
            cardEventsStore.controller.abort();
            setTimeout(() => {
                cardEventsStore.getCardEvents(true);
            });
        }

        const eventsData = {
            columns: [
                {
                    field: 'terminalEventTime', headerName: 'Время', minWidth: 140,
                    renderCell: (cellValue) => {
                        return (
                            <Typography variant='body'
                                        component='p'>{prettifyDate(dateToISOLikeButLocal(cellValue.row.terminalEventTime)) || ''}</Typography>
                        )
                    }
                },
                {
                    field: 'terminalName', headerName: 'Терминал', minWidth: 150,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={prettifyDate(cellValue.row.terminalName) || ''}/>
                        )
                    },
                },
                {
                    field: 'cardNumber', headerName: 'Номер карты', minWidth: 100,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.cardNumber || ''}/>
                        )
                    },
                },
                {
                    field: 'cardTypeDescription', headerName: 'Тип карты', minWidth: 100,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.cardTypeDescription || ''}/>
                        )
                    },
                },
                {field: 'lpr', headerName: 'ГРЗ', minWidth: 150, },
                {
                    field: 'deviceEventTypeCustomDescription', headerName: 'Событие', minWidth: 100,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.deviceEventTypeCustomDescription || ''}/>
                        )
                    },
                    sortable: false,
                },
                {
                    field: 'paidTypeDescription', headerName: 'Тип оплаты', minWidth: 50,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.paidTypeDescription || ''}/>
                        )
                    },
                    sortable: false,
                },
                {
                    field: 'paidValue', headerName: 'Сумма, руб.', minWidth: 50,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.paidValue / 100 || ''}/>
                        )
                    },
                },
                {
                    field: 'acceptValue', headerName: 'Внесено, руб.', minWidth: 50,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.acceptValue / 100 || ''}/>
                        )
                    },
                },
                {
                    field: 'dispenseValue', headerName: 'Сдача, руб.', minWidth: 50,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.dispenseValue / 100 || ''}/>
                        )
                    },
                },
                {
                    field: 'lparam1', headerName: 'Параметр', minWidth: 100,
                    renderCell: (cellValue) => {
                        return (
                            <TooltipTypography text={cellValue.row.lparam1 || ''}/>
                        )
                    },
                },
            ]
        };

        return (
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <Box sx={{display: 'flex', padding: '16px', minHeight: '252px'}}>
                    <CardFilterForm containerWidth={containerWidth} setCurrentPage={setCurrentPage}/>
                </Box>
                <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'row', padding: '16px', pt: 0}}>
                    <DataGridPro
                        rowHeight={50}
                        rowCount={cardEventsStore.cardsCount}
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
                        rows={toJS(cardEventsStore.cardEvents)}
                        columns={eventsData.columns}
                        density='compact'
                        sx={gridStyle}
                        disableColumnSelector
                        disableColumnMenu
                        getRowId={(row) => row.id * Math.floor(Math.random() * 99999)}
                        loading={cardEventsStore.isLoading}
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
            </Box>
        );
    }
);

export default CardsEventsFilter;
