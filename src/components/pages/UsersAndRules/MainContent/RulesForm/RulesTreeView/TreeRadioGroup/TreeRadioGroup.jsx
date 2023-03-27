import React, {useState} from 'react';
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {observer} from "mobx-react-lite";
import usersStore from "../../../../../../../store/usersStore";

const TreeRadioGroup = ({nodeId, status, isParent, proceedRadioClick}) => {
    const [value, setValue] = useState(status);

    const handleRadioChange = (nodeId, status) => {
        setValue(status);
        console.log(nodeId, status, 'radio click')
        proceedRadioClick(nodeId, status);
        usersStore.setChangedRules(nodeId, status);
    }

    return (
        <FormControl sx={{marginLeft: '16px'}}>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={(event, value) => handleRadioChange(nodeId, value)}
            >
                <FormControlLabel value="HIDE" control={<Radio size='small'/>} label="Скрыто"/>
                <FormControlLabel value="SHOW" control={<Radio size='small'/>} label="Видимо"/>
                <FormControlLabel value="DISABLE" control={<Radio size='small'/>} label="Заблокировано" />
                <FormControlLabel value="CUSTOM" control={<Radio size='small'/>} label="Индивидуально" disabled/>
            </RadioGroup>
        </FormControl>
    );
};

export default observer(TreeRadioGroup);