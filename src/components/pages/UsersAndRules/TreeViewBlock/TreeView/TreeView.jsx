import React, {forwardRef, useEffect, useState} from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {Box, Typography} from "@mui/material";
import {toJS} from "mobx";
import usersStore from "../../../../../store/usersStore";
import TreeItem, {useTreeItem} from "@mui/lab/TreeItem";
import clsx from "clsx";
import StorageIcon from "@mui/icons-material/Storage";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import TreeView from "@mui/lab/TreeView";
import {observer} from "mobx-react-lite";

const TreeViewList = ({setCurrentItem, expanded, setExpanded}) => {
    const [treeData, setTreeData] = useState({});

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    useEffect(() => {
        makeTreeObject();
    }, [usersStore.users]);

    useEffect(() => {
        makeTreeObject();
    }, [usersStore.roleGroups]);

    const makeTreeObject = () => {
        let treeDataArray = {
            id: 'root',
            name: 'Корневой каталог',
            children: [{
                id: `module/users`,
                name: `Модуль пользователей`,
                children: [],
                settings: {
                    number: -11,
                    type: 'module/'
                },
                status: `module`
            },
                {
                    id: `module/groups`,
                    name: `Модуль групп доступа`,
                    children: [],
                    settings: {
                        number: -12,
                        type: 'module/'
                    },
                    status: `module`
                }
            ],
            settings: {
                number: -1,
                type: 'root/'
            },
            status: 'root'
        };

        if (toJS(usersStore.users)) {
            toJS(usersStore.users).forEach((item, index) => {
                treeDataArray.children[0].children.push({
                    id: `user/${index}`,
                    name: `${item.userSurname} ${item.userName} (${item.login})`,
                    children: [],
                    settings: {
                        number: item.userId,
                        type: 'user/'
                    },
                    status: item.status
                });
            })

            toJS(usersStore.roleGroups).forEach((item, index) => {
                treeDataArray.children[1].children.push({
                    id: `group/${index}`,
                    name: item.roleName,
                    children: [],
                    settings: {
                        number: item.userRoleId,
                        type: 'group/'
                    },
                    status: item.roleStatus
                });
            })
        }

        setTreeData(treeDataArray);
        console.log(treeDataArray, 'tree');
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
            status
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
            switch (type) {
                case 'root/':
                    handleExpansionClick(event);
                    break;
                case 'module/':
                    handleExpansionClick(event);
                    break;
                default:
                    handleSelection(event);
                    handleTreeItemClick(event.target);
                    break;
            }
        };

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
            >
                <div onClick={handleExpansionClick} className={classes.iconContainer}>
                    {icon}
                </div>
                {setTreeIcon(type)}
                <Typography
                    onClick={handleSelectionClick}
                    component="div"
                    className={classes.label}
                >
                    {label}
                </Typography>
            </div>
        );
    });

    const handleTreeItemClick = (data) => {
        const target = data.parentNode.parentNode.id.split('/');
        const type = target[0];
        const id = +target[1];

        console.log(type, id)

        setCurrentItem({id: id, type: type});
    }

    const CustomTreeItem = ({type, status, ...props}) => {
        return (
            <TreeItem ContentComponent={CustomContent} ContentProps={{type, status}} {...props} />
        )
    };

    const renderTree = (nodes) => {
        return (
            <CustomTreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}
                            id={nodes?.settings.type + nodes?.settings.number}
                            labelicon={setTreeIcon(nodes.settings.type)} status={nodes.status}
                            type={nodes.settings.type}>
                {Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null}
            </CustomTreeItem>
        )
    };

    const setTreeIcon = (type) => {
        switch (type) {
            case 'root/':
                return <StorageIcon/>
            case 'module/':
                return <ViewModuleIcon/>;
            case 'user/':
                return <PersonIcon/>;
            case 'group/':
                return <ManageAccountsIcon/>;
        }
    }

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
                    maxHeight: 'calc(100vh - 171px)',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                {Object.keys(treeData).length > 0 ? renderTree(treeData) : ''}
            </TreeView>
        </Box>
    );
};

export default observer(TreeViewList);
