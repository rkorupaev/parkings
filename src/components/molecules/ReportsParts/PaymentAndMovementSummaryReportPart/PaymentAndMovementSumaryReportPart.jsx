import React, {useEffect, useState} from 'react';
import MultiSelectWithCheckbox from "../../MultiSelectWithCheckbox/MultiSelectWithCheckbox";
import reportsStore from "../../../../store/reportsStore";
import {observer} from "mobx-react-lite";

const cardTypes = [{id: 2, name: 'Карта постоянного клиента'}, {id: 1, name: 'Разовая карта'}, {
    id: 0,
    name: 'Неизвестный формат карты'
}];

const PaymentAndMovementSumaryReportPart = () => {
    const [selectedTypes, setSelectedTypes] = useState([])

    useEffect(() => {
        reportsStore.setResetPartViewFilterCallback(resetTypes);
    }, []);

    useEffect(() => {
        handleTypeSelect(selectedTypes);
    }, [selectedTypes]);

    const getTypeTitles = (typesIds) => {
        console.log(typesIds)
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
    }

    return (
        <MultiSelectWithCheckbox items={cardTypes} label='Тип карты' renderCallback={getTypeTitles}
                                 setSelectedItems={setSelectedTypes} selectedItems={selectedTypes}/>
    );
};

export default observer(PaymentAndMovementSumaryReportPart);
