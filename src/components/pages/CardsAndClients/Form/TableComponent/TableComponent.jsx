import React, {useContext, useEffect, useState} from 'react';
import TableButtons from "./TableButtons/TableButtons";
import {CardAndClientsContext} from "../../CardsAndClients";
import {observer} from "mobx-react-lite";
import placesStore from "../../../../../store/placesStore";
import GridNoRowBlock from "../../../../molecules/GridNoRowBlock/GridNoRowBlock";
import {DataGridPro} from "@mui/x-data-grid-pro";

const TableComponent = ({columns, buttons = 'гос. номер', openModalCallback, companies, setIsEdit, type, tabValue, rows, setNewGrz = () => {}}) => {
    const [gridRows, setGridRows] = useState([]);
    const {setIsNew, setIsModalOpened} = useContext(CardAndClientsContext);

    const onAddButtonCLick = () => {
        if (tabValue === 0) {
            setIsNew(true);
        }
        if (type === 'grz') {
            setNewGrz(true);
        }
        setIsEdit(null);
        openModalCallback(true);
    }

    useEffect(() => {
        setGridRows(rows);
    }, [rows]);

    return (
        <div style={{flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column'}}>
            <DataGridPro
                rowHeight={50}
                rows={gridRows}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[25]}
                density='compact'
                sx={{marginBottom: '12px', fontSize: '12px'}}
                disableColumnSelector
                disableColumnMenu
                getRowId={(row) => row.parkingId || row.id}
                loading={placesStore.isLoading}
                components={{
                    NoRowsOverlay: () => (
                        <GridNoRowBlock label={"Машиномест"}/>
                    ),
                }}
            />
            <TableButtons label={buttons.label} onAddButtonClick={onAddButtonCLick}/>
        </div>
    );
};

export default observer(TableComponent);
