import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LabelAndText from "../../../molecules/LabelAndText/LabelAndText";
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
import cardEventsStore from "../../../../store/cardEventsStore";
import cardStore from "../../../../store/cardStore";
import eventsStore from "../../../../store/eventsStore";

const InfoBlock = ({rowValue, setIsInfomodalOpened}) => {
    const [comment, setComment] = useState('');
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardType: -1
    });

    useEffect(() => {
        setComment(rowValue.commentText);
        rowValue?.uuid ? getCardInfo(rowValue.uuid) : setCardInfo({
            cardNumber: '',
            cardType: -1
        });
    }, [rowValue]);

    const getCardInfo = (uuid) => {
        cardEventsStore.getCardInfo(uuid).then(response => {
            setCardInfo({
                cardNumber: response[0].cardNumber,
                cardType: response[0].cardType,
                lpr: response[0].lpr,
            });
        });
    }

    const setCardType = (type) => {
        const types = {
            0: 'Неизвестный формат карты',
            1: 'Разовая карта',
            2: 'Карта постоянного клиента'
        }
        return types[type];
    }

    const handleInfoButtonClick = () => {
        setIsInfomodalOpened(true);
        cardStore.setQuery({cardNumber: cardInfo.cardNumber});
        cardStore.getCardInfo(cardInfo.cardType);
        eventsStore.getEventPayInfo(rowValue.deviceEventId);
    }

    return (
        <Box sx={{flexGrow: 1, pl: '24px', pr: '8px'}}>
            <Typography sx={{textAlign: 'center', mb: '8px'}} component='p' variant='p'>Информация о
                событии</Typography>
            <Stack spacing={0.7}>
                <LabelAndText label='Номер события' text={rowValue.deviceEventId} variant='small'/>
                <LabelAndText label='Номер парковки' text={rowValue.parkingNumber} variant='small'/>
                <LabelAndText label='Название парковки' text={rowValue.parking} variant='small'/>
                <LabelAndText label='Терминал' text={rowValue.terminalName} variant='small'/>
                <LabelAndText label='Устройство' text={rowValue.deviceType} variant='small'/>
                <Box sx={{display: 'flex'}}>
                    <LabelAndText label='Номер карты' text={cardInfo.cardNumber} variant='small'/>
                    {cardInfo.cardNumber
                        &&
                        <IconButton color='primary' size='small' sx={{width: '16px', height: '16px', marginLeft: '8px'}}
                                    onClick={() => handleInfoButtonClick()}>
                            <InfoIcon fontSize='inherit'/>
                        </IconButton>
                    }
                </Box>
                <LabelAndText label='Тип карты' text={cardInfo.cardNumber ? setCardType(cardInfo.cardType) : ''}
                              variant='small'/>
                <LabelAndText label='Гос номер' text={cardInfo.lpr} variant='small'/>
                <LabelAndText label='Комментарий' text={comment} variant='small' fixed='33'/>
            </Stack>
        </Box>
    );
};

export default InfoBlock;
