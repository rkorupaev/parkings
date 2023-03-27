import React from 'react';
import {Box} from "@mui/material";
import {observer} from "mobx-react-lite";
import TreeViewList from "./TreeView/TreeView";
import AddButtons from "./AddButtons/AddButtons";

const TreeViewBlock = ({setCurrentItem, expanded, setExpanded}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '280px',
            width: '280px',
            paddingTop: '16px',
            paddingRight: '8px'
        }}>
            <AddButtons setCurrentItem={setCurrentItem}/>
            <Box sx={{flexGrow: 1, marginTop: '6px', borderRight: '1px solid #1976d2', paddingRight: '8px'}}>
                <TreeViewList setCurrentItem={setCurrentItem} expanded={expanded} setExpanded={setExpanded}/>
            </Box>
        </Box>
    );
};

export default observer(TreeViewBlock);
