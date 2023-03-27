import React, {useMemo} from 'react';
import GridNoRowBlock from "../../../GridNoRowBlock/GridNoRowBlock";
import Box from "@mui/material/Box";
import cashStore from "../../../../../store/cashStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import Typography from "@mui/material/Typography";
import {DataGridPro} from "@mui/x-data-grid-pro";

const gridStyle = {
    marginBottom: '12px',
    fontSize: '12px',
};

const CashTab = ({value}) => {
    const moneyContainer = useMemo(() => ({
        0: toJS(cashStore.givenMoney.notes),
        1: toJS(cashStore.changeMoney.notes),
        2: toJS(cashStore.givenMoney.coins),
        3: toJS(cashStore.changeMoney.coins),
    }), [cashStore.givenMoney, cashStore.changeMoney]);

    const getRows = (value) => {
        return moneyContainer[value] || [];
    }

    const gridData = useMemo(() => ({
        columns: [
            {
                field: 'nominal', headerName: 'Номинал', minWidth: 200, flex: 1,
            },
            {field: 'amount', headerName: 'Количество', minWidth: 200,  flex: 1,},
            {field: 'summ', headerName: 'Сумма, руб.', minWidth: 200, flex: 1,},
        ],
        rows: getRows(value)
    }), [cashStore.givenMoney, cashStore.changeMoney]);

    const getSum = (data) => {
        let result = 0;
        if (Object.keys(data).length) data.forEach(item => result += item.summ);
        return result;
    }

    const getAmount = (data) => {
        let amount = 0;
        if (Object.keys(data).length) data.forEach(item => amount += item.amount);
        return amount;
    }

    return (
        <Box>
            <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'row', height: '321px'}}>
                <DataGridPro
                    rowHeight={50}
                    rows={gridData.rows}
                    columns={gridData.columns}
                    density='compact'
                    sx={gridStyle}
                    disableColumnSelector
                    disableColumnMenu
                    loading={!cashStore.isLoaded}
                    getRowId={(row) => row.nominal}
                    hideFooter
                    components={{
                        NoRowsOverlay: () => (
                            <GridNoRowBlock label='Наличности'/>
                        )
                    }}
                />
            </Box>
            <Typography variant='h6' component='p'>Итого:</Typography>
            <Typography variant='p' component='p'>Количество: {getAmount(getRows(value))}</Typography>
            <Typography variant='p' component='p'>Сумма, руб.: {getSum(getRows(value))}</Typography>
        </Box>
    );
};

export default observer(CashTab);
