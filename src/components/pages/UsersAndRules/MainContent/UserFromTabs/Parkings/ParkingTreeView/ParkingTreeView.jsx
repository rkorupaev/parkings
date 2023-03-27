import React, {forwardRef, useEffect, useState} from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {Box, Button, Chip, Typography} from "@mui/material";
import {toJS} from "mobx";
import TreeItem, {useTreeItem} from "@mui/lab/TreeItem";
import clsx from "clsx";
import TreeView from "@mui/lab/TreeView";
import {observer} from "mobx-react-lite";
import usersStore from "../../../../../../../store/usersStore";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import TerminalIcon from '@mui/icons-material/Terminal';

const ParkingTreeView = ({currentItem, updateAvailableParkings}) => {
    const [treeData, setTreeData] = useState({});
    const [expanded, setExpanded] = useState(['']);

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    useEffect(() => {
        makeTreeObject();
        setExpanded(['']);
    }, [currentItem.id]);

    useEffect(() => {
        makeTreeObject();
    }, [usersStore.users]);

    const makeTreeObject = () => {
        const user = toJS(usersStore.users).find(user => user.userId === currentItem.id);

        let treeDataArray = [];

        if (user.parkings.length) {
            user.parkings.forEach((item, parkingIndex) => {
                treeDataArray.push({
                    id: `parking/${item.parkingId}`,
                    name: `${item.parkingName}`,
                    children: [],
                    settings: {
                        number: item.parkingId,
                        type: 'parking/'
                    },
                });
                if (item.terminals.length) {
                    item.terminals.forEach((terminal, index) => {
                        treeDataArray[parkingIndex].children.push({
                            id: `terminal/${terminal.terminalId}`,
                            name: `${terminal.terminalName}`,
                            children: [],
                            settings: {
                                number: terminal.terminalId,
                                type: 'terminal/'
                            },
                            status: terminal.accepted,
                            parent: item.parkingId,
                        })
                    })
                }
            })
        }

        setTreeData(treeDataArray);
        console.log(treeDataArray, 'tree');
    }

    const setTreeIcon = (type) => {
        switch (type) {
            case 'parking/':
                return <LocalParkingIcon/>;
            case 'terminal/':
                return <TerminalIcon/>;
        }
    }

    const changeTerminalStatus = (userId, parkingId, parentId, status) => {
        const terminalId = parentId.split('/')[1];
        let promise = usersStore.changeUserParkingTerminalStatus(userId, parkingId, {
            terminals: [
                {terminalId: +terminalId, accepted: !status},
            ]
        });
    }

    const onDeleteParkingButtonHandler = (id, nodeId) => {
        usersStore.deleteUserParking(id, nodeId).then(() => {
            updateAvailableParkings();
        });
    }

    const checkIsTerminalChanging = (nodeId) => {
        let id = nodeId.split('/')[1];
        console.log(toJS(usersStore.terminalChanging[id]));
        if (toJS(usersStore.terminalChanging[id])) return toJS(usersStore.terminalChanging[id]);
        return false;
    }

    const CustomContent = forwardRef(function CustomContent(props, ref) {
        const {
            classes,
            className,
            label,
            nodeId,
            icon: iconProp,
            expansionIcon,
            displayIcon,
            type,
            status,
            parent
        } = props;

        const {
            disabled,
            expanded,
            selected,
            focused,
            handleExpansion,
            handleSelection,
            preventSelection,
        } = useTreeItem(nodeId);

        const icon = iconProp || expansionIcon || displayIcon;

        const handleMouseDown = (event) => {
            preventSelection(event);
        };

        const handleExpansionClick = (event) => {
            handleExpansion(event);
        };

        const handleSelectionClick = (event) => {
            handleSelection(event);
            handleTreeItemClick(event.target);
        };

        if (type === 'parking/') {
            return (
                <div
                    className={clsx(className, classes.root, {
                        [classes.expanded]: expanded,
                        [classes.selected]: selected,
                        [classes.focused]: focused,
                        [classes.disabled]: disabled,
                    })}
                    onMouseDown={handleMouseDown}
                    ref={ref}
                    style={{marginBottom: '4px'}}
                >
                    <div onClick={handleExpansionClick} className={classes.iconContainer}>
                        {icon}
                    </div>
                    <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'center'}}>
                        {setTreeIcon(type)}
                        <Typography
                            onClick={handleSelectionClick}
                            component="div"
                            className={classes.label}
                        >
                            {label}
                        </Typography>
                        <Button variant='outlined' onClick={() => onDeleteParkingButtonHandler(currentItem.id, nodeId)}
                                startIcon={<DeleteIcon color='inherit'/>} size='small'
                                sx={{mr: '20px', minWidth: '108px'}}>Удалить</Button>
                    </Box>
                </div>
            )
        }

        return (
            <div
                className={clsx(className, classes.root, {
                    [classes.expanded]: expanded,
                    [classes.selected]: selected,
                    [classes.focused]: focused,
                    [classes.disabled]: disabled,
                })}
                onMouseDown={handleMouseDown}
                ref={ref}
                style={{marginBottom: '4px'}}
            >
                <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'center',}}>
                    {setTreeIcon(type)}
                    <Typography
                        component="div"
                        className={classes.label}
                    >
                        {label}
                    </Typography>
                    <Chip clickable label={status ? 'Доступен' : 'Недоступен'} color={status ? 'success' : 'warning'}
                          size='small'
                          sx={{mr: '20px', minWidth: '108px'}}
                          onClick={() => changeTerminalStatus(currentItem.id, parent, nodeId, status)}
                    />
                </Box>
            </div>
        )
    });

    const handleTreeItemClick = (data) => {
        const target = data.parentNode.parentNode.id.split('/');
        const type = target[0];
        const id = +target[1];
    }

    const CustomTreeItem = ({type, status, parent, ...props}) => {
        return (
            <TreeItem ContentComponent={CustomContent} ContentProps={{type, status, parent}} {...props} />
        )
    };

    const renderTree = (nodes) => {
        return (
            <CustomTreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}
                            id={nodes?.settings.type + nodes?.settings.number}
                            type={nodes.settings.type} labelicon={setTreeIcon(nodes.settings.type)}
                            status={nodes?.status} parent={nodes?.parent}>
                {Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null}
            </CustomTreeItem>
        )
    };

    return (
        <Box sx={{flexGrow: 1, marginBottom: '12px', marginTop: '6px'}}>
            <TreeView
                aria-label="clients and groups tree"
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
                expanded={expanded}
                onNodeToggle={handleToggle}
                sx={{
                    flexGrow: 1,
                    maxHeight: 'calc(100vh - 275px)',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                {treeData.length ? treeData.map(item => renderTree(item)) : ''}
            </TreeView>
        </Box>
    );
};

export default observer(ParkingTreeView);
