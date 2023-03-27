import React, { useEffect, useState} from 'react';
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableRowsIcon from '@mui/icons-material/TableRows';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import parkingsStore from "../../../store/parkingsStore";
import {observer} from "mobx-react-lite";
import terminalsStore from "../../../store/terminalsStore";
import GridNoRowBlock from "../../molecules/GridNoRowBlock/GridNoRowBlock";
import reportsStore from "../../../store/reportsStore";
import ReportFilter from "./ReportFilter/ReportFilter";
import LoadingButton from "@mui/lab/LoadingButton";
import {toJS} from "mobx";
import {prettifyDate, roundTwoDecimals} from "../../utils/utils";
import TooltipTypography from "../../molecules/TooltipTypography/TooltipTypography";
import EventReportPart from "../../molecules/ReportsParts/EventReportPart/EventReportPart";
import CapacityReportPart from "../../molecules/ReportsParts/CapacityReportPart/CapacityReportPart";
import PaymentAndMovementSumaryReportPart
    from "../../molecules/ReportsParts/PaymentAndMovementSummaryReportPart/PaymentAndMovementSumaryReportPart";
import PaymentAndMovementDistributionReportPart
    from "../../molecules/ReportsParts/PaymentAndMovementDistributionReportPart/PaymentAndMovementDistributionReportPart";
import PaymentAndMovementReportPart
    from "../../molecules/ReportsParts/PaymentAndMovementReportPart/PaymentAndMovementReportPart";
import ShiftReport from "../../molecules/ReportsParts/ShiftReport/ShiftReport";
import UserActiosReportPart from "../../molecules/ReportsParts/UserActionsReportPart/UserActionsReportPart";
import Tooltip from "@mui/material/Tooltip";
import {DataGridPro} from "@mui/x-data-grid-pro";

