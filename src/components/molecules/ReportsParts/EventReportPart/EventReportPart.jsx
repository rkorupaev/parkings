import React, {useEffect, useState} from 'react';
import MultiSelectWithCheckbox from "../../MultiSelectWithCheckbox/MultiSelectWithCheckbox";
import {toJS} from "mobx";
import eventsStore from "../../../../store/eventsStore";
import {observer} from "mobx-react-lite";
import reportsStore from "../../../../store/reportsStore";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";

const EventReportPart = (props) => {
    const [types, setTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isAllTypesChecked, setIsAllTypesChecked] = useState(false);


    useEffect(() => {
        reportsStore.setResetPartViewFilterCallback(resetTypes);
    }, []);

    useEffect(() => {
        setTypes(createSelectEventTypesItems());
    }, [eventsStore.eventTypes]);

    useEffect(() => {
        const queryEvents = selectedTypes.map(id => ({deviceEventTypeId: id}));
        reportsStore.setQueryParams({eventTypes: queryEvents});
    }, [selectedTypes]);

    useEffect(() => {
        isAllTypesChecked ? setSelectedTypes(eventsStore.getAllEventTypesIds()) : setSelectedTypes([]);
    }, [isAllTypesChecked]);

    //FIXME вынести список типов в константу
    const createSelectEventTypesItems = () => {
        return toJS(eventsStore.eventTypes).map(type => ({
            id: type.deviceEventTypeId,
            name: `[${type.deviceEventTypeId}] ` + type.deviceEventTypeDescription
        }))
    }

    const getEventTypesTitles = (typesIds) => {
        let titlesArray = [];
        typesIds.forEach(id => {
            titlesArray.push(eventsStore.eventTypes.find(type => type.deviceEventTypeId === id).deviceEventTypeDescription);
        });
        return titlesArray.join(", ");
    }

    const resetTypes = () => {
        setSelectedTypes([]);
    }

    return (
        <>
            <MultiSelectWithCheckbox items={types}
                                     label='Тип события'
                                     renderCallback={getEventTypesTitles}
                                     setSelectedItems={setSelectedTypes}
                                     selectedItems={selectedTypes}
                                     width={600}
            />
            <Tooltip title={isAllTypesChecked ? "Снять выделение со всех терминалов" : "Выбрать все терминалы"} placement='top'>
                <Checkbox onChange={() => setIsAllTypesChecked(!isAllTypesChecked)}
                          checked={isAllTypesChecked} disabled={!types.length}/>
            </Tooltip>
        </>
    );
};

export default observer(EventReportPart);
