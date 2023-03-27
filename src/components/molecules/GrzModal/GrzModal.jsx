import React, {useEffect, useState} from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import LabelAndSelect from "../LabelAndSelect/LabelAndSelect";
import LoadingButton from "@mui/lab/LoadingButton";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const addGrzModalObject = {
    header: 'Добавить новый ГРЗ.',
    label: 'Новый ГРЗ',
    successButtonLabel: 'Добавить'
}

const editGrzModalObject = {
    header: 'Редактировать ГРЗ.',
    label: 'Изменить ГРЗ',
    successButtonLabel: 'Сохранить'
}

const onlyLatinAndDigits = /[^A-Za-z0-9]/;

const GrzModal = ({open, setOpen, value, onChange, handleAddButton, isNew, setIsNew, formData, items, loading}) => {
    const [availableGrz, setAvailableGrz] = useState([]);
    const [grzValue, setGrzValue] = useState('');

    useEffect(() => {
        setAvailableGrz(convertGrzForSelect(items));
    }, [items]);

    const handleClose = () => {
        setOpen(false);
        onChange('');
        setGrzValue('');
        setIsNew(false);
    }

    const handleChange = (field, value) => {
        onChange(value);
        setGrzValue(value);
    }

    const handleSaveGrz = (value) => {
        handleAddButton(value);
        setGrzValue('');
    }

    const convertGrzForSelect = (items) => {
        return items.map((item, index) => ({id: index, name: item, value: item}));
    }

    let modalData = {};
    isNew ? modalData = addGrzModalObject : modalData = editGrzModalObject;

    if (formData.type === 'card' && availableGrz.length === 0) {
        return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom: '12px'}}>
                        Нет доступных ГРЗ для добавления!
                    </Typography>
                    <Button variant='outlined' onClick={handleClose} color='warning' sx={{width: '150px'}}
                    >Хорошо</Button>
                </Box>
            </Modal>
        )
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom: '12px'}}>
                    {modalData.header}
                </Typography>

                {isNew && formData.type === 'card' ?
                    <LabelAndSelect currentItem='' label='Выберите доступный ГРЗ'
                                    onChange={handleChange} items={availableGrz}/> :
                    <LabelAndInput value={grzValue.toUpperCase()} onChange={(e) => setGrzValue(e.target.value.replace(onlyLatinAndDigits, ""))}
                                   label={addGrzModalObject.label} autoFocus={true}/>}


                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                    <Button variant='outlined' onClick={handleClose} color='error' sx={{width: '150px'}}
                    >Отменить</Button>
                    <LoadingButton variant='contained'
                                   onClick={() => handleSaveGrz(grzValue)}
                                   color='success'
                                   sx={{width: '150px'}}
                                   disabled={!grzValue.length && !value.length}
                                   loadingIndicator="Сохраняю..."
                                   loading={loading}>{modalData.successButtonLabel}</LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default GrzModal;
