import React from 'react';
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

//TODO логику, если текст влезает, не показывать тултип.

const TooltipTypography = ({text = '', position = 'right', noWrap = false, style = {}}) => {
    return (
        <Tooltip title={text} placement={position}>
            <Typography variant='p' component='p'
                        sx={Object.assign({}, {
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                        }, style)} noWrap={noWrap}>{text}
            </Typography>
        </Tooltip>
    );
};

export default TooltipTypography;
