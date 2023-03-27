import React, {useContext, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import LabelAndSelect from "../LabelAndSelect/LabelAndSelect";
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import Icon from "@mui/material/Icon";
import ParkLogo from "../../../assets/images/park-sign.png";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {AppContext} from "../../../App";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import ButtonGroup from "@mui/material/ButtonGroup";
import LabelAndColorPicker from "../LabelAndColorPicker/LabelAndColorPicker";
import {checkForm} from "../../utils/utils";
import bloop from '../../../assets/sounds/bloop_x.wav';
import boing from '../../../assets/sounds/boing_x.wav';
import exitTone2 from '../../../assets/sounds/ExitTone2.wav';
import exitTone3 from '../../../assets/sounds/ExitTone3.wav';
import exitTone6 from '../../../assets/sounds/ExitTone6.wav';
import exitTone10 from '../../../assets/sounds/ExitTone10.wav';
import exitTone15 from '../../../assets/sounds/ExitTone15.wav';
import exitTone20 from '../../../assets/sounds/ExitTone20.wav';
import exitTone25 from '../../../assets/sounds/ExitTone25.wav';
import returnTone2 from '../../../assets/sounds/ReturnTone2.wav';
import verificationTone15 from '../../../assets/sounds/VerificationTone15.wav';
import verificationTone24 from '../../../assets/sounds/VerificationTone24.wav';
import warning from '../../../assets/sounds/WARNING1.wav';
import womp from '../../../assets/sounds/womp.wav';
import {Howl} from 'howler';
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import eventsStore from "../../../store/eventsStore";
import {toJS} from "mobx";

const soundsArray = [
    {number: 0, src: '', name: 'Без звука'},
    {number: 1, src: bloop, name: 'bloop_x.wav'},
    {number: 2, src: boing, name: 'boing_x.wav'},
    {number: 3, src: exitTone2, name: 'ExitTone2.wav'},
    {number: 4, src: exitTone3, name: 'ExitTone3.wav'},
    {number: 5, src: exitTone6, name: 'ExitTone6.wav'},
    {number: 6, src: exitTone10, name: 'ExitTone10.wav'},
    {number: 7, src: exitTone15, name: 'ExitTone15.wav'},
    {number: 8, src: exitTone20, name: 'ExitTone20.wav'},
    {number: 9, src: exitTone25, name: 'ExitTone25.wav'},
    {number: 10, src: returnTone2, name: 'ReturnTone2.wav'},
    {number: 11, src: verificationTone15, name: 'VerificationTone15.wav'},
    {number: 12, src: verificationTone24, name: 'VerificationTone24.wav'},
    {number: 13, src: warning, name: 'WARNING1.wav'},
    {number: 14, src: womp, name: 'womp.wav'},
]

const Settings = ({currentEvent, settingsTemplates, setOpen, setEvents, setSettingsTemplate}) => {
    const getSoundId = (eventSound) => {
        const soundName = eventSound;
        if (soundName === '') return 0;
        return soundsArray.findIndex(sound => sound.name === soundName);
    }

    const getSettings = (currentEvent) => {
        return toJS(eventsStore.eventTemplates).find(template => template.deviceEventTypeId === currentEvent);
    }

    const {setSnackBarSettings} = useContext(AppContext);
    const [currentTemplate, setCurrentTemplate] = useState(1);
    const [isChanged, setIsChanged] = useState(false);
    const [currentSound, setCurrentSound] = useState(getSoundId(getSettings(currentEvent.deviceEventTypeId).eventSound) || 0);
    const [isError, setIsError] = useState({title: false});
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);
    const [data, setData] = useState(getSettings(currentEvent.deviceEventTypeId));
    const [initialData, setInitialData] = useState(getSettings(currentEvent.deviceEventTypeId));

    useEffect(() => {
        setData(getSettings(currentEvent.deviceEventTypeId));
        setInitialData(getSettings(currentEvent.deviceEventTypeId));
        setCurrentTemplate(currentEvent.deviceEventTypeId);
        setCurrentSound(getSoundId(getSettings(currentEvent.deviceEventTypeId).eventSound));
    }, [currentEvent]);


    useEffect(() => {
        setIsChanged(!checkForm(initialData, data));
        checkData();
    }, [data]);

    const checkData = () => {
        if (data.deviceEventTypeCustomDescription.length === 0) {
            setIsError({...isError, title: true});
        } else {
            setIsError({...isError, title: false});
        }
    }

    const setEventTypeSelectItems = () => {
        return toJS(eventsStore.eventTypes).map(event => ({
            number: event.deviceEventTypeId,
            name: event.deviceEventTypeId + `: ` + event.deviceEventTypeDescription
        }));
    }

    const typeSelectChangeHandler = (field, value) => {
        setData(getSettings(value));
        setInitialData(getSettings(value));
        setCurrentSound(getSoundId(getSettings(value).eventSound));
    }

    const soundSelectChangeHandler = (field, value) => {
        if (value !== '') {
            if (value === 0) {
                setData({...data, eventSound: ""});
            } else {
                setData({...data, eventSound: soundsArray[value].name});
            }
            setCurrentSound(value);
            if (currentSound !== value) {
                const sound = new Howl({
                    src: [soundsArray[value].src]
                });
                sound.play();
            }
        }
    }

    const handleColorChange = (value) => {
        setData({...data, eventColor: value})
    }

    const handleChange = (field, value) => {
        setData({...data, [field]: value})
    }

    const handleCheckboxClick = (field, value) => {
        setData({...data, [field]: value});
    }

    const updateTemplates = (data) => {
        const copy = structuredClone(toJS(eventsStore.eventTemplates));
        const templateIndex = copy.findIndex(template => template.deviceEventTemplateId === data.deviceEventTemplateId);
        copy[templateIndex] = {...data};
        eventsStore.setEventTemplates(copy);
    }

    const saveSettingButtonHandler = () => {
        eventsStore.updateDeviceEventsTemplate(data).then((response) => {
            setData(response.data);
            setInitialData(response.data);
            updateTemplates(response.data);
            console.log(response.data, 'save result');
            setIsChanged(false);
            setSnackBarSettings({
                severity: 'success',
                opened: true,
                label: 'Сохранение успешно.'
            })
        })
            .catch((error) => {
                console.error(error)
                setSnackBarSettings({
                    severity: 'error',
                    opened: true,
                    label: 'Сохранение не удалось.'
                })
            }).finally(() => {
            // setIsLoading(false);
        })
    }

    //TODO axios rework
    const resetSettingButtonHandler = (mode) => {
        eventsStore.resetDeviceEventsTemplate(data, mode).then((response) => {
            if (mode === 'single') {
                setData(response.data);
                setInitialData(response.data);
                updateTemplates(response.data);
                setSnackBarSettings({
                    severity: 'success',
                    opened: true,
                    label: 'Настройки события сбошена.'
                });
            } else {
                resetAllSettings();
                setIsConfirmModalOpened(false);
                setSnackBarSettings({
                    severity: 'success',
                    opened: true,
                    label: 'Все настройки сбошены.'
                });
            }
            setCurrentSound(0);
            setIsChanged(false);
            console.log(response.data, 'delete result');
        })
            .catch((error) => {
                console.error(error)
                setSnackBarSettings({
                    severity: 'error',
                    opened: true,
                    label: 'Произошла ошибка. Повторите запрос!'
                });
            }).finally(() => {
            // setIsLoading(false);
        })
    }

    const resetButtonHandler = () => {
        setData(initialData);
        setCurrentSound(getSoundId(getSettings(initialData.deviceEventTypeId).eventSound));
    }

    const resetAllSettings = () => {
        const defaultSetting = {
            deviceEventTemplateId: initialData.deviceEventTemplateId,
            deviceEventTypeCustomDescription: initialData.deviceEventTypeCustomDescription,
            deviceEventTypeDescription: initialData.deviceEventTypeDescription,
            deviceEventTypeId: initialData.deviceEventTypeId,
            eventColor: "#ffffff",
            eventSound: "",
            isVisible: true,
            userId: initialData.userId
        };
        const resetedArray = eventsStore.eventTemplates.map(template => ({
            ...template, eventColor: "#ffffff",
            eventSound: "",
            isVisible: true,
            userId: initialData.userId,
            deviceEventTypeCustomDescription: template.deviceEventTypeDescription
        }));
        eventsStore.setEventTemplates(resetedArray);
        setInitialData(defaultSetting);
        setData(defaultSetting);
    }

    return (
        <>
            <Box sx={{display: 'flex', marginBottom: '10px'}}>
                <Icon sx={{marginRight: '8px'}}>
                    <img src={ParkLogo} height={20} width={20}/>
                </Icon>
                <Typography id="modal-title" variant="h6" component="p">
                    Настройка событий
                </Typography>
            </Box>
            <Stack spacing={1} sx={{flexGrow: 1, marginBottom: '15px'}}>
                <LabelAndSelect currentItem={currentTemplate} label='Наименование'
                                items={setEventTypeSelectItems()}
                                onChange={typeSelectChangeHandler}/>
                <LabelAndInput label='Название' value={data.deviceEventTypeCustomDescription}
                               onChange={(e) => handleChange('deviceEventTypeCustomDescription', e.target.value)}
                               error={isError.title}
                               helperText={isError.title ? 'Это поле обязательное' : ''}/>
                <LabelAndColorPicker label='Цвет события' color={data.eventColor} onChange={handleColorChange}/>
                <LabelAndSelect label='Звуковой файл' items={soundsArray} onChange={soundSelectChangeHandler}
                                currentItem={currentSound}/>
                <FormControlLabel control={<Checkbox checked={data.isVisible}
                                                     onChange={(e) => handleCheckboxClick('isVisible', e.target.checked)}
                                                     inputProps={{'aria-label': 'controlled'}}/>}
                                  label='Отображать событие'
                                  sx={{marginLeft: '0', flexGrow: 1, justifyContent: 'flex-end'}}
                                  labelPlacement="start"/>
                <ButtonGroup variant="outlined" aria-label="outlined button group" sx={{alignSelf: 'flex-end'}}
                             size='small'>
                    <LoadingButton variant="outlined" disabled={!isChanged || isError.title}
                                   startIcon={<CheckCircleIcon color='success'/>}
                                   onClick={() => saveSettingButtonHandler()} sx={{fontSize: '10px'}}
                                   loading={eventsStore.isLoading}
                                   loadingPosition="start">Сохранить</LoadingButton>
                    <LoadingButton variant="outlined"
                                   startIcon={<SettingsBackupRestoreIcon color='primary'/>}
                                   onClick={() => resetSettingButtonHandler('single')} sx={{fontSize: '10px'}}
                                   loading={eventsStore.isLoading}
                                   loadingPosition="start">Сбросить</LoadingButton>
                    <LoadingButton variant="outlined"
                                   startIcon={<SettingsBackupRestoreIcon color='primary'/>}
                                   onClick={() => setIsConfirmModalOpened(true)} sx={{fontSize: '10px'}}
                                   loading={eventsStore.isLoading}
                                   loadingPosition="start">Сбросить всё</LoadingButton>
                    <LoadingButton variant="outlined" startIcon={<CancelIcon color='error'/>}
                                   onClick={() => resetButtonHandler()}
                                   sx={{fontSize: '10px'}} disabled={!isChanged} loading={eventsStore.isLoading}
                                   loadingPosition="start">Отмена</LoadingButton>
                </ButtonGroup>
            </Stack>
            <ConfirmModal type='reset' open={isConfirmModalOpened} setOpen={setIsConfirmModalOpened}
                          handleConfirmButton={() => resetSettingButtonHandler('full')}
                          loading={eventsStore.isLoading}/>
        </>
    );
};

export default Settings;
