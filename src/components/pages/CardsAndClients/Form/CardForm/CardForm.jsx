import React, {useContext, useEffect, useState} from 'react';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LabelAndText from "../../../../molecules/LabelAndText/LabelAndText";
import LabelAndInput from "../../../../molecules/LabelAndInput/LabelAndInput";
import LabelAndDateTimePicker from "../../../../molecules/LabelAndDateTimePicker/LabelAndDateTimePicker";
import LabelAndSelect from "../../../../molecules/LabelAndSelect/LabelAndSelect";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormButtons from "../FormButtons/FormButtons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {CardAndClientsContext} from "../../CardsAndClients";
import {
    checkDateIsDate,
    checkForm,
    checkIsInArray,
    dateToISOLikeButLocal,
    getLastDayOfMonth,
    getLastDayOfYear
} from "../../../../utils/utils";
import CardsStore from "../../../../../store/cardsStore";
import cardsStore from "../../../../../store/cardsStore";

const cardLocation = [{name: 'Снаружи', number: 0, value: 'OUTSIDE'}, {
    name: 'Нейтрально',
    number: 1,
    value: 'NEUTRAL'
}, {name: 'Внутри', number: 2, value: 'INSIDE'}];
const statusIconStyle = {marginLeft: '8px', width: '20px', height: '20px'};
const onlyDigits = /\D/g;

