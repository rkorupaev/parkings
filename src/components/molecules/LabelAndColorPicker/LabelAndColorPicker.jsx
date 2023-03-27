import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {SketchPicker, CustomPicker, PhotoshopPicker} from "react-color";
import Typography from "@mui/material/Typography";

const LabelAndColorPicker = ({label, color, onChange}) => {
    const [colorPickerState, setColorPickerState] = useState({
        displayColorPicker: false,
        color: {
            r: '255',
            g: '255',
            b: '255',
            a: '1',
        }
    });

    useEffect(() => {
        setColorPickerState({...colorPickerState, color: {a: '1', ...hexToRGB(color)}})
    }, [color])

    const handleClick = () => {
        setColorPickerState({...colorPickerState, displayColorPicker: !colorPickerState.displayColorPicker});
    }

    const handleClose = () => {
        setColorPickerState({...colorPickerState, displayColorPicker: false});
    }

    const handleChange = (color) => {
        onChange(color.hex);
        setColorPickerState({...colorPickerState, color: color.rgb})
    };

    const hexToRGB = (h) => {
        let r = 0, g = 0, b = 0;

        // 3 digits
        if (h.length == 4) {
            r = +("0x" + h[1] + h[1]);
            g = +("0x" + h[2] + h[2]);
            b = +("0x" + h[3] + h[3]);

            // 6 digits
        } else if (h.length == 7) {
            r = +("0x" + h[1] + h[2]);
            g = +("0x" + h[3] + h[4]);
            b = +("0x" + h[5] + h[6]);
        }

        return {r: '' + r, g: '' + g, b: '' + b}
    }

    const styles = {
        color: {
            width: '36px',
            height: '14px',
            borderRadius: '5px',
            background: `rgba(${colorPickerState.color.r}, ${colorPickerState.color.g}, ${colorPickerState.color.b}, ${colorPickerState.color.a})`,
        },
        swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '5px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
        },
        popover: {
            position: 'absolute',
            zIndex: '2',
        },
        cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        },
        border: {
            border: '1px solid #bfbfbf',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '5px',
            transitionDuration: '0.1s',
            '&:hover': {border: '1px solid #767676'}
        }
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant="p" component="p" sx={{width: '150px', minWidth: '150px'}}>
                {label} :
            </Typography>
            <Box sx={styles.border}>
                <Box style={styles.swatch} onClick={() => handleClick()}>
                    <Box style={styles.color}/>
                </Box>
                {colorPickerState.displayColorPicker ? <Box style={styles.popover}>
                    <Box style={styles.cover} onClick={() => handleClose()}/>
                    <SketchPicker color={colorPickerState.color} onChangeComplete={(color) => handleChange(color)} disableAlpha={true}/>
                </Box> : null}
            </Box>
        </Box>
    );
};

export default LabelAndColorPicker;
