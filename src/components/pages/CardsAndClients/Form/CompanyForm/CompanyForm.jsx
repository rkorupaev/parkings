import React, {useContext, useEffect, useState} from 'react';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LabelAndText from "../../../../molecules/LabelAndText/LabelAndText";
import LabelAndInput from "../../../../molecules/LabelAndInput/LabelAndInput";
import LabelAndDateTimePicker from "../../../../molecules/LabelAndDateTimePicker/LabelAndDateTimePicker";
import FormButtons from "../FormButtons/FormButtons";
import Box from "@mui/material/Box";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {CardAndClientsContext} from "../../CardsAndClients";
import {checkDateIsDate, checkDateIsValid, checkForm, dateToISOLikeButLocal, isAnyError} from "../../../../utils/utils";
import companiesStore from "../../../../../store/companiesStore";
import {observer} from "mobx-react-lite";

//TODO сделать проверку на самостоятельный откат изменений

const statusIconStyle = {marginLeft: '8px', width: '20px', height: '20px'};

const CompanyForm = ({formData, companies, makeTreeObject, setFormData}) => {
        const [data, setData] = useState({
            companyName: '',
            companyNumber: null,
            status: '',
            companyMail: '',
            companyPhone: '',
            companySite: '',
            companyAddress: '',
            type: 'company',
            validFrom: '',
            validUntil: '',
            createDate: ''
        });

        //TODO маску на поле телефон вешаем?

        const [isChanged, setIsChanged] = useState(false);
        const [initialFormValue, setInitialFormValue] = useState({});
        const [isError, setIsError] = useState({title: false, validFrom: false, validUntil: false});
        const {
            isNew,
            setIsNew,
            setSnackBarSettings,
            setCallback,
            setIsConfirmModalOpened,
            setLoading,
            loading
        } = useContext(CardAndClientsContext);

        useEffect(() => {
            setInitialFormValue(formData);
        }, []);

        useEffect(() => {
            setData(formData);
            setInitialFormValue(formData);
            setIsError({title: false, validFrom: false, validUntil: false});
        }, [formData])

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

        useEffect(() => {
            setCallback(() => deleteItem);
            setIsChanged(!checkForm(initialFormValue, data));
            checkData();
        }, [data]);

        const saveCompany = () => {
            setLoading(true);
            let method = null;
            const queryData = {
                ...data,
                companyName: data.companyName.trim(),
                createDate: dateToISOLikeButLocal(new Date),
                validFrom: dateToISOLikeButLocal(data.validFrom),
                validUntil: dateToISOLikeButLocal(data.validUntil),
                timestamp: new Date().toISOString().replace('Z', '')
            };
            if (isNew) method = () => companiesStore.addCompany(queryData)
            else method = () => companiesStore.updateCompany(queryData);
            method().then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setData(response.data);
                    setInitialFormValue(response.data);
                    updateCompanies(response.data, isNew);
                    setIsChanged(false);
                    setIsNew(false);
                    setSnackBarSettings({
                        opened: true,
                        label: 'Сохранение успешно!',
                        severity: 'success'
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
                        opened: true,
                        label: 'Сохранение не удалось! ' + error,
                        severity: 'error'
                    })
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        const updateCompanies = (data, isNew) => {
            if (!isNew) {
                const changedIndex = companies.findIndex(item => item.companyNumber === data.companyNumber);
                if (data.status === 'ACTIVE') {
                    companies[changedIndex] = data;
                } else {
                    companies.splice(changedIndex, 1);
                }
            } else {
                companies.push(data);
            }
            makeTreeObject();
        }

        const resetChanges = () => {
            setData(initialFormValue);
            setIsChanged(false);
            // if (isNew) {
            setIsError({title: false, validFrom: false, validUntil: false});
            // }
        }

        const deleteItem = () => {
            setLoading(true);
            companiesStore.updateCompany({
                companyNumber: data.companyNumber,
                status: 'DELETED',
                timestamp: new Date().toISOString().replace('Z', '')
            }).then((response) => {
                console.log(response.data, 'delete response')
                updateCompanies(response.data);
                setFormData({});
                setIsConfirmModalOpened(false);
                setSnackBarSettings({
                    opened: true,
                    label: 'Удаление успешно!',
                    severity: 'success'
                })
            })
                .catch((error) => {
                    console.error(error)
                    setIsConfirmModalOpened(false);
                    setSnackBarSettings({
                        opened: true,
                        label: 'Удаление не удалось! ' + error,
                        severity: 'error'
                    })
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        const checkData = () => {
            if (data.companyName.length === 0) {
                setIsError({...isError, title: true});
            } else {
                setIsError({...isError, title: false});
            }
        }

        return (
            <Box sx={{padding: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%'}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={1} sx={{flexGrow: 1, marginLeft: '20px', marginBottom: '15px'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <LabelAndText label='Состояние' text={data.status}/>
                            {data.status === 'ACTIVE' ? <CheckCircleIcon color='success' sx={statusIconStyle}/> :
                                <RemoveCircleIcon color='error' sx={statusIconStyle}/>}
                        </Box>
                        <LabelAndInput label='Название' value={data.companyName}
                                       onChange={(e) => handleChange('companyName', e.target.value)} error={isError.title}
                                       helperText={isError.title ? 'Это поле обязательное' : ''}/>
                        <LabelAndInput label='Дата создания' value={dateToISOLikeButLocal(data.createDate)}
                                       disabled={true}/>
                        <LabelAndDateTimePicker label='Дата начала контракта' value={data.validFrom}
                                                onChange={(value) => handleDateChange('validFrom', value)}
                                                error={isError.validFrom}
                                                errorText={isError.validFrom && !checkDateIsDate(data.validFrom) ? 'Некорректный формат даты' : 'Дата старта контракта раньше даты конца'}/>
                        <LabelAndDateTimePicker label='Дата окончания контракта' value={data.validUntil}
                                                onChange={(value) => handleDateChange('validUntil', value)}
                                                error={isError.validUntil}
                                                errorText={isError.validUntil && !checkDateIsDate(data.validUntil) ? 'Некорректный формат даты' : 'Дата конца контракта раньше даты старта'}/>
                        <LabelAndInput label='Адрес' value={data.companyAddress}
                                       onChange={(e) => handleChange('companyAddress', e.target.value)}/>
                        <LabelAndInput label='Веб-сайт' value={data.companySite}
                                       onChange={(e) => handleChange('companySite', e.target.value)}/>
                        <LabelAndInput label='Почта' value={data.companyMail}
                                       onChange={(e) => handleChange('companyMail', e.target.value)}/>
                        <LabelAndInput label='Телефон' value={data.companyPhone}
                                       onChange={(e) => handleChange('companyPhone', e.target.value)}/>
                    </Stack>
                </LocalizationProvider>
                <FormButtons isChanged={isChanged} onSaveButtonClick={saveCompany} onCancelButtonClick={resetChanges}
                             onDeleteButtonClick={setIsConfirmModalOpened} label="компанию" isError={isError}
                             loading={loading} isNew={isNew} formData={formData}/>
            </Box>
        );
    }
;

export default observer(CompanyForm);