const CardForm = ({
                      formData,
                      cards,
                      makeTreeObject,
                      setFormData,
                      cardTemplates,
                      parkings,
                      tabWidth
                  }) => {
    const [data, setData] = useState({
        cardCheater: false,
        cardLocation: 'NEUTRAL',
        cardNumber: '',
        cardTemplateNumber: parkings[0]?.cardTemplate || 0,
        clientNumber: null,
        ioControl: false,
        lastLpr: '',
        lpr: [],
        lprControl: false,
        status: '',
        type: 'card',
        validParkings: [],
        validFrom: '',
        validUntil: ''
    });
    const {
        isNew,
        setIsNew,
        setSnackBarSettings,
        setCallback,
        setIsConfirmModalOpened,
        setLoading,
        loading
    } = useContext(CardAndClientsContext);
    const [isChanged, setIsChanged] = useState(false);
    const [initialFormValue, setInitialFormValue] = useState({});
    const [status, setStatus] = useState(formData.status);
    const [location, setLocation] = useState('');
    const [currentTemplate, setCurrentTemplate] = useState('');
    const [isError, setIsError] = useState({id: false, validFrom: false});
    const [initial, setInitial] = useState(true);

    useEffect(() => {
        setInitialFormValue(formData);
        setLocation(formData.cardLocation);
        setCurrentTemplate(formData.cardTemplateNumber);
        setInitial(true);
    }, []);

    useEffect(() => {
        setData(formData);
        setStatus(formData.status);
        setLocation(formData.cardLocation);
        setCurrentTemplate(formData.cardTemplateNumber);
        setInitialFormValue(formData);
        setIsError({id: false, validUntil: false});
        setIsChanged(false);
        setInitial(true);
    }, [formData]);

    // useEffect(() => {
    //     console.log('wrong effect');
    //     if (currentTemplate) {
    //         const trimmedDate = changeCardValidTime(getTemplate(currentTemplate));
    //         setData({...data, validUntil: trimmedDate});
    //         // setInitialFormValue({...data, validUntil: trimmedDate});
    //     }
    // }, [data.validUntil]);

    useEffect(() => {
        console.log('effect')
        if (currentTemplate) {
            // setData({...data, cardTemplateNumber: currentTemplate, validUntil: changeCardValidTime(getTemplate(currentTemplate))});
        }
    }, [currentTemplate]);

    console.log(formData, 'form data');

    const handleChange = (field, value) => {
        setData({...data, [field]: value.trimStart()});
    }

    const handleCheckboxClick = (field, value) => {
        setData({...data, [field]: value});
    }

    const handleDateChange = (field, value, template) => {
        if (checkDateIsDate(value)) {
            setIsError({...isError, [field]: false});
            setData({
                ...data,
                [field]: dateToISOLikeButLocal(value),
                validUntil: changeCardValidTime(getTemplate(template))
            });
        } else {
            setIsError({...isError, [field]: true});
            setIsChanged(true);
        }
    }

    useEffect(() => {
        setCallback(() => deleteItem);
        setIsChanged(!checkForm(initialFormValue, data));
        checkData();
    }, [data]);

    const getCardTemplateName = () => {
        return cardTemplates.find(item => item.cardTemplateId === formData.cardTemplateNumber);
    }

    const handleLocationSelectChange = (field, value) => {
        setData({...data, cardLocation: value});
        setLocation(value);
    }

    const handleTemplateSelectChange = (field, value) => {
        if (!initial) {
            setData({...data, cardTemplateNumber: value, validUntil: changeCardValidTime(getTemplate(value))});
        }
        setInitial(false);
        setCurrentTemplate(value);
    }

    const getTemplate = (value) => {
        return cardTemplates.find(item => item.cardTemplateId === value);
    }

    const changeCardValidTime = (template) => {
        if (template) {
            const newDate = new Date(data.validFrom);
            switch (template.typeDuration) {
                case 'YEAR' :
                    newDate.setFullYear(newDate.getFullYear() + template.durationValue);
                    return dateToISOLikeButLocal(getLastDayOfYear(newDate.getFullYear()));
                case 'MONTH':
                    newDate.setMonth(newDate.getMonth() + template.durationValue, 0);
                    newDate.setUTCHours(23 + newDate.getTimezoneOffset() / 60, 59, 59);
                    return dateToISOLikeButLocal(newDate);
                case 'DAY':
                    newDate.setDate(newDate.getDate() + template.durationValue);
                    return dateToISOLikeButLocal(newDate);
            }
        }
    }

    const getCardDuration = () => {
        if (currentTemplate) {
            const yearVariants = ['год', 'года', 'лет'];
            const monthsVariants = ['месяц', 'месяца', 'месяцев'];
            const daysVariants = ['день', 'дня', 'дней'];

            const template = cardTemplates.find(template => template.cardTemplateId === getTemplate(currentTemplate).cardTemplateId);

            const getString = (age) => {
                let count = age % 100;

                if (count >= 5 && count <= 20) {
                    return 2;
                } else {
                    count = count % 10;
                    if (count === 1) {
                        return 0;
                    } else if (count >= 2 && count <= 4) {
                        return 1;
                    } else {
                        return 2
                    }
                }
            }
            const index = getString(template.durationValue);

            switch (template.typeDuration) {
                case 'YEAR' :
                    return template.durationValue + ' ' + yearVariants[index];
                case 'MONTH':
                    return template.durationValue + ' ' + monthsVariants[index];
                case 'DAY':
                    return template.durationValue + ' ' + daysVariants[index];
                default:
                    return 'Срок неизвестен';
            }
        }
    }

    const saveCard = () => {
        setLoading(true);
        // const method = isNew ? 'post' : 'put';

        let noDuplicates = true;
        if (isNew && checkIsInArray(cards.map(card => card.cardNumber), parseInt(data.cardNumber, 10).toString())) noDuplicates = false;

        if (noDuplicates) {
            CardsStore.saveCard(isNew, {
                ...data,
                cardNumber: ('' + data.cardNumber).replace(/\b(0(?!\b))+/g, ""),
                validFrom: dateToISOLikeButLocal(data.validFrom),
                timestamp: new Date().toISOString().replace('Z', '')
            })
                .then((response) => {
                    console.log(response.data, 'response');
                    if (response.status === 200) {
                        const responseData = {
                            ...response.data,
                            type: formData.type,
                        };
                        setData(responseData);
                        setFormData({...response.data, type: formData.type});
                        setInitialFormValue(responseData);
                        updateCards(responseData, isNew);
                        setIsChanged(false);
                        setIsNew(false);
                        setStatus(responseData.status);
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
                }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
            setSnackBarSettings({
                opened: true,
                label: 'Карта с таким номером уже существует!',
                severity: 'warning'
            })
        }
    }


    const updateCards = (data, isNew) => {
        if (!isNew) {
            const changedIndex = cards.findIndex(item => item.cardId === data.cardId);
            if (data.status !== 'DELETED') {
                cards[changedIndex] = data;
            } else {
                cards.splice(changedIndex, 1);
            }
        } else {
            cards.push(data);
        }
        makeTreeObject();
    }

    const resetChanges = () => {
        setData(initialFormValue);
        setLocation(initialFormValue.cardLocation);
        setCurrentTemplate(getCardTemplateName().cardTemplateId);
        setIsError({id: false, validUntil: false});
        // checkContractValidity(initialFormValue.validUntil);
        setInitial(true);
    }

    const deleteItem = () => {
        setLoading(true);
        cardsStore.deleteCard({
            cardId: data.cardId,
            status: 'DELETED',
            timestamp: new Date().toISOString().replace('Z', '')
        })
            .then((response) => {
                console.log(response.data, 'delete response')
                updateCards(response.data);
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

    const setTemplateSelectItems = () => {
        return cardTemplates.map((template) => ({number: template.cardTemplateId, name: template.cardTemplateName}));
    }

    const setValidParkingsArray = () => {
        let parkingsNameArray = []
        if (currentTemplate) {
            const template = cardTemplates.find(template => template.cardTemplateId === currentTemplate);
            template.parkings.forEach(item => {
                parkingsNameArray.push(item.parkingName);
            })
        }
        return parkingsNameArray;
    }

    const checkData = () => {
        if (data.cardNumber.length === 0) {
            setIsError({...isError, id: true});
        } else {
            setIsError({...isError, id: false});
        }
    }

    // const checkContractValidity = (newDate, field) => {
    //     const client = clients.find(client => client.clientNumber === formData.clientNumber);
    //     const company = companies.find(company => company.companyNumber === client.companyNumber);
    //
    //     if (company.validUntil < newDate || client.validUntil < newDate) {
    //         setIsError({...isError, validUntil: true});
    //     } else {
    //         setIsError({...isError, validUntil: false});
    //     }
    // };

    return (
        <Box
            sx={{padding: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: tabWidth}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={1} sx={{flexGrow: 1, marginLeft: '20px', marginBottom: '15px'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <LabelAndText label='Состояние' text={status}/>
                        {status === 'ACTIVE' ? <CheckCircleIcon color='success' sx={statusIconStyle}/> :
                            <RemoveCircleIcon color='error' sx={statusIconStyle}/>}
                    </Box>
                    <LabelAndSelect label='Шаблон постоянной карты' onChange={handleTemplateSelectChange}
                                    items={setTemplateSelectItems()} currentItem={currentTemplate} tabWidth={tabWidth}/>
                    <LabelAndText label='Срок дейтвия карты' text={getCardDuration()}/>
                    <LabelAndText label='Доступные парковки' text={setValidParkingsArray()}/>
                    <LabelAndInput label='Номер карты' value={data.cardNumber}
                                   onChange={(e) => handleChange('cardNumber', e.target.value.replace(onlyDigits, ""))}
                                   disabled={!isNew} error={isError.id}
                                   helperText={isError.id ? 'Это поле обязательное' : ''}/>
                    <LabelAndDateTimePicker label='Начало действия' value={data.validFrom}
                                            onChange={(value) => handleDateChange('validFrom', value, currentTemplate)}
                                            error={isError.validFrom}
                                            errorText={'Некорректный формат даты'}/>
                    <LabelAndDateTimePicker label='Окончание действия' value={data.validUntil}
                                            onChange={(value) => handleDateChange('validUntil', value, currentTemplate)}
                                            disabled={true}
                    />
                    <LabelAndSelect label='Местоположение' onChange={handleLocationSelectChange}
                                    items={cardLocation}
                                    currentItem={location}/>
                    <LabelAndText label='Последний номер' text={data.lastLpr}/>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', fontSize: '12px'}}>
                        <FormControlLabel control={<Checkbox checked={data.cardCheater}
                                                             onChange={(e) => handleCheckboxClick('cardCheater', e.target.checked)}
                                                             inputProps={{'aria-label': 'controlled'}}/>}
                                          label='Обман на парковке'
                                          sx={{width: '48%'}}/>
                        <FormControlLabel control={<Checkbox checked={data.ioControl}
                                                             onChange={(e) => handleCheckboxClick('ioControl', e.target.checked)}
                                                             inputProps={{'aria-label': 'controlled'}}/>}
                                          label='Контроль въезд/выезд'
                                          sx={{width: '48%'}}/>
                        <FormControlLabel control={<Checkbox checked={data.status === 'BLOCKED'}
                                                             onChange={(e) => handleChange('status', data.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED')}
                                                             inputProps={{'aria-label': 'controlled'}}/>}
                                          label='Заблокирована'
                                          sx={{width: '48%'}}/>
                        <FormControlLabel control={<Checkbox checked={data.lprControl}
                                                             onChange={(e) => handleCheckboxClick('lprControl', e.target.checked)}
                                                             inputProps={{'aria-label': 'controlled'}}/>}
                                          label='Контроль LRP'
                                          sx={{width: '48%'}}/>
                    </Box>
                </Stack>
            </LocalizationProvider>
            <FormButtons isChanged={isChanged} onSaveButtonClick={saveCard} onCancelButtonClick={resetChanges}
                         onDeleteButtonClick={setIsConfirmModalOpened} label='карту' loading={loading}
                         isError={isError} isNew={isNew}/>
        </Box>
    );
};

export default CardForm;