const reports = {
    'events': {
        title: 'Отчет по событиям',
        endpoint: 'getEventsReport',
        gridColumns: [
            {
                field: 'eventTime', headerName: 'Дата/Время', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p' component='p'>{prettifyDate(cellValue.row.eventTime)}</Typography>
                    )
                }, sortable: false,
            },
            {
                field: 'parkingName', headerName: 'Парковка №', minWidth: 150, sortable: false,
            },
            {
                field: 'terminalName', headerName: 'Терминал', minWidth: 200, sortable: false,
            },
            {
                field: 'deviceEventTypeDescription', headerName: 'Тип события', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <TooltipTypography text={cellValue.row.deviceEventTypeDescription || ''}/>
                    )
                }, sortable: false,
            },
            {
                field: 'userName', headerName: 'Пользователь', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <TooltipTypography text={cellValue.row.userName || ''}/>
                    )
                }, sortable: false,
            },
        ],
        renderComponent: () => <EventReportPart/>,
    },
    'user_actions': {
        title: 'Журнал действий пользователя',
        endpoint: 'getUserActionsReport',
        gridColumns: [
            {
                field: 'eventTime', headerName: 'Время события', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p' component='p'>{prettifyDate(cellValue.row.eventTime)}</Typography>
                    )
                }, sortable: false,
            },
            {
                field: 'login', headerName: 'Пользователь', minWidth: 150, sortable: false,
            },
            {
                field: 'userEventType', headerName: 'Тип события', minWidth: 200,  sortable: false,
            },
            {
                field: 'objectType', headerName: 'Тип объекта', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <TooltipTypography text={cellValue.row.objectType || ''}/>
                    )
                }, sortable: false,
            },
            {
                field: 'objectName ', headerName: 'Подробности действия', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <TooltipTypography text={cellValue.row.objectName  || ''}/>
                    )
                }, sortable: false,
            },
        ],
        renderComponent: () => <UserActiosReportPart/>,
    },
    'capacity': {
        title: 'Отчет по заполняемости',
        endpoint: 'getCapacityReport',
        gridColumns: [
            {
                field: 'eventTime', headerName: 'Дата/время', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p' component='p'>{prettifyDate(cellValue.row.eventTime)}</Typography>
                    )
                }, sortable: false,
            },
            {
                field: 'parkingName', headerName: 'Парковка №', minWidth: 150, sortable: false,
            },
            {
                field: 'parkingPlaceType', headerName: 'Тип счетчика', minWidth: 200,  sortable: false,
            },
            {
                field: 'counterValue', headerName: 'Значение', minWidth: 200,  sortable: false,
            },
        ],
        renderComponent: () => <CapacityReportPart/>,
    },
    'payment_movement_summary': {
        title: 'Суммарный отчет по оплатам и передвижениям',
        endpoint: 'getPaymentAndMovementSummaryReport',
        gridColumns: [
            {
                field: 'parkingName', headerName: 'Парковка №', minWidth: 150, sortable: false,
            },
            {
                field: 'terminalName', headerName: 'Терминал', minWidth: 200,  sortable: false,
            },
            {
                field: 'entryRezerved', headerName: 'Количество въездов и выездов', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{cellValue.row.entryRezerved + cellValue.row.exitRezerved + cellValue.row.entryNonRezerved + cellValue.row.exitNonRezerved}</Typography>
                    )
                }, sortable: false,
            },
            {
                field: 'entryManual',
                headerName: 'Количество въездов и выездов по ручному открытию',
                minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{cellValue.row.entryManual + cellValue.row.exitManual}</Typography>
                    )
                }, sortable: false,
            },
            {
                field: 'entryLocked', headerName: 'Количество въездов и выездов с блокировкой', minWidth: 200,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{cellValue.row.entryLocked + cellValue.row.exitLocked}</Typography>
                    )
                }, sortable: false,
            },
            {
                field: 'cashPayment', headerName: 'Количество оплат наличными', minWidth: 200, sortable: false,
            },
            {
                field: 'cashPaymentSum',
                headerName: 'Сумма оплат наличными, руб.',
                minWidth: 200,
                sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.cashPaymentSum / 100)}</Typography>
                    )
                },
            },
            {
                field: 'bankCardPayment',
                headerName: 'Количество оплат безначилными',
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'bankCardPaymentSum',
                headerName: 'Сумма оплат безналичными платежами, руб.',
                minWidth: 200,
                 sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.bankCardPaymentSum / 100)}</Typography>
                    )
                },
            },
            {
                field: 'paymentAvg', headerName: 'Средняя сумма чека, руб.', minWidth: 200,  sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.paymentAvg / 100)}</Typography>
                    )
                },
            },
            {
                field: 'lostPayment',
                headerName: 'Количество оплат утерянных билетов',
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'lostPaymentSum',
                headerName: 'Сумма оплат утерянных билетов, руб.',
                minWidth: 200,
                sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.lostPaymentSum / 100)}</Typography>
                    )
                },
            },
        ],
        renderComponent: () => <PaymentAndMovementSumaryReportPart/>,
    },
    'payment_movement_distribution': {
        title: 'Отчет по распределениям оплат и передвижений',
        endpoint: 'getPaymentAndMovementDistributionReport',
        gridColumns: [
            {
                field: 'entry', headerName: 'Количество въездов', minWidth: 200,  sortable: false,
            },
            {
                field: 'exit', headerName: 'Количество выездов', minWidth: 200, sortable: false,
            },
            {
                field: 'movement', headerName: 'Количество проездов', minWidth: 200,  sortable: false,
            },
            {
                field: 'payment', headerName: 'Количество оплат', minWidth: 200,  sortable: false,
            },
            {
                field: 'paymentSum', headerName: 'Сумма оплат, руб.', minWidth: 200,  sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.paymentSum / 100)}</Typography>
                    )
                },
            },
            {
                field: 'paymentAvg', headerName: 'Средняя сумма чека, руб.', minWidth: 200,  sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.paymentAvg / 100)}</Typography>
                    )
                },
            },
            {
                field: 'lostPayment',
                headerName: 'Количество оплат утерянных билетов',
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'lostPaymentSum',
                headerName: 'Сумма оплат утерянных билетов, руб.',
                minWidth: 200,
                sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.lostPaymentSum / 100)}</Typography>
                    )
                },
            },
        ],
        renderComponent: () => <PaymentAndMovementDistributionReportPart/>,
    },
    'payment_movement': {
        title: 'Отчет по оплатам и передвижениям',
        endpoint: 'getPaymentAndMovementReport',
        gridColumns: [
            {
                field: 'parkingName', headerName: 'Парковка', minWidth: 200,  sortable: false,
            },
            {
                field: 'terminalName', headerName: 'Терминал', minWidth: 200,  sortable: false,
            },
            {
                field: 'terminalEventTime', headerName: 'Дата/время', minWidth: 200,  sortable: false,
            },
            {
                field: 'transactionNumberString',
                headerName: 'Номер транзакции',
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'cardNumber', headerName: 'Номер билета', minWidth: 230,  sortable: false,
            },
            {
                field: 'lprNumber', headerName: 'ГРЗ ТС', minWidth: 150,  sortable: false,
            },
            {
                field: 'paymentSum', headerName: 'Сумма оплаты, руб.', minWidth: 150,  sortable: false,
            },
            {
                field: 'paymentType', headerName: 'Тип оплаты', minWidth: 200, sortable: false,
            },
        ],
        renderComponent: () => <PaymentAndMovementReportPart/>,
    },
    'longterm_card': {
        title: 'Отчет по абонементам',
        endpoint: 'getLongtermCardsReport',
        gridColumns: [
            {
                field: 'parkingName', headerName: 'Парковка', minWidth: 200,  sortable: false,
            },
            {
                field: 'terminalName', headerName: 'Терминал', minWidth: 200,  sortable: false,
            },
            {
                field: 'terminalEventTime', headerName: 'Дата/время', minWidth: 200,  sortable: false,
            },
            {
                field: 'transactionNumberString',
                headerName: 'Номер транзакции',
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'cardNumber', headerName: 'Номер билета', minWidth: 200,  sortable: false,
            },
            {
                field: 'clientName', headerName: 'Наименование клиента', minWidth: 200,  sortable: false,
            },
            {
                field: 'companyName', headerName: 'Наименование компании', minWidth: 200, sortable: false,
            },
            {
                field: 'lprNumber', headerName: 'ГРЗ ТС', minWidth: 100,  sortable: false,
            },
            {
                field: 'paymentSum', headerName: 'Сумма оплаты, руб.', minWidth: 100,  sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{roundTwoDecimals(cellValue.row.paymentSum / 100)}</Typography>
                    )
                },
            },
            {
                field: 'paymentType', headerName: 'Тип оплаты', minWidth: 100,  sortable: false,
            },
        ],
        renderComponent: () => {
        },
    },
    'shift': {
        title: 'Отчет за смену',
        endpoint: 'getShiftReport',
        gridColumns: [
            {
                field: 'parkingName', headerName: 'Парковка', minWidth: 100,  sortable: false,
            },
            {
                field: 'terminalName', headerName: 'Терминал', minWidth: 100, sortable: false,
            },
            {
                field: 'fnNumber', headerName: 'Номер ФН', minWidth: 100,  sortable: false,
            },
            {
                field: 'shiftNumber', headerName: 'Смена', minWidth: 100,  sortable: false,
            },
            {
                field: 'shiftOpenDate', headerName: 'Дата открытия', minWidth: 100,  sortable: false,
            },
            {
                field: 'shiftCloseDate', headerName: 'Дата закрытия', minWidth: 100, sortable: false,
            },
            {
                field: 'shiftStatus', headerName: 'Статус смены', minWidth: 100,  sortable: false,
                renderCell: (cellValue) => {
                    return (
                        <Typography variant='p'
                                    component='p'>{cellValue.row.shiftStatus === 'SHIFT_CLOSE' ? 'Смена закрыта' : 'Смена открыта'}</Typography>
                    )
                },
            },
        ],
        renderComponent: () => {
        },
    },
}

