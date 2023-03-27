import React, {useEffect, useState} from 'react';
import LabelAndSelect from "../../LabelAndSelect/LabelAndSelect";
import Box from "@mui/material/Box";
import reportsStore from "../../../../store/reportsStore";

const steps = [{number: 0, name: '1 день', value: 86400}, {number: 1, name: '1 час', value: 3600}, {number: 2, name: '10 минут', value: 600},];
const types = [{number: 0, name: 'Общее количество', value: 10}, {number: 1, name: 'Нерезервируемые', value: 20}, {
    number: 2,
    name: 'Резервируемые',
    value: 30,
},
    // {number: 3, name: 'Резервируемые - компании', value: 31,}, {number: 4, name: 'Резервируемые - индивидуальные клиенты', value: 32,},
];

const CapacityReportPart = () => {

    const [data, setData] = useState({
        timeStep: 86400,
        parkingPlaceType: 10,
    });
    const [currentStep, setCurrentStep] = useState(86400);
    const [currentType, setCurrentType] = useState(10);

    useEffect(() => {
        reportsStore.setResetPartViewFilterCallback(resetData);
    }, []);

    useEffect(() => {
        reportsStore.setQueryParams(data);
    }, [data]);

    const handleStepSelectChange = (field, value) => {
        setData({...data, timeStep: value});
        setCurrentStep(value);
    }

    const handlegTypeSelectChange = (field, value) => {
        setData({...data, parkingPlaceType: value});
        setCurrentType(value);
    }

    const resetData = () => {
        setCurrentStep(86400);
        setCurrentType(10);
    }

    return (
        <>
            <Box sx={{maxWidth: '400px', mixWidth: '400px', ml: '16px'}}>
                <LabelAndSelect
                    label='Шаг'
                    items={steps}
                    currentItem={currentStep}
                    onChange={handleStepSelectChange}
                    tabWidth={300}
                    labelWidth='50px'
                />
            </Box>
            <Box sx={{maxWidth: '400px', mixWidth: '400px', ml: '16px'}}>
                <LabelAndSelect
                    label='Тип счетчика'
                    items={types}
                    currentItem={currentType}
                    onChange={handlegTypeSelectChange}
                    tabWidth={300}
                    labelWidth='120px'
                />
            </Box>
        </>
    );
};

export default CapacityReportPart;
