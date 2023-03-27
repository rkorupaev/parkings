import React, {forwardRef, useEffect, useState} from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {Box, Typography} from "@mui/material";
import {toJS} from "mobx";
import TreeItem, {useTreeItem} from "@mui/lab/TreeItem";
import clsx from "clsx";
import TreeView from "@mui/lab/TreeView";
import {observer} from "mobx-react-lite";
import usersStore from "../../../../../../store/usersStore";
import TreeRadioGroup from "./TreeRadioGroup/TreeRadioGroup";
import Stack from "@mui/material/Stack";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import Tooltip from "@mui/material/Tooltip";

const RulesTreeView = ({
                           currentItem,
                           setInitialTreeData,
                           makeTreeObject,
                           treeData,
                           setTreeData
                       }) => {
    const [expanded, setExpanded] = useState(['']);

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    useEffect(() => {
        setTreeData(makeTreeObject(toJS(usersStore.rules)));
        setExpanded(['']);
    }, [currentItem.id]);

    useEffect(() => {
        setTreeData(makeTreeObject(toJS(usersStore.rules)));
        setInitialTreeData(toJS(usersStore.rules));
        setExpanded(['']);
    }, [usersStore.rules]);

    const proceedRadioClick = (id, status) => {

        let treeItem = null;
        let copy = structuredClone(treeData);

        const childrenChanger = (item) => {
            console.log(item, 'item');
            item.accessValue = status;
            if (item.children) {
                item.children.forEach(children => childrenChanger(children));
            }
        }

        const updateChildren = (array) => {
            array.forEach(item => {
                if (item.roleAccessId === +id) {
                    treeItem = item
                    childrenChanger(treeItem);
                } else {
                    if (item.children) {
                        updateChildren(item.children);
                    }
                }
            });
        }
        const parents = [];

        const getParentsById = (id, data) => {
            const isFoundChild = (id, data) => {
                if (data.find(item => item.roleAccessId == id)) {
                    return true;
                } else {
                    for (let item of data) {
                        if (item.children)
                            if (isFoundChild(id, item.children)) {
                                parents.push(item);
                                return true;
                            }
                    }
                    return false;
                }
            }

            if (data.find(item => item.roleAccessId == id))
                return [];
            else {
                for (let item of data) {
                    if (item.children)
                        if (isFoundChild(id, item.children)) {
                            parents.push(item);
                            return parents;
                        }
                }
            }
        }

        const updateParents = (parents) => {
            let predecessorIndex = null;
            parents.forEach((parent, index) => {
                let indexInCopy = copy.findIndex(item => item.roleAccessId === parent.roleAccessId);
                if (indexInCopy !== -1) {
                    predecessorIndex = indexInCopy;
                    parents.splice(index, 1);
                }
            });

            copy[predecessorIndex].accessValue = 'CUSTOM';

            const changeAccess = (array) => {
                parents.forEach(parent => {
                    let index = array.findIndex(item => item.roleAccessId === parent.roleAccessId);
                    if (index !== -1) predecessorIndex = index;
                    parents.splice(index, 1);
                });

                console.log(predecessorIndex, 'predecessor index');
                console.log(parents, 'parents parents');
                console.log(array, 'array parents');

                if (array[predecessorIndex]?.children) {
                    array[predecessorIndex].accessValue = 'CUSTOM';
                }

                if (parents.length) {
                    changeAccess(array[predecessorIndex].children);
                }
            }
            if (parents.length) {
                changeAccess(copy[predecessorIndex].children);
            }
        }

        getParentsById(id, copy);
        console.log(parents, 'parents');

        updateChildren(copy);
        if (parents.length) updateParents(parents);

        console.log(copy, 'copy');
        setTreeData(copy);
    }

    console.log(treeData, 'treedata');

    const CustomContent = forwardRef(function CustomContent(props, ref) {
        const {
            classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon, status, isParent
        } = props;

        const {
            disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection,
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

        return (<div
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
                <Tooltip title={label.length > 30 ? label : ''} placement={'top'}>
                    <Typography
                        onClick={handleSelectionClick}
                        component="div"
                        className={classes.label}
                        sx={{
                            maxWidth: '270px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                        }}
                    >
                        {label}
                    </Typography>
                </Tooltip>
                <TreeRadioGroup nodeId={nodeId} status={status} isParent={isParent}
                                proceedRadioClick={proceedRadioClick}/>
            </Box>
        </div>)
    });

    const handleTreeItemClick = (data) => {
        console.dir(data, 'data');
        const target = data.parentNode.parentNode.parentNode.id;
        console.log(target, 'target');
    }

    const CustomTreeItem = ({status, isParent, ...props}) => {
        return (<TreeItem ContentComponent={CustomContent} ContentProps={{status, isParent}} {...props} />)
    };

    const renderTree = (nodes) => {
        return (<CustomTreeItem key={nodes.roleAccessId} nodeId={'' + nodes.roleAccessId} label={nodes.accessName}
                                status={nodes?.accessValue} isParent={!!nodes?.children}
                                id={'' + nodes.roleAccessId}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </CustomTreeItem>)
    };

    return (<Box sx={{flexGrow: 1, marginBottom: '12px', marginTop: '6px'}}>
        <TreeView
            aria-label="clients and groups tree"
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            expanded={expanded}
            onNodeToggle={handleToggle}
            sx={{
                flexGrow: 1,
                maxHeight: 'calc(100vh - 375px)',
                minHeight: 'calc(100vh - 375px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                borderBottom: '1px solid #1976d2'
            }}
        >
            {treeData?.length && currentItem?.id !== 'newGroup' ? treeData.map(item => renderTree(item)) :
                <Stack height="40vh" alignItems="center" justifyContent="center" flexDirection="row">
                    <Typography variant='h4' component='p' sx={{fontSize: '22px', marginRight: '12px'}}>
                        Правил еще не создано
                    </Typography>
                    <AnnouncementIcon color='warning'/>
                </Stack>}
        </TreeView>
    </Box>);
};

export default observer(RulesTreeView);
