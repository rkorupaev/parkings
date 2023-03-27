import React, {useEffect, useState} from 'react';
import reportsStore from "../../../../../store/reportsStore";
import {observer} from "mobx-react-lite";
import Box from "@mui/material/Box";
import {toJS} from "mobx";
import GridNoRowBlock from "../../../GridNoRowBlock/GridNoRowBlock";
import ShiftGridButtons from "./ShiftGridButtons/ShiftGridButtons";
import {DataGridPro} from "@mui/x-data-grid-pro";

const gridStyle = {
    fontSize: '12px',
}

const ShiftGrid = ({reportData, setShowMainReport, setResetGrid}) => {

    const [currentPage, setCurrentPage] = useState(toJS(reportsStore.queryParams.offset));
    const [pageSize, setPageSize] = useState(toJS(reportsStore.queryParams.limit));

    useEffect(() => {
        setResetGrid(() => resetGrid);
    }, []);

    const resetGrid = () => {
        setCurrentPage(0);
        setPageSize(100);
    }

    const handlePageChangeClick = (param, setting) => {
        reportsStore.setQueryParams({...reportsStore.queryParams, [setting]: param});
        reportsStore.setGridQueryParams({...reportsStore.gridQueryParams, [setting]: param});
        setTimeout(() => {
            reportsStore.getReports(reportData.endpoint, true);
        });
    }

    const onShowSideReportsClick = (solo) => {
        reportsStore.resetSideReports();
        reportsStore.setSideQueryParams(solo ? {fiscalShiftNumber: reportsStore.currentReportRow.shiftNumber} : reportsStore.queryParams);
        setShowMainReport(false);
        reportsStore.getSideReports();
    }

    const onRowDoubleCLick = (target) => {
        reportsStore.setCurrentReportRow(target.row);
        onShowSideReportsClick(true);
    }

    const onRowCLick = (target) => {
        reportsStore.setCurrentReportRow(target.row);
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
            <DataGridPro
                rowHeight={50}
                rowCount={reportsStore.reportsCount}
                paginationMode="server"
                page={currentPage}
                pageSize={pageSize}
                onPageChange={(newPage) => {
                    setCurrentPage(newPage);
                    handlePageChangeClick(newPage, 'offset');
                }}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    handlePageChangeClick(size, 'limit')
                }}
                onSortModelChange={(model) => console.log(model)}
                rows={[...toJS(reportsStore.reports)]}
                columns={reportData.gridColumns || []}
                density='compact'
                sx={gridStyle}
                disableColumnSelector
                disableColumnMenu
                loading={reportsStore.isLoading}
                getRowId={(row) => Date.parse(row[reportsStore.id_alias])}
                onRowClick={(target, event, details) => onRowCLick(target)}
                onRowDoubleClick={(target) => onRowDoubleCLick(target)}
                components={{
                    NoRowsOverlay: () => (
                        <GridNoRowBlock label='Отчетов'/>
                    )
                }}
            />
            <Box sx={{display: 'flex', marginTop: '8px', justifyContent: 'flex-end'}}>
                <ShiftGridButtons onShowSideReportsClick={onShowSideReportsClick}/>
            </Box>
        </Box>
    );
};

export default observer(ShiftGrid);
