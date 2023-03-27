import React from 'react';
import reportsStore from "../../../../../../store/reportsStore";
import {toJS} from "mobx";
import GridNoRowBlock from "../../../../GridNoRowBlock/GridNoRowBlock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {observer} from "mobx-react-lite";
import TableRowsIcon from "@mui/icons-material/TableRows";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from "@mui/material/Typography";
import {prettifyDate} from "../../../../../utils/utils";
import LoadingButton from "@mui/lab/LoadingButton";
import {DataGridPro} from "@mui/x-data-grid-pro";

const gridStyle = {
    fontSize: '12px',
}

const gridColumns = [
    {
        field: 'fiscalOperationDate', headerName: 'Время', minWidth: 100,
    },
    {
        field: 'documentNumber', headerName: 'Номер документа', minWidth: 100,
    },
    {
        field: 'parkingName', headerName: 'Парковка', minWidth: 100,
    },
    {
        field: 'terminalName', headerName: 'Терминал', minWidth: 100,
    },
    {
        field: 'shiftNumber', headerName: 'Смена', minWidth: 100,
    },
    {
        field: 'fiscalTypeOperationName', headerName: 'Тип операции', minWidth: 100,
    },
    {
        field: 'paidValue', headerName: 'Сумма, руб.', minWidth: 100,
    },
];

const SideShiftReport = ({setShowMainReport}) => {

    const handlePageChangeClick = (param, setting) => {
        reportsStore.setSideQueryParams({...reportsStore.sideReportQueryParams, [setting]: param});
        reportsStore.getSideReports();
    }

    const handleGetReportClick = (type) => {
        reportsStore.getReportsFile('getShiftReportFile', type, true);
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, marginLeft: '8px'}}>
            <Box sx={{display: 'flex', marginBottom: '8px'}}>
                <Button variant='outlined' size='small' onClick={() => setShowMainReport(true)}
                        startIcon={<ArrowBackIcon color='primary'/>} sx={{marginRight: '8px'}}>Назад</Button>
                <LoadingButton variant='outlined' size='small' startIcon={<TableRowsIcon color='primary'/>}
                               sx={{marginRight: '8px'}}
                               loading={reportsStore.isLoading}
                               loadingIndicator='Загружаю...'
                               onClick={() => handleGetReportClick('xls')}> Экспорт в
                    XLS</LoadingButton>
                <LoadingButton variant='outlined' size='small' startIcon={<PictureAsPdfIcon color='primary'/>}
                               sx={{marginRight: '8px'}}
                               loading={reportsStore.isLoading}
                               loadingIndicator='Загружаю...'
                               onClick={() => handleGetReportClick('pdf')}>Экспорт
                    в
                    PDF</LoadingButton>
            </Box>
            <Typography component='p' variant='p'
                        sx={{marginBottom: '8px'}}>Период: {prettifyDate(reportsStore.queryParams.fromTime)} - {prettifyDate(reportsStore.queryParams.tillTime)}</Typography>
            <DataGridPro
                rowHeight={50}
                rowCount={reportsStore.sideReportsCount}
                paginationMode="server"
                onPageChange={(newPage) => handlePageChangeClick(newPage, 'offset')}
                onPageSizeChange={(size) => handlePageChangeClick(size, 'limit')}
                onSortModelChange={(model) => console.log(model)}
                rows={[...toJS(reportsStore.sideReports)]}
                columns={gridColumns}
                density='compact'
                sx={gridStyle}
                disableColumnSelector
                disableColumnMenu
                loading={reportsStore.isLoading}
                getRowId={(row) => row.id}
                components={{
                    NoRowsOverlay: () => (
                        <GridNoRowBlock label='Отчетов'/>
                    )
                }}
            />
            <Typography variant='p' component='p'
                        sx={{alignSelf: 'flex-end', marginTop: '8px'}}>Итого: {reportsStore.summaryValue}</Typography>
        </Box>
    );
};

export default observer(SideShiftReport);