const gridStyle = {
    marginBottom: '12px',
    fontSize: '12px',
}

const Reports = () => {
    const {type} = useParams();
    const getData = (type) => {
        return reports[type];
    }
    const [resetFunc, setResetFunc] = useState(null);
    const [reportData, setReportData] = useState(getData(type));
    const [disabled, setDisabled] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);

    useEffect(() => {
        reportsStore.resetQueryParams();
        setReportData(getData(type));
    }, [type]);

    useEffect(() => {
        reportsStore.setReports([]);
    }, [reportData]);

    useEffect(() => {
        parkingsStore.getParkings();
        terminalsStore.getTerminals();
    }, []);

    const handlePageChangeClick = (param, setting) => {
        reportsStore.setQueryParams({...reportsStore.queryParams, [setting]: param});
        reportsStore.setGridQueryParams({...reportsStore.gridQueryParams, [setting]: param});
        reportsStore.controller.abort();
        reportsStore.getReports(reportData.endpoint, true);
    }

    const resetForm = () => {
        resetFunc();
    }

    if (type === 'shift') {
        return (
            <>
                <ShiftReport reportData={reportData}/>
            </>)
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: '16px'}}>
                    <Typography component='h5' variant='h5'>{reportData?.title || ''}</Typography>
                    <Box sx={{display: 'flex', marginBottom: '8px'}}>
                        <Tooltip
                            title={disabled ? "Выберите хотя бы 1 парковку" : ''} placement='top'>
                                <span>
                                   <LoadingButton variant='outlined' size='small'
                                                  startIcon={<TableRowsIcon color='primary'/>}
                                                  sx={{marginRight: '8px'}}
                                                  onClick={() => reportsStore.getReportsFile(`${reportData.endpoint}File`, 'xls')}
                                                  loading={reportsStore.isLoading}
                                                  loadingIndicator='Загружаю...'
                                                  disabled={disabled}> Экспорт в XLS</LoadingButton>
                                </span>
                        </Tooltip>
                        <Tooltip
                            title={disabled ? "Выберите хотя бы 1 парковку" : ''} placement='top'>
                                <span>
                                   <LoadingButton variant='outlined' size='small'
                                                  startIcon={<PictureAsPdfIcon color='primary'/>}
                                                  sx={{marginRight: '8px'}}
                                                  onClick={() => reportsStore.getReportsFile(`${reportData.endpoint}File`, 'pdf')}
                                                  loading={reportsStore.isLoading}
                                                  loadingIndicator='Загружаю...'
                                                  disabled={disabled}>Экспорт в PDF</LoadingButton>
                                </span>
                        </Tooltip>
                        <Tooltip
                            title={disabled ? "Выберите хотя бы 1 парковку" : ''} placement='top'>
                                <span>
                                   <LoadingButton variant='outlined' sx={{marginRight: '8px'}}
                                                  size='small'
                                                  onClick={() => {
                                                      setCurrentPage(0);
                                                      reportsStore.setQueryParams({offset: 0});
                                                      reportsStore.resetGridQueryParams();
                                                      reportsStore.setGridQueryParams({...reportsStore.queryParams});
                                                      reportsStore.getReports(reportData.endpoint);
                                                  }}
                                                  loading={reportsStore.isLoading}
                                                  loadingIndicator='Загружаю...'
                                                  disabled={disabled}>Выполнить</LoadingButton>
                                </span>
                        </Tooltip>
                        <Button variant='outlined' size='small' onClick={() => resetForm()}>Сбросить</Button>
                    </Box>
                    <ReportFilter setResetFunc={setResetFunc} renderComp={reportData.renderComponent} type={type}
                                  disableButton={setDisabled} setCurrentPage={setCurrentPage} setPageSize={setPageSize}/>
                    <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'row', mt: '8px'}}>
                        <DataGridPro
                            rowHeight={50}
                            rowCount={reportsStore.reportsCount}
                            paginationMode="server"
                            onPageChange={(newPage) => {
                                handlePageChangeClick(newPage, 'offset');
                                setCurrentPage(newPage);
                            }}
                            onPageSizeChange={(size) => {
                                handlePageChangeClick(size, 'limit');
                                setPageSize(size);
                            }}
                            onSortModelChange={(model) => console.log(model)}
                            rows={[...toJS(reportsStore.reports)]}
                            columns={reportData.gridColumns || []}
                            density='compact'
                            sx={gridStyle}
                            disableColumnSelector
                            disableColumnMenu
                            loading={reportsStore.isLoading}
                            getRowId={(row) => row[reportsStore.id_alias]}
                            components={{
                                NoRowsOverlay: () => (
                                    <GridNoRowBlock/>
                                )
                            }}
                            page={currentPage}
                            pageSize={pageSize}
                        />
                    </Box>
                </Box>
            </LocalizationProvider>
        </>
    );
};

export default observer(Reports);
