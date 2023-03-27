import React, {memo, useEffect} from 'react';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import TooltipTypography from "../TooltipTypography/TooltipTypography";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
            width: 300
        }
    }
};

const MultiSelectWithCheckbox = ({
                                     items,
                                     label,
                                     renderCallback,
                                     selectedItems = [],
                                     setSelectedItems,
                                     width = 300,
                                     margin = 1,
                                     disabled
                                 }) => {
    const handleChange = (event) => {
        const {
            target: {value}
        } = event;

        console.log(event.target, 'target')
        setSelectedItems(
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <>
            <FormControl sx={{m: margin, width: width}}>
                <InputLabel id="demo-multiple-checkbox-label" size='small'>{label}</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedItems}
                    onChange={handleChange}
                    input={<OutlinedInput label={label}/>}
                    renderValue={(selected) => renderCallback(selected)}
                    MenuProps={MenuProps}
                    size='small'
                    disabled={disabled}
                >
                    {items.map((item) => (
                        <MenuItem key={item.id} value={item.id} sx={{fontSize: '12px'}}>
                            <Checkbox checked={selectedItems.indexOf(item.id) > -1}/>
                            {item.name.length > 60 ? <TooltipTypography text={item.name} position='right' style={{
                                    fontWeight: 400,
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.00938em'
                                }}/> :
                                <ListItemText primary={item.name}/>}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};

export default memo(MultiSelectWithCheckbox);
