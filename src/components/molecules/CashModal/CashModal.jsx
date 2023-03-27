import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import {observer} from "mobx-react-lite";
import cashStore from "../../../store/cashStore";
import CashTabs from "./CashTabs/CashTabs";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const CashModal = ({open, setOpen, item}) => {
    const handleCloseModal = () => {
        setOpen(false);
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="p" component="p"
                            sx={{marginBottom: '12px', alignSelf: 'flex-start'}}>
                    Наличность
                </Typography>
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='p' component='p'>Наименование: {item.terminal}</Typography>
                    <LoadingButton variant='contained' loadingIndicator="Обновляю..." loading={!cashStore.isLoaded}
                                   size='small'
                                   sx={{fontSize: '12px'}}
                                   onClick={() => cashStore.getCashInfo(item.parkingNumber, item.terminalNumber)}>Обновить</LoadingButton>
                </Box>
                <CashTabs/>
            </Box>
        </Modal>
    );
};

export default observer(CashModal);
