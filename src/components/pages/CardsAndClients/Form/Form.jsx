import React, {useContext, useEffect, useState} from 'react';
import CompanyForm from "./CompanyForm/CompanyForm";
import ClientForm from "./ClientForm/ClientForm";
import CardForm from "./CardForm/CardForm";
import Typography from "@mui/material/Typography";
import TabContainer from "./TabContainer/TabContainer";
import TableComponent from "./TableComponent/TableComponent";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";
import {AppContext} from "../../../../App";
import {CardAndClientsContext} from "../CardsAndClients";
import {checkIsInArray, getClientGrzArrayAvaliable} from "../../../utils/utils";
import clientsStore from "../../../../store/clientsStore";
import cardsStore from "../../../../store/cardsStore";
import TooltipTypography from "../../../molecules/TooltipTypography/TooltipTypography";
import parkingsStore from "../../../../store/parkingsStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import placesStore from "../../../../store/placesStore";

const Form = ({
                  formData,
                  setFormData,
                  companies,
                  setCompanies,
                  cards,
                  setCards,
                  clients,
                  setClients,
                  makeTreeObject,
                  setGrz,
                  setIsModalOpened,
                  setCellValue,
                  cardTemplates,
                  parkings,
                  setIsEdit,
                  setEditType,
                  setNewGrz,
              }) => {
        const [grzArray, setGrzArray] = useState([]);
        const [parkingsArray, setParkingsArray] = useState([]);
        const [tabWidth, setTabWidth] = useState(0);
        const {setSnackBarSettings} = useContext(AppContext);
        const {
            setIsConfirmModalOpened,
            setClientGrzArray,
            setCallback,
            setIsReservedPlacesModalOpened,
            setIsDeleteReservedPlaceOpened,
            tabValue,
        } = useContext(CardAndClientsContext);

        useEffect(() => {
            if (formData.parkings) {
                setParkingsArray(formData.parkings)
            }

            if (formData.type === 'company') parkingsStore.setCompanyParkings(formData.parkings);

            if (formData.lpr) {
                // setGrzArray(formData.lpr.map((item, index) => ({id: index, grz: item})))
                clientsStore.setGrz(formData.lpr.map((item, index) => ({id: index, grz: item})));
            }
        }, [formData]);

        const makeGridData = (data) => {
            if (data.length > 0) return data.map((item) => item.grz);
            return data;
        }

        const getClient = () => {
            const index = clients.findIndex((item) => item.clientNumber === formData.clientNumber);
            return clients[index];
        }

        const updateCardGrz = (grz) => {
            const client = getClient();

            let cardLprIndex = null;
            let clientCardIndex = null;
            client.cards.forEach((card, index) => {
                cardLprIndex = card.lpr.findIndex(lpr => lpr === grz);
                if (cardLprIndex !== -1) {
                    card.lpr.splice(cardLprIndex, 1);
                    clientCardIndex = index;
                }
            })
            const cardIndex = cards.findIndex((item) => item.clientNumber === formData.clientNumber);
            cards[cardIndex] = client.cards[clientCardIndex];
            setCards([...cards]);
        }

        const deleteGrz = (cellValue) => {
            const client = getClient();

            // if (!checkGrzIsInCards(cellValue.row.grz)) {
            const data = toJS(clientsStore.grz).filter((item) => item.grz !== cellValue.row.grz);
            const payload = {};
            payload.timestamp = new Date().toISOString().replace('Z', '');
            payload.lpr = makeGridData(data);
            formData.type === 'client' ? payload.clientNumber = formData.clientNumber : payload.cardId = formData.cardId;
            let grzMethod = null;
            if (formData.type === 'client') grzMethod = () => clientsStore.updateClientGRZ(payload, 'client')
            else grzMethod = () => cardsStore.updateCardGRZ(payload, 'card');

            grzMethod().then((response) => {
                    let responseData = response.data;
                    if (formData.type === 'client') {
                        updateClients(responseData, cellValue.row.grz);
                        responseData.cards = [...client.cards];
                    } else {
                        updateCards(responseData);
                    }
                    setGrzArray([...data]);
                    setFormData({...responseData, type: formData.type});
                    // updateCardGrz(cellValue.row.grz);
                    setIsConfirmModalOpened(false);
                    setCellValue(null);
                    setSnackBarSettings({
                        label: 'Удаление успешно',
                        severity: 'success',
                        opened: true
                    })
                }
            )
                .catch((error) => {
                    console.error(error)
                    setSnackBarSettings({
                        label: 'Ошибка удаления ' + error,
                        severity: 'error',
                        opened: true
                    })
                });
            // }
            // else {
            // setSnackBarSettings({
            //     label: 'Этот ГРЗ прикреплен к карте!',
            //     severity: 'error',
            //     opened: true
            // })
            // }
        }

        const deleteGrzButtonHandler = (cellValue) => {
            if (!checkGrzIsInCards(cellValue.row.grz)) {
                deleteGrz(cellValue);
            } else {
                setIsConfirmModalOpened(true);
                setCallback(() => deleteGrz);
                setCellValue(cellValue);
                // updateCardGrz(cellValue.row.grz);
            }
        }

        const updateClients = (data, grz) => {
            const clientIndex = clients.findIndex((item) => item.clientNumber === formData.clientNumber)
            const clientCards = [...clients[clientIndex].cards];

            let cardLprIndex = null;
            let clientCardIndex = null;

            clients[clientIndex].cards.forEach((card, index) => {
                card.lpr.forEach((lpr, lprIndex) => {
                    if (lpr === grz) {
                        clientCardIndex = index;
                        cardLprIndex = lprIndex;
                    }
                })
            })

            if (clientCardIndex >= 0 && clientCardIndex !== null) {
                const cardIndexGlobal = cards.findIndex(card => card.cardId === clients[clientIndex].cards[clientCardIndex].cardId);
                clients[clientIndex].cards[clientCardIndex].lpr.splice(cardLprIndex, 1);
                // clientCards[clientCardIndex] = clients[clientIndex].cards[clientCardIndex];
                cards[cardIndexGlobal] = clients[clientIndex].cards[clientCardIndex];
                setCards([...cards]);
            }

            clients[clientIndex] = {...data, cards: clientCards};
            setClients(clients);
        }

        const updateCards = (data) => {
            const index = cards.findIndex((item) => item.cardId === formData.cardId)
            cards[index] = data;
            setCards([...cards]);
        }

        const editGrzHandler = (cellValue) => {
            setGrz(cellValue.row.grz);
            setIsModalOpened(true);
            setCellValue(cellValue.row.grz);
        }

        const checkGrzIsInCards = (grz) => {
            let inArray = false;
            if (formData.type === 'client') {
                formData.cards.forEach(card => {
                    if (checkIsInArray(card.lpr, grz)) {
                        return inArray = true;
                    }
                })
            }
            return inArray;
        }

        const editReservePlace = (id) => {
            console.log(id, 'reserve place');
            setIsEdit(id);
            setIsReservedPlacesModalOpened(true);
        }

        const deleteReservePlace = (id, type) => {
            console.log(id, 'reserve place');
            setIsEdit(id);
            setEditType(type);
            setIsDeleteReservedPlaceOpened(true);
        }

        useEffect(() => {
            if (formData.type === 'card') {
                setClientGrzArray(getClientGrzArrayAvaliable(clients, formData));
            }
        }, [clientsStore.grz]);

//данные для отрисовки компонента формы и табов с таблицами
        const formComponentsArray = {
            company: {
                tabs: [{
                    label: 'Общее',
                    componentFunc: () => <CompanyForm formData={formData} setCompanies={setCompanies}
                                                      companies={companies}
                                                      makeTreeObject={makeTreeObject} setFormData={setFormData}/>
                },
                    {
                        label: 'Резервировние машиномест',
                        columns: [
                            {
                                field: 'parkingName',
                                headerName: 'Парковка',
                                minWidth: 200,
                                renderCell: (cellValue) => {
                                    return (
                                        <TooltipTypography text={cellValue.row.parkingName || ''}/>
                                    )
                                },
                            },
                            {
                                field: 'counterValue', headerName: 'Текущее значение', type: 'number',
                                maxWidth: 120
                            },
                            {
                                field: 'limitValue',
                                headerName: 'Максимальное значение',
                                type: 'number',
                                maxWidth: 120,
                            },
                            {
                                field: 'edit',
                                headerName: '',
                                maxWidth: 30,
                                renderCell: (cellValue) => {
                                    return (
                                        <IconButton onClick={(e) => editReservePlace(cellValue.row.parkingId)} size='small'
                                                    aria-label='edit'>
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                    )
                                }
                            },
                            {
                                field: 'delete',
                                headerName: '',
                                maxWidth: 30,
                                renderCell: (cellValue) => {
                                    return (
                                        <IconButton onClick={(e) => deleteReservePlace(cellValue.row.parkingId, 'company')} size='small'
                                                    aria-label='delete'>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    )
                                }
                            },
                        ],
                        rows: parkingsArray,
                        buttons: {
                            label: 'счетчик'
                        },
                        componentFunc: () => <TableComponent columns={formComponentsArray.company.tabs[1].columns}
                                                             buttons={formComponentsArray.company.tabs[1].buttons}
                                                             openModalCallback={setIsReservedPlacesModalOpened}
                                                             companies={companies} setIsEdit={setIsEdit} tabValue={tabValue}
                                                             rows={toJS(placesStore.itemPlaces)}
                                                             type='places'
                        />
                    }],
            },
            client: {
                tabs: [{
                    label: 'Общее',
                    componentFunc: () => <ClientForm formData={formData} setCompanies={setCompanies}
                                                     companies={companies}
                                                     makeTreeObject={makeTreeObject} clients={clients}
                                                     setFormData={setFormData}/>
                },
                    {
                        label: 'Привязка гос. номеров',
                        columns: [
                            {field: 'grz', headerName: 'ГРЗ ТС', minWidth: 200},
                            // {
                            //     field: 'edit',
                            //     headerName: '',
                            //     width: 30,
                            //     sortable: false,
                            //     filterable: false,
                            //     renderCell: (cellValue) => {
                            //         return (
                            //             <IconButton onClick={(e) => editGrzHandler(cellValue)} size='small'
                            //                         aria-label='edit'>
                            //                 <EditIcon color="primary"/>
                            //             </IconButton>
                            //         )
                            //     }
                            // },
                            {
                                field: 'delete',
                                headerName: '',
                                maxWidth: 30,
                                sortable: false,
                                filterable: false,
                                renderCell: (cellValue) => {
                                    return (
                                        <IconButton onClick={(e) => deleteGrzButtonHandler(cellValue)} size='small'
                                                    aria-label='delete'>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    )
                                }
                            },
                        ],
                        buttons: {
                            label: 'гос. номер'
                        },
                        componentFunc: () => <TableComponent columns={formComponentsArray.client.tabs[1].columns}
                                                             rows={toJS(clientsStore.grz)}
                                                             buttons={formComponentsArray.client.tabs[1].buttons}
                                                             openModalCallback={setIsModalOpened}
                                                             tabValue={tabValue}
                                                             setIsEdit={setIsEdit}
                                                             type='grz'
                                                             setNewGrz={setNewGrz}
                        />
                    },
                    {
                        label: 'Резервировние машиномест',
                        columns: [
                            {field: 'parkingName', headerName: 'Парковка', minWidth: 300},
                            {
                                field: 'counterValue', headerName: 'Текущее значение', type: 'number',
                                width: 120
                            },
                            {
                                field: 'limitValue',
                                headerName: 'Максимальное значение',
                                type: 'number',
                                width: 120,
                            },
                            {
                                field: 'edit',
                                headerName: '',
                                maxWidth: 30,
                                renderCell: (cellValue) => {
                                    return (
                                        <IconButton onClick={(e) => editReservePlace(cellValue.row.parkingId)} size='small' aria-label='edit'>
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                    )
                                }
                            },
                            {
                                field: 'delete',
                                headerName: '',
                                maxWidth: 30,
                                renderCell: (cellValue) => {
                                    return (
                                        <IconButton onClick={(e) => deleteReservePlace(cellValue.row.parkingId, 'client')} size='small'
                                                    aria-label='delete'>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    )
                                }
                            },
                        ],
                        rows: parkingsArray,
                        buttons: {
                            label: 'счетчик'
                        },
                        componentFunc: () => <TableComponent columns={formComponentsArray.client.tabs[2].columns}
                                                             buttons={formComponentsArray.client.tabs[2].buttons}
                                                             openModalCallback={setIsReservedPlacesModalOpened}
                                                             setIsEdit={setIsEdit}
                                                             tabValue={tabValue}
                                                             rows={toJS(placesStore.clientItemPlaces)}
                                                             type='places'
                        />
                    }],
            },
            card: {
                tabs: [{
                    label: 'Общее',
                    componentFunc: () => <CardForm formData={formData} setCompanies={setCompanies}
                                                   clients={clients} cards={cards}
                                                   makeTreeObject={makeTreeObject} setFormData={setFormData}
                                                   grzArray={grzArray} cardTemplates={cardTemplates} parkings={parkings}
                                                   tabWidth={tabWidth} companies={companies}/>
                },
                    {
                        label: 'Привязка к ГРЗ ТС',
                        columns: [
                            {field: 'grz', headerName: 'ГРЗ ТС', minWidth: 200,},
                            {
                                field: 'delete',
                                headerName: '',
                                maxWidth: 30,
                                renderCell: (cellValues) => {
                                    return (
                                        <IconButton onClick={(e) => deleteGrz(cellValues)} size='small'
                                                    aria-label='delete'>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    )
                                }
                            },
                        ],
                        componentFunc: () =>
                            <TableComponent columns={formComponentsArray.card.tabs[1].columns}
                                            type='grz'
                                            openModalCallback={setIsModalOpened}
                                            setNewGrz={setNewGrz}
                                            rows={toJS(clientsStore.grz)}
                                            setIsEdit={setIsEdit}
                            />
                    },
                ],
            },
        }

        switch (formData.type
            ) {
            case 'company':
                return (
                    <TabContainer items={formComponentsArray.company.tabs} setTabWidth={setTabWidth} tabWidth={tabWidth}/>
                );
            case 'client':
                return (
                    <TabContainer items={formComponentsArray.client.tabs} setTabWidth={setTabWidth} tabWidth={tabWidth}/>
                );
            case 'card':
                return (
                    <TabContainer items={formComponentsArray.card.tabs} setTabWidth={setTabWidth} tabWidth={tabWidth}/>
                );
            default:
                return (
                    <>
                        <Typography variant="h4" component="h2"
                                    sx={{
                                        textAlign: 'center',
                                        flexGrow: 1,
                                        borderLeft: '1px solid #1976d2',
                                        marginLeft: '20px'
                                    }}>
                            Выберите элемент из списка
                        </Typography>
                    </>
                )
        }
    }
;

export default observer(Form);
