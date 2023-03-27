import React, {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import Settings from "../../../molecules/Settings/Settings";
import Box from "@mui/material/Box";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    paddingTop: 2,
    display: 'flex',
    flexDirection: 'column',
};

const SettingsModal = ({
                           open,
                           setOpen,
                           currentEvent,
                           settingsTemplates,
                           setEvents,
                           setSettingsTemplate,
                           handleClose
                       }) => {


    const handleCloseModal = () => {
        setOpen(false);
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Settings currentEvent={currentEvent} settingsTemplates={settingsTemplates} setOpen={setOpen}
                          setEvents={setEvents} setSettingsTemplate={setSettingsTemplate}/>
            </Box>
        </Modal>
    );
};

export default SettingsModal;
