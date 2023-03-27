import React, {useContext, useEffect, useState} from 'react';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from "@mui/material/Stack";
import LabelAndText from "../../../../molecules/LabelAndText/LabelAndText";
import LabelAndInput from "../../../../molecules/LabelAndInput/LabelAndInput";
import LabelAndDateTimePicker from "../../../../molecules/LabelAndDateTimePicker/LabelAndDateTimePicker";
import LabelAndMultilineText from "../../../../molecules/LabelAndMultilineText/LabelAndMultilineText";
import LabelAndSelect from "../../../../molecules/LabelAndSelect/LabelAndSelect";
import Box from "@mui/material/Box";
import FormButtons from "../FormButtons/FormButtons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {AppContext} from "../../../../../App";
import {CardAndClientsContext} from "../../CardsAndClients";
import {
    checkDateIsDate,
    checkDateIsValid,
    checkForm,
    dateToISOLikeButLocal, isAnyError,
    prettifyDate
} from "../../../../utils/utils";
import clientsStore from "../../../../../store/clientsStore";
import {observer} from "mobx-react-lite";

const statusIconStyle = {marginLeft: '8px', width: '20px', height: '20px'};

const ClientForm = ({formData, setFormData, companies, clients, makeTreeObject}) => {
    const [data, setData] = useState({
        clientNumber: null,
        companyNumber: null,
        email: '',
        firstName: '',
        lastName: '',
        secondName: '',
        lpr: [],
        status: '',
        telephone: '',
        type: "client",
        registrationDate: '',
        validFrom: '',
        validUntil: '',
        description: ''
    });
    const [isChanged, setIsChanged] = useState(false);
    const [initialFormValue, setInitialFormValue] = useState({});
    const [companyName, setCompanyName] = useState('');
    const [isError, setIsError] = useState({title: false, validFrom: false, validUntil: false});
    const {accessToken} = useContext(AppContext);
    const {
        isNew, setIsNew, setSnackBarSettings, setCallback, setIsConfirmModalOpened, setLoading, loading
    } = useContext(CardAndClientsContext);

    useEffect(() => {
        setInitialFormValue(formData);
        setCompanyName(formData.companyNumber);
    }, []);

    useEffect(() => {
        setData(formData);
        setInitialFormValue(formData);
        setCompanyName(formData.companyNumber);
        setIsError({title: false, validFrom: false, validUntil: false});
    }, [formData]);

    useEffect(() => {
        setCallback(() => deleteItem)
        setIsChanged(!checkForm(initialFormValue, data));
        checkData();
    }, [data]);

    const handleChange = (field, value) => {
        setData({...data, [field]: value.trimStart()});
    }

    const handleDateChange = (field, value) => {
        if (checkDateIsDate(value)) {
            setIsError({...isError, [field]: false});
            setData({...data, [field]: dateToISOLikeButLocal(value).slice(0, 19)});
            if (!isAnyError(isError) && data.fromTime && data.tillTime) checkDate(field, value);
        } else {
            setIsError({...isError, [field]: true});
            setIsChanged(true);
        }
    }

    const checkDate = (field, value) => {
        if (checkDateIsValid(field, value, data)) {
            setIsError({...isError, validUntil: false, validFrom: false});
        } else {
            setIsError({...isError, [field]: true});
        }
    }

    const handleSelectChange = (field, value) => {
        setData({...data, companyNumber: value});
        setCompanyName(value);
    }

    const getCompanyName = (companyNumber) => {
        return companies.find(item => item.companyNumber === companyNumber).companyName;
    }

    const getCompanyNumber = (value) => {
        if (value) {
            return companies.find(item => item.companyName === value).companyNumber;
        }
    }

    const createSelectItems = (items) => {
        return items.map((item) => ({
            name: item.companyName, number: item.companyNumber
        }))
    }

    const checkData = () => {
        if (data.lastName.length === 0) {
            setIsError({...isError, title: true});
        } else {
            setIsError({...isError, title: false});
        }
    }

    const saveClient = () => {
        setLoading(true);
        let method = null;
        const queryData = {
            ...data,
            lastName: data.lastName.trim(),
            registrationDate: dateToISOLikeButLocal(new Date),
            validFrom: dateToISOLikeButLocal(data.validFrom),
            validUntil: dateToISOLikeButLocal(data.validUntil),
            timestamp: new Date().toISOString().replace('Z', '')
        };
        if (isNew) method = () => clientsStore.addClient(queryData)
        else method = () => clientsStore.updateClient(queryData);

        method().then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setData({...response.data});
                setInitialFormValue(response.data);
                setFormData({...response.data, type: formData.type, cards: formData?.cards})
                updateClients(response.data, isNew);
                setIsChanged(false);
                setIsNew(false);
                setSnackBarSettings({
                    opened: true, label: 'Сохранение успешно!', severity: 'success'
                })
            } else {
                setSnackBarSettings({
                    opened: true,
                    label: 'Сохранение не удалось! ' + response.data.errorMsg,
                    severity: 'error'
                })
            }
        })
            .catch((error) => {
                console.error(error)
                setSnackBarSettings({
                    opened: true, label: 'Сохранение не удалось! ' + error, severity: 'error'
                })
            }).finally(() => {
            setLoading(false);
        });
    }

    const updateClients = (data, isNew) => {
        if (!isNew) {
            const changedIndex = clients.findIndex(item => item.clientNumber === data.clientNumber);
            if (data.status === 'ACTIVE') {
                clients[changedIndex] = data;
            } else {
                clients.splice(changedIndex, 1);
            }
        } else {
            clients.push(data);
        }
        makeTreeObject();
    }


    const resetChanges = () => {
        setData(initialFormValue);
        setCompanyName(initialFormValue.companyNumber);
        setIsChanged(false);
        // if (isNew) {
        setIsError({title: false, validFrom: false, validUntil: false});
        // }
    }

    const deleteItem = () => {
        setLoading(true);
        // axios({
        //     method: 'put',
        //     url: API_BASE_IP + '/APIServer/api/v1/client',
        //     data: {
        //         clientNumber: data.clientNumber,
        //         status: 'DELETED',
        //         timestamp: new Date().toISOString().replace('Z', '')
        //     },
        //     headers:
        //         {
        //             'Content-Type': 'application/json; charset=utf-8',
        //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //         }
        // })
        clientsStore.updateClient({
            clientNumber: data.clientNumber, status: 'DELETED', timestamp: new Date().toISOString().replace('Z', ''),
        }).then((response) => {
            console.log(response.data, 'delete response')
            updateClients(response.data);
            setFormData({});
            setIsConfirmModalOpened(false);
            setSnackBarSettings({
                opened: true, label: 'Удаление успешно!', severity: 'success'
            })
        })
            .catch((error) => {
                console.error(error)
                setIsConfirmModalOpened(false);
                setSnackBarSettings({
                    opened: true, label: 'Удаление не удалось! ' + error, severity: 'error'
                })
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (<Box sx={{padding: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%'}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={1} sx={{flexGrow: 1, marginLeft: '20px', marginBottom: '15px'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <LabelAndText label='Состояние' text={data.status}/>
                    {data.status === 'ACTIVE' ? <CheckCircleIcon color='success' sx={statusIconStyle}/> :
                        <RemoveCircleIcon color='error' sx={statusIconStyle}/>}
                </Box>
                <LabelAndInput label='Фамилия' value={data.lastName}
                               onChange={(e) => handleChange('lastName', e.target.value)} error={isError.title}
                               helperText={isError.title ? 'Это поле обязательное' : ''}/>
                <LabelAndInput label='Имя' value={data.firstName}
                               onChange={(e) => handleChange('firstName', e.target.value)}/>
                <LabelAndInput label='Email' value={data.email}
                               onChange={(e) => handleChange('email', e.target.value)}/>
                <LabelAndInput label='Телефон' value={data.telephone}
                               onChange={(e) => handleChange('telephone', e.target.value)}/>
                <LabelAndInput
                    label='Отчество' value={data.secondName}
                    onChange={(e) => handleChange('secondName', e.target.value)}/>
                <LabelAndInput label='Дата создания' value={prettifyDate(data.registrationDate)} disabled={true}/>
                <LabelAndDateTimePicker label='Дата начала контракта' value={data.validFrom}
                                        onChange={(value) => handleDateChange('validFrom', value)}
                                        error={isError.validFrom}
                                        errorText={isError.validFrom && !checkDateIsDate(data.validFrom) ? 'Некорректный формат даты' : 'Дата старта контракта раньше даты конца'}/>
                <LabelAndDateTimePicker label='Дата окончания контракта' value={data.validUntil}
                                        onChange={(value) => handleDateChange('validUntil', value)}
                                        error={isError.validUntil}
                                        errorText={isError.validUntil && !checkDateIsDate(data.validUntil) ? 'Некорректный формат даты' : 'Дата конца контракта раньше даты старта'}/>

                <LabelAndSelect label='Группа' items={createSelectItems(companies)}
                                currentItem={companyName}
                                onChange={handleSelectChange}/>
                <LabelAndMultilineText label='Комментарий' value={data.description}
                                       onChange={(e) => handleChange('description', e.target.value)}
                                       multiline='true'/>
            </Stack>
        </LocalizationProvider>
        <FormButtons isChanged={isChanged} onSaveButtonClick={saveClient} onCancelButtonClick={resetChanges}
                     onDeleteButtonClick={setIsConfirmModalOpened} label="клиента" isError={isError}
                     loading={loading} isNew={isNew} formData={formData}/>
    </Box>);
};

export default observer(ClientForm);
