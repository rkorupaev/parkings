import React, {createContext, forwardRef, useContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight.js';
import TreeItem, {useTreeItem} from '@mui/lab/TreeItem';
import Form from "./Form/Form";
import LabelAndInput from "../../molecules/LabelAndInput/LabelAndInput";
import ParkLogo from '../../../assets/images/park-sign.png';
import Icon from "@mui/material/Icon";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StorageIcon from '@mui/icons-material/Storage';
import AddButtonComponent from "./AddButtonComponent/AddButtonComponent";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import clsx from 'clsx';
import GrzModal from "../../molecules/GrzModal/GrzModal";
import GrzConfirmModal from "../../molecules/GrzConfirmModal/GrzConfirmModal";
import {checkIsInArray} from "../../utils/utils";
import {AppContext} from "../../../App";
import cardsStore from "../../../store/cardsStore";
import {observer} from "mobx-react-lite";
import clientsStore from "../../../store/clientsStore";
import companiesStore from "../../../store/companiesStore";
import placesStore from "../../../store/placesStore";
import cardTemplatesStore from "../../../store/cardTemplatesStore";
import ReservedPlacesModal from "../../molecules/ReservePlacesModal/ReservePlacesModal";
import ConfirmModal from "../../molecules/ConfirmModal/ConfirmModal";
import parkingsStore from "../../../store/parkingsStore";
import Tooltip from "@mui/material/Tooltip";
import PlacesStore from "../../../store/placesStore";
import {toString} from "underscore/modules/_setup";
import {toJS} from "mobx";

const style = {
    p: 2,
    paddingTop: '5px',
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column'
};

const treeIconStyle = {marginRight: '8px', width: '20px', height: '20px'};
export const CardAndClientsContext = createContext();

const CardsAndClients = () => {
        const [companies, setCompanies] = useState([]);
        const [clients, setClients] = useState([]);
        const [cards, setCards] = useState([]);
        const [parkings, setParkings] = useState([]);
        const [cardTemplates, setCardTemplates] = useState([]);
        const [searchValue, setSearchValue] = useState('');
        const [treeData, setTreeData] = useState({});
        const [formData, setFormData] = useState({});
        const [selectedItem, setSelectedItem] = useState('');
        const [isNothingFound, setIsNothingFound] = useState(false);
        const [currentTarget, setCurrentTarget] = useState({
            type: '',
            id: ''
        });

        console.log(treeData, 'treedata');
        console.log(isNothingFound, 'isNothingFound');

        const [expanded, setExpanded] = useState(['root']);
        const [isNew, setIsNew] = useState(false);
        const [newGrz, setNewGrz] = useState(false);
        const [isModalOpened, setIsModalOpened] = useState(false);
        const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);
        const [isReservedPlacesModalOpened, setIsReservedPlacesModalOpened] = useState(false);
        const [isDeleteReservedPlaceOpened, setIsDeleteReservedPlaceOpened] = useState(false);
        const [grz, setGrz] = useState('');
        const [cellValue, setCellValue] = useState('');
        const [callback, setCallback] = useState(null);
        const [tabValue, setTabValue] = useState(0);
        const [clientGrzArray, setClientGrzArray] = useState([]);
        const [loading, setLoading] = useState(false);
        const [isEdit, setIsEdit] = useState(null);
        const [editType, setEditType] = useState(null);


        const handleToggle = (event, nodeIds) => {
            setExpanded(nodeIds);
        };

        const {setSnackBarSettings} = useContext(AppContext);

        useEffect(() => {
            companiesStore.getCompanies()
                .then((response) => {
                    console.log(response.data.companies);
                    setCompanies(response.data.companies);
                })
                .catch((error) => console.error(error));

            clientsStore.getClients()
                .then((response) => {
                    setClients(response.data.clients);
                    console.log(response.data.clients);
                })
                .catch((error) => console.error(error));

            cardsStore.getCards()
                .then((response) => {
                    setCards(response.data.cards);
                    console.log(response.data.cards, 'cards');
                })
                .catch((error) => console.error(error));

            // placesStore.getDetailedPlaces()
            //     .then((response) => {
            //         console.log(response.data.detailedPlaces);
            //         setParkings(response.data.detailedPlaces);
            //     })
            //     .catch((error) => console.error(error));

            cardTemplatesStore.getLongTermTemplates()
                .then((response) => {
                    console.log(response.data.cardTemplates);
                    setCardTemplates(response.data.cardTemplates);
                })
                .catch((error) => console.error(error));

        }, []);

        useEffect(() => {
            makeTreeObject();
        }, [clients, companies, cards]);

        const deleteCompanyReservePlace = () => {
            if (editType === 'company') {
                PlacesStore.deleteReservedPlaces('company', formData.companyNumber, isEdit).then((response) => {
                    if (response.status.toString()[0] === '2') {
                        setIsDeleteReservedPlaceOpened(false);
                        fetchPlaces();
                        setSnackBarSettings({
                            opened: true,
                            label: 'Удаление успешно!',
                            severity: 'success'
                        });
                    } else {
                        setSnackBarSettings({
                            opened: true,
                            label: 'Ошибка удаления! ' + response.data.errorMsg,
                            severity: 'error'
                        });
                    }
                });
            } else {
                PlacesStore.deleteReservedPlaces('client', formData.clientNumber, isEdit).then((response) => {
                    if (response.status.toString()[0] === '2') {
                        setIsDeleteReservedPlaceOpened(false);
                        PlacesStore.getReservedPlaces('company', formData.companyNumber);
                        setSnackBarSettings({
                            opened: true,
                            label: 'Удаление успешно!',
                            severity: 'success'
                        });
                    } else {
                        setSnackBarSettings({
                            opened: true,
                            label: 'Ошибка удаления!',
                            severity: 'error'
                        });
                    }
                });
            }

        }

        const CustomContent = forwardRef(function CustomContent(props, ref) {
            const {
                classes,
                className,
                label,
                nodeId,
                icon: iconProp,
                expansionIcon,
                displayIcon,
                type,
                status
            } = props;

            const {
                disabled,
                expanded,
                selected,
                focused,
                handleExpansion,
                handleSelection,
                preventSelection,
            } = useTreeItem(nodeId);

            const icon = iconProp || expansionIcon || displayIcon;

            const handleMouseDown = (event) => {
                preventSelection(event);
            };

            const handleExpansionClick = (event) => {
                handleExpansion(event);
            };

            const handleSelectionClick = (event) => {
                handleSelection(event);
                handleTreeItemClick(event.target);

            };

            return (
                <div
                    className={clsx(className, classes.root, {
                        [classes.expanded]: expanded,
                        [classes.selected]: selected,
                        [classes.focused]: focused,
                        [classes.disabled]: disabled,
                    })}
                    onMouseDown={handleMouseDown}
                    ref={ref}
                >
                    <div onClick={handleExpansionClick} className={classes.iconContainer}>
                        {icon}
                    </div>
                    {type === 'card/' ? status === 'ACTIVE' ?
                        <CheckCircleIcon color='success' sx={treeIconStyle}/> :
                        <RemoveCircleIcon color='error' sx={treeIconStyle}/> : ''}
                    {setTreeIcon(type)}
                    <Typography
                        onClick={handleSelectionClick}
                        component="div"
                        className={classes.label}
                    >
                        {label}
                    </Typography>
                </div>
            );
        });

        const CustomTreeItem = ({type, status, ...props}) => {
            return (
                <TreeItem ContentComponent={CustomContent} ContentProps={{type, status}} {...props} />
            )
        };

        const renderTree = (nodes) => {
            return (
                <CustomTreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}
                                id={nodes?.settings.type + nodes?.settings.number}
                                labelicon={setTreeIcon(nodes.settings.type)} status={nodes.status}
                                type={nodes.settings.type}>
                    {Array.isArray(nodes.children)
                        ? nodes.children.map((node) => renderTree(node))
                        : null}
                </CustomTreeItem>
            )
        };

        const setTreeIcon = (type) => {
            switch (type) {
                case 'root/':
                    return <StorageIcon/>
                case 'company/':
                    return <GroupsIcon/>;
                case 'client/':
                    return <PersonIcon/>;
                case 'card/':
                    return <CreditCardIcon/>;
            }
        }

        const fetchPlaces = () => {
            placesStore.getDetailedPlaces()
                .then((response) => {
                    console.log(response.data.detailedPlaces);
                    setParkings(response.data.detailedPlaces);
                })
                .catch((error) => console.error(error));
        }

        const makeTreeObject = () => {
            companies.forEach((item, index) => {
                companies[index] = {...item, clients: []}
            });
            clients.forEach(item => {
                item.cards = [];
                companies.forEach(company => {
                    if (item.companyNumber === company.companyNumber) {
                        company.clients.push(item);
                    }
                })
            })
            cards.forEach(item => {
                clients.forEach(client => {
                    if (item.clientNumber === client.clientNumber) {
                        client.cards.push(item);
                    }
                })
            })

            let treeDataArray = {
                id: 'root',
                name: 'Корневой каталог',
                children: [],
                settings: {
                    number: -1,
                    type: 'root/'
                },
                status: 'root'
            };
            companies.map((company, index) => {
                treeDataArray.children.push({
                    id: `company/${company.companyNumber}`,
                    name: company.companyName,
                    children: [],
                    settings: {
                        number: company.companyNumber,
                        type: 'company/'
                    },
                    status: company.status
                });
                company.clients.forEach((client, clientIndex) => {
                    treeDataArray.children[index].children.push({
                        id: `client/${client.clientNumber}`,
                        name: client.lastName + ' ' + client.firstName,
                        children: [],
                        settings: {
                            number: client.clientNumber,
                            type: 'client/'
                        },
                        status: client.status
                    });
                    client?.cards.forEach((card, cardIndex) => {
                        treeDataArray.children[index].children[clientIndex].children.push({
                            id: `card/${card.cardId}`,
                            name: card.cardNumber,
                            settings: {
                                number: card.cardId,
                                type: 'card/'
                            },
                            status: card.status
                        })
                    })
                })
            });
            setTreeData(treeDataArray);
            console.log(treeDataArray);
        }

        const filterCard = (searchValue) => {
            setIsNothingFound(false);
            let filteredCards = cards;
            if (searchValue) {
                filteredCards = cards.filter(item => {
                    if (item.lpr.find(lpr => lpr.toLowerCase() === searchValue.toLowerCase())) return true;
                });
                if (filteredCards.length !== 1) {
                    filteredCards = cards.filter(item => item.cardNumber === searchValue);
                }
            }

            if (filteredCards.length === 0) {
                setIsNothingFound(true);
            }
            if (filteredCards.length === 1) {
                if (checkCardOwnerExists(filteredCards[0])) {
                    filteredCards[0] = {...filteredCards[0], type: 'card'};
                    setFormData(filteredCards[0]);
                    setSelectedItem('card/' + filteredCards[0].cardId);
                    setExpanded([...expanded, ...findCardParents(filteredCards[0])]);
                } else {
                    setIsNothingFound(true);
                }
            }

            setSearchValue(searchValue);
        }

        const checkCardOwnerExists = (card) => {
            return clients.find(clients => clients.clientNumber === card.clientNumber);
        }

        const findCardParents = (card) => {
            const client = clients.find(clients => clients.clientNumber === card.clientNumber);
            if (!client) return;
            const company = companies.find(company => company.companyNumber === client.companyNumber);

            return ['company/' + company.companyNumber, 'client/' + client.clientNumber, 'card/' + card.cardId];
        }

        const handleTreeItemClick = async (data) => {
            const target = data.parentNode.parentNode.id.split('/');
            const type = target[0];
            const id = +target[1];

            console.log(type, id);

            setSelectedItem(type + '/' + id);

            let dataObject = {
                parkings: []
            };

            const createParkingsData = () => {
                parkings.forEach((parking, index) => {
                    parking.reservedPlaces?.includeCompanies.forEach(company => {
                        if (type === 'company' && company.companyNumber === id) {
                            dataObject.parkings.push({
                                id: parking.parkingNumber,
                                parkName: parking.parkingName,
                                currentValue: company.reserved,
                                maxValue: company.reservedTotal
                            });
                        } else {
                            if (company.includeClients) {
                                company?.includeClients.forEach(client => {
                                    if (client.clientNumber === id) {
                                        dataObject.parkings.push({
                                            id: parking.parkingNumber,
                                            parkName: parking.parkingName,
                                            currentValue: company.reserved,
                                            maxValue: company.reservedTotal
                                        })
                                    }
                                });
                            }
                        }
                    });
                });
            }

            fetchPlaces();

            switch (type) {
                case 'company':
                    createParkingsData();
                    PlacesStore.getReservedPlaces(type, id);
                    dataObject = {
                        ...dataObject,
                        type: type,
                        parkings: toJS(placesStore.itemPlaces), ...companies.find(item => item.companyNumber === id),
                    };
                    parkingsStore.setCompanyParkings(dataObject.parkings);
                    break;
                case 'client':
                    createParkingsData();
                    const client = clients.find(item => item.clientNumber === id);
                    PlacesStore.getReservedPlaces('company', client.companyNumber);
                    PlacesStore.getReservedPlaces(type, id);
                    dataObject = {...dataObject, type: type, parkings: toJS(placesStore.itemPlaces), ...client};
                    break;
                case 'card':
                    dataObject = {type: type, ...cards.find(item => item.cardId === id)}
                    break;
            }

            setTabValue(0);
            setFormData(dataObject);
            setCurrentTarget({
                type: type,
                id: id,
                ...dataObject
            });
            setIsNew(false);
        }

        const updateClients = (data, type) => {
            const index = clients.findIndex((item) => item.clientNumber === formData.clientNumber);
            let clientCards = [...clients[index].cards];
            if (type === 'card') {
                const cardIndex = clientCards.findIndex((item) => item.cardId === formData.cardId);
                clientCards[cardIndex] = data;
                clients[index].cards = clientCards;
            } else {
                clients[index] = {...data, cards: clientCards};
            }
            setClients(clients);
        }

        const updateCards = (data) => {
            const index = cards.findIndex((item) => item.cardId === formData.cardId)
            cards[index] = data;
            setCards([...cards]);
        }

        const getCard = () => {
            const index = cards.findIndex((item) => item.cardId === formData.cardId);
            return cards[index];
        }

        const getClient = () => {
            const index = clients.findIndex((item) => item.clientNumber === formData.clientNumber);
            return clients[index];
        }

        const successGrzAdd = (data) => {
            setFormData({...data, type: formData.type});
            setIsModalOpened(false);
            setGrz('');
            setIsNew(false);
            setSnackBarSettings({
                opened: true,
                label: 'Добавление успешно!',
                severity: 'success'
            })
        }

        const addGRZ = (grzValue) => {
            setLoading(true);
            let grzArray = [];
            if (formData.type === 'client') {
                grzArray = formData.lpr;
            } else {
                grzArray = getCard().lpr;
            }
            if (!checkIsInArray(grzArray, grzValue)) {
                const data = {
                    ...formData,
                    lpr: [...grzArray, grzValue],
                    timestamp: new Date().toISOString().replace('Z', '')
                };
                let grzMethod = null;
                if (formData.type === 'client') grzMethod = () => clientsStore.updateClientGRZ(data, 'client')
                else grzMethod = () => cardsStore.updateCardGRZ(data, 'card');
                grzMethod().then((response) => {
                    if (response.status === 200) {
                        console.log(response.data);
                        updateClients(response.data, formData.type);
                        if (formData.type === 'card') updateCards(response.data);
                        successGrzAdd(data);
                    } else {
                        setSnackBarSettings({
                            opened: true,
                            label: 'Добавление не удалось !' + response.data.errorMsg,
                            severity: 'error'
                        })
                    }
                })
                    .catch((error) => {
                        console.error(error)
                        setSnackBarSettings({
                            opened: true,
                            label: 'Добавление не удалось !' + error,
                            severity: 'error'
                        })
                    }).finally(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
                setSnackBarSettings({
                    opened: true,
                    label: 'Такой ГРЗ уже есть в базе!',
                    severity: 'warning'
                })
            }

        }

        const changeCardGrz = (client, oldGrz, newGrz) => {
            client.cards.forEach((card, index) => {
                let oldGrzIndex = card.lpr.findIndex(item => item === oldGrz);
                if (oldGrzIndex !== -1) {
                    client.cards[index].lpr[oldGrzIndex] = newGrz;
                    cardsStore.changeCardGRZ({
                        cardId: client.cards[index].cardId,
                        lpr: [...client.cards[index].lpr],
                        timestamp: new Date().toISOString().replace('Z', '')
                    })
                        .then((response) => {
                            console.log(response.data, 'response');
                        })
                        .catch((error) => {
                            console.error(error)
                        });
                }
            });
        }

        const editGrz = (grzValue) => {
            setLoading(true);
            const client = getClient();
            if (!checkIsInArray(client.lpr, grzValue)) {
                const grzIndex = client.lpr.findIndex(item => item === cellValue);
                const oldGrz = client.lpr[grzIndex];
                client.lpr[grzIndex] = grzValue;
                clientsStore.updateClient({...client, timestamp: new Date().toISOString().replace('Z', '')},)
                    .then((response) => {
                        console.log(response.data, 'response');
                        changeCardGrz(client, oldGrz, grzValue);
                        updateClients(response.data, formData.type);
                        successGrzAdd(response.data);
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
                        setLoading(true);
                    });
            } else {
                setSnackBarSettings({
                    opened: true,
                    label: 'Такой ГРЗ уже есть в базе!',
                    severity: 'warning'
                })
            }
        }

        console.log(parkings, 'parkings');

        return (
            <>
                <CardAndClientsContext.Provider
                    value={{
                        isNew,
                        setIsNew,
                        setIsModalOpened,
                        setSnackBarSettings,
                        setIsConfirmModalOpened,
                        setCallback,
                        tabValue,
                        setTabValue,
                        setClientGrzArray,
                        setLoading,
                        loading,
                        setIsReservedPlacesModalOpened,
                        setIsDeleteReservedPlaceOpened,
                    }}>
                    <Box sx={style}>
                        <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                            <Icon sx={{marginRight: '8px'}}>
                                <img src={ParkLogo} height={20} width={20}/>
                            </Icon>
                            <Typography id="modal-modal-title" variant="h6" component="p">
                                Клиенты и карты
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexGrow: '1', padding: '8px'}}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: '280px',
                                width: '25%',
                                paddingRight: '8px'
                            }}>
                                <AddButtonComponent currentTarget={currentTarget} setFormData={setFormData}
                                                    companies={companies} setIsNew={setIsNew}/>
                                <Box sx={{flexGrow: 1, marginBottom: '24px', marginTop: '6px'}}>
                                    <TreeView
                                        aria-label="clients and cards tree"
                                        defaultCollapseIcon={<ExpandMoreIcon/>}
                                        defaultExpandIcon={<ChevronRightIcon/>}
                                        selected={selectedItem}
                                        expanded={expanded}
                                        onNodeToggle={handleToggle}
                                        sx={{
                                            flexGrow: 1,
                                            maxHeight: 'calc(100vh - 236px)',
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                        }}
                                    >
                                        {Object.keys(treeData).length > 0 ? renderTree(treeData) : ''}
                                    </TreeView>
                                </Box>
                                <div style={{position: 'relative', minHeight: '60px'}}>
                                    <Tooltip title={!cards?.length ? 'Идет загрузка данных' : ''}>
                                        <span>
                                            <LabelAndInput value={searchValue}
                                                           onChange={(e) => filterCard(e.target.value)}
                                                           label='Поиск по базе' disabled={!cards?.length}/>
                                        </span>
                                    </Tooltip>
                                    {isNothingFound ?
                                        <p style={{
                                            textAlign: 'center',
                                            color: 'red',
                                            fontWeight: '700',
                                            position: 'absolute',
                                            top: '21px',
                                            left: 0,
                                        }}>Карта не
                                            найдена</p> : ''}
                                </div>
                            </Box>
                            <Form formData={formData} setFormData={setFormData} companies={companies}
                                  cards={cards}
                                  clients={clients} setCompanies={setCompanies} setClients={setClients}
                                  setCards={setCards} makeTreeObject={makeTreeObject} setGrz={setGrz}
                                  setIsModalOpened={setIsModalOpened} setCellValue={setCellValue}
                                  parkings={parkings} cardTemplates={cardTemplates} setIsEdit={setIsEdit}
                                  setIsDeleteReservedPlaceOpened={setIsDeleteReservedPlaceOpened} setEditType={setEditType}
                                  setNewGrz={setNewGrz}/>
                        </Box>
                        <GrzModal open={isModalOpened} setOpen={setIsModalOpened} value={grz}
                                  onChange={setGrz} handleAddButton={newGrz ? addGRZ : editGrz} isNew={newGrz}
                                  setIsNew={setNewGrz} formData={formData} items={clientGrzArray}
                                  loading={loading}/>
                        <GrzConfirmModal open={isConfirmModalOpened} setOpen={setIsConfirmModalOpened}
                                         handleConfirmButton={callback} cellValue={cellValue} loading={loading}/>
                        <ReservedPlacesModal open={isReservedPlacesModalOpened} setOpen={setIsReservedPlacesModalOpened}
                                             formData={formData} setFormData={setFormData} isEdit={isEdit}
                                             setIsEdit={setIsEdit} companies={companies}/>
                        <ConfirmModal open={isDeleteReservedPlaceOpened} setOpen={setIsDeleteReservedPlaceOpened}
                                      type={'deleteCompanyReservePlace'}
                                      handleConfirmButton={deleteCompanyReservePlace}/>
                    </Box>
                </CardAndClientsContext.Provider>
            </>
        );
    }
;

export default observer(CardsAndClients);
