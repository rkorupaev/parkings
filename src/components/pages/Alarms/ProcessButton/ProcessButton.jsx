import React from 'react';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HandymanIcon from "@mui/icons-material/Handyman";
import {prettifyDate} from "../../../utils/utils";
import TooltipTypography from "../../../molecules/TooltipTypography/TooltipTypography";

const ProcessButton = ({cellValue, onCLick}) => {
    const text = `Решено: ${cellValue.row.alarmEndComment} [${prettifyDate(cellValue.row.alarmTimeEnd)}]`
    return (
        <>
            {
                cellValue.row.status === 'SOLVED' ?
                    <TooltipTypography text={text}/>
                    :
                    <Button variant='outlined' startIcon={<HandymanIcon/>}
                            onClick={() => onCLick(cellValue)}
                            sx={{fontSize: '10px'}} size='small'>Обработать</Button>
            }
        </>
    );
};

export default ProcessButton;
