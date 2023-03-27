import React, {useEffect, useState} from 'react';
import MultiSelectWithCheckbox from "../../MultiSelectWithCheckbox/MultiSelectWithCheckbox";
import Box from "@mui/material/Box";
import LabelAndSelect from "../../LabelAndSelect/LabelAndSelect";
import reportsStore from "../../../../store/reportsStore";

const cardTypes = [{id: 2, name: 'Карта постоянного клиента'}, {id: 1, name: 'Разовая карта'}, {
    id: 0,
    name: 'Неизвестный формат карты'
}];
const steps = [{number: 0, name: '1 день', value: 86400}, {number: 1, name: '1 час', value: 3600}, {
    number: 2,
    name: '10 минут',
    value: 600
},];

const PaymentAndMovementDistributionReportPart = () => {
    const [data, setData] = useState({
        timeStep: 86400,
    });
    const [currentStep, setCurrentStep] = useState(86400);
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
        setCurrentStep(86400);
    }

    const handleStepSelectChange = (field, value) => {
        setData({...data, timeStep: value});
        setCurrentStep(value);
    }

    return (
        <>
            <MultiSelectWithCheckbox items={cardTypes} label='Тип карты' renderCallback={getTypeTitles}
                                     selectedItems={selectedTypes} setSelectedItems={setSelectedTypes}/>
            <Box sx={{maxWidth: '400px'}}>
                <LabelAndSelect
                    label='Шаг'
                    items={steps}
                    currentItem={currentStep}
                    onChange={handleStepSelectChange}
                    tabWidth={300}
                    labelWidth='50px'
                />
            </Box>
        </>
    );
};

export default PaymentAndMovementDistributionReportPart;
