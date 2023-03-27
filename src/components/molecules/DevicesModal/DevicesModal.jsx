import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {observer} from "mobx-react-lite";
import LabelAndText from "../LabelAndText/LabelAndText";
import terminalsStore from "../../../store/terminalsStore";
import DeviceInfo from "./DeviceInfo/DeviceInfo";
import {toJS} from "mobx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 820,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const DevicesModal = ({open, setOpen}) => {
    const handleCloseModal = () => {
        setOpen(false);
    }

    const getDevices = () => {
        const devicesArray = [];
        const devicesObject = toJS(terminalsStore.terminalDevices);
        if (Object.keys(devicesObject).length) {
            for (let key of Object.keys(devicesObject)) {
                if (typeof (devicesObject[key]) === 'object') {
                    devicesArray.push(<DeviceInfo item={devicesObject[key]}/>)
                }
            }
        }
        return devicesArray;
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                    <Typography id="modal-modal-title" variant="p" component="p"
                                sx={{
                                    marginBottom: '12px',
                                    color: 'green',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    alignSelf: 'center'
                                }}>
                        Информация о терминале
                    </Typography>
                    <LabelAndText text={terminalsStore.terminalDevices.terminalNumber} label={'Номер терминала'}
                                  variant='info'/>
                    <LabelAndText text={terminalsStore.terminalDevices.terminalName} label={'Наименование терминала'}
                                  variant='info'/>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <Typography variant="p" component="p"
                                sx={{
                                    marginBottom: '12px',
                                    color: 'green',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    alignSelf: 'center'
                                }}>
                        Статусы устройств
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%'}}>
                    {getDevices()}
                </Box>
            </Box>
        </Modal>
    );
};

export default observer(DevicesModal);
