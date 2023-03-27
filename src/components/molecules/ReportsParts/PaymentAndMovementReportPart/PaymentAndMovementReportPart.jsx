import React, {useEffect, useState} from 'react';
import MultiSelectWithCheckbox from "../../MultiSelectWithCheckbox/MultiSelectWithCheckbox";
import LabelAndInput from "../../LabelAndInput/LabelAndInput";
import reportsStore from "../../../../store/reportsStore";

const cardTypes = [{id: 2, name: 'Карта постоянного клиента'}, {id: 1, name: 'Разовая карта'}, {
    id: 0,
    name: 'Неизвестный формат карты'
}];

const defaultData = {
    cardNumber: '',
    lprNumber: '',
}

const PaymentAndMovementReportPart = () => {
    const [data, setData] = useState(defaultData);
    const [selectedTypes, setSelectedTypes] = useState([]);

    useEffect(() => {
        reportsStore.setResetPartViewFilterCallback(resetTypes);
    }, []);

    useEffect(() => {
        reportsStore.setQueryParams(data);
    }, [data]);

    useEffect(() => {
        handleTypeSelect(selectedTypes);
    }, [selectedTypes]);

    const handleChange = (field, value) => {
        setData({...data, [field]: value.trimStart()});
    }

    const getTypeTitles = (typesIds) => {
        let titlesArray = [];
        typesIds.forEach(id => {
            titlesArray.push(cardTypes.find(type => type.id === id).name);
        });

        return titlesArray.join(", ");
    }

    const handleTypeSelect = (types) => {
        console.log(types, 'types');
        let queryData = {cardTypes: []};
        if (types) {
            types.forEach(id => {
                queryData.cardTypes.push({cardTypeId: id});
            });
        } else {
            queryData = {cardTypes: []};
        }

        reportsStore.setQueryParams(queryData);
    }

    const resetTypes = () => {
        setSelectedTypes([]);
        setData(defaultData);
    }

    return (
        <>
            <MultiSelectWithCheckbox items={cardTypes} label='Тип карты' renderCallback={getTypeTitles} selectedItems={selectedTypes} setSelectedItems={setSelectedTypes}/>
            <LabelAndInput label='Номер билета' labelWidth='120px' value={data.cardNumber} onChange={(e) => handleChange('cardNumber', e.target.value)}/>
            <LabelAndInput label='ГРЗ ТС' labelWidth='70px' labelMinWidth='70px' value={data.lprNumber} onChange={(e) => handleChange('lprNumber', e.target.value)}/>
        </>
    );
};

export default PaymentAndMovementReportPart;
