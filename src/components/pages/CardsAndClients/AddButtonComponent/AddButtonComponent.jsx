import React, {useContext, useState} from 'react';
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {CardAndClientsContext} from "../CardsAndClients";
import {dateToISOLikeButLocal} from "../../../utils/utils";

const AddButtonComponent = ({currentTarget, setFormData, companies, setIsNew}) => {
    const [isOpened, setIsOpened] = useState(false);
    const {setSnackBarSettings, setTabValue} = useContext(CardAndClientsContext);


    let opacity;
    isOpened ? opacity = 1 : opacity = 0;
    let zIndex;
    isOpened ? zIndex = 5 : zIndex = -1;

    const setDay = (day) => {
        const Dy = new Date();
        Dy.setDate(Dy.getDate() + day);
        return Dy;
    }

    const buttonHandlerClick = (type) => {
        setIsOpened(false);
        setTabValue(0);
        let dataObject = {};

        if (type === 'root') {
            dataObject = {
                companyName: '',
                status: 'ACTIVE',
                type: 'company',
                validFrom: dateToISOLikeButLocal(new Date),
                validUntil: dateToISOLikeButLocal(setDay(10)),
                createDate: dateToISOLikeButLocal(new Date),
                companyAddress: '',
                companySite: '',
                companyMail: '',
                companyPhone: ''
            }
            setFormData(dataObject);
            setIsNew(true);
        } else {
            if (type === currentTarget.type) {
                switch (type) {
                    // case 'root':
                    //     dataObject = {
                    //         companyName: '',
                    //         status: 'ACTIVE',
                    //         type: 'company',
                    //         validFrom: dateToISOLikeButLocal(new Date),
                    //         validUntil: dateToISOLikeButLocal(setDay(10)),
                    //         createDate: dateToISOLikeButLocal(new Date),
                    //         companyAddress: '',
                    //         companySite: '',
                    //         companyMail: '',
                    //         companyPhone: ''
                    //     }
                    //     break;
                    case 'company':
                        dataObject = {
                            firstName: '',
                            lastName: '',
                            secondName: '',
                            companyNumber: currentTarget.companyNumber,
                            telephone: '',
                            email: '',
                            lpr: [],
                            type: 'client',
                            validFrom: dateToISOLikeButLocal(new Date),
                            validUntil: dateToISOLikeButLocal(setDay(10)),
                            status: 'ACTIVE',
                            description: '',
                            registrationDate: dateToISOLikeButLocal(new Date)
                        }
                        break;
                    case 'client':
                        dataObject = {
                            cardNumber: '',
                            cardTemplateNumber: 96,
                            clientNumber: currentTarget.clientNumber,
                            cardLocation: 'NEUTRAL',
                            validParkings: [],
                            lastLpr: '',
                            lpr: [],
                            status: 'ACTIVE',
                            type: 'card',
                            cardCheater: false,
                            ioControl: false,
                            lprControl: false,
                            validFrom: dateToISOLikeButLocal(new Date),
                            validUntil: dateToISOLikeButLocal(setDay(10)),
                        }
                        break;
                }
                setFormData(dataObject)
                setIsNew(true);
            } else {
                setSnackBarSettings({
                    opened: true,
                    label: 'Некорректный корневой элемент!',
                    severity: 'warning'
                })
            }
        }
    }

    const addItemButtonClick = () => {
        setIsOpened(!isOpened);
    };

    const handleClickAway = () => {
        setIsOpened(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{width: '160px', fontSize: '14px', position: 'relative'}}>
                <Button variant="outlined"
                        startIcon={<AddCircleIcon/>}
                        endIcon={<ArrowDropDownIcon color='action'/>}
                        sx={{width: '160px', marginBottom: '2px', fontSize: '14px'}}
                        size='small'
                        onClick={() => addItemButtonClick()}>Добавить</Button>
                <Stack sx={{
                    border: '1px solid #1976d2',
                    borderBottomLeftRadius: '5px',
                    borderBottomRightRadius: '5px',
                    position: 'absolute',
                    width: '158px',
                    zIndex: zIndex,
                    backgroundColor: 'white',
                    transition: 'all 0.3s',
                    opacity: opacity
                }}>
                    <Button variant="text" startIcon={<GroupsIcon/>} sx={{borderBottom: '1px solid'}}
                            onClick={() => buttonHandlerClick('root')}>Группу</Button>
                    <Button variant="text" startIcon={<PersonIcon/>} sx={{borderBottom: '1px solid'}}
                            onClick={() => buttonHandlerClick('company')}>Клиента</Button>
                    <Button variant="text" startIcon={<CreditCardIcon/>}
                            onClick={() => buttonHandlerClick('client')}>Карту</Button>
                </Stack>
            </Box>
        </ClickAwayListener>
    );
};

export default AddButtonComponent;
