import React, {useEffect, useState} from 'react';
import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import LabelAndText from "../../../../molecules/LabelAndText/LabelAndText";
import LabelAndInput from "../../../../molecules/LabelAndInput/LabelAndInput";
import LabelAndMultilineText from "../../../../molecules/LabelAndMultilineText/LabelAndMultilineText";
import {toJS} from "mobx";
import usersStore from "../../../../../store/usersStore";
import {observer} from "mobx-react-lite";
import RulesTreeView from "./RulesTreeView/RulesTreeView";
import {LoadingButton} from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "../../../../molecules/ConfirmModal/ConfirmModal";
import {checkForm} from "../../../../utils/utils";

const emptyRole = {
    roleDescription: '',
    roleName: '',
    roleStatus: '',
    userRoleId: null,
}

const touched = {roleName: false,};

const getUser = (id) => {
    return toJS(usersStore.roleGroups).find(user => user.userRoleId === id);
}

const makeTreeObject = (array) => {
    const currentRules = array;
    const weightInjector = (parentMap, currentParent = "", weight = 0) => {
        if (!parentMap[currentParent]) return;
        parentMap[currentParent][1] = weight
        Object.values(parentMap[currentParent][0]).forEach((el) => {
            return weightInjector(parentMap, el.accessElement, weight + 1)
        })
    }

    const childrenInjector = (parentMap, keyUserRules) => {

        let sortedPerentMap = Object.entries(parentMap).sort((el1, el2) => el2[1][1] - el1[1][1])

        Object.entries(sortedPerentMap).forEach((el) => {
            const [accessElement, arr] = el[1]
            let children = arr[0]
            if (!(keyUserRules[accessElement])) return true
            keyUserRules[accessElement].children = children
        })

        return parentMap
    }

    const treeBuilder = (inp) => {
        let userRules = inp.userRules
        let keyUserRules = Object.fromEntries(userRules.map(item => [item.accessElement, item]));

        let parentMap = {}

        userRules.forEach((el) => {
            let parent = el.parentAccessElement
            if (!parentMap[parent]) parentMap[parent] = [[], null]
            parentMap[parent][0].push(el)
        })
        weightInjector(parentMap)
        childrenInjector(parentMap, keyUserRules)


        return keyUserRules['ROOT']
    }
    if (currentRules.userRules) {
        return treeBuilder(currentRules)?.children || [];
    }
}

const RulesForm = ({currentItem, setCurrentItem}) => {
    const [roleData, setRoleData] = useState({...emptyRole});
    const [initialData, setInitialData] = useState(getUser(currentItem.id));
    const [isTouched, setIsTouched] = useState(touched);
    const [isChanged, setIsChanged] = useState(false);
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);
    const [resetTreeCallback, setResetTreeCallback] = useState(() => {
    });
    const [initialTreeData, setInitialTreeData] = useState({});
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        if (currentItem.id === 'new_group') {
            setRoleData({...emptyRole});
            setInitialData({...emptyRole});
        } else {
            usersStore.getRoleRules(currentItem.id);
            setRoleData(getUser(currentItem.id));
            setInitialData(getUser(currentItem.id));
            setTreeData(makeTreeObject(toJS(usersStore.rules)));
        }
        setIsTouched(touched);
    }, [currentItem.id]);

    useEffect(() => {
        setIsChanged(!checkForm(initialData, roleData));
    }, [roleData]);

    const handleChange = (field, value) => {
        setRoleData({...roleData, [field]: value.trimStart()});
    }

    const createRole = () => {
        usersStore.createNewRoleGroup(roleData).then((response) => {
            setCurrentItem({id: response.userRoleId, type: 'group'});
            setIsChanged(false);
            setIsTouched({...touched});
        });
    }

    const updateRole = () => {
        const rolePromise = usersStore.updateRoleGroup(currentItem.id, roleData);

        const rulesPromise = usersStore.updateRoleGroupRules(currentItem.id);

        Promise.all([rolePromise, rulesPromise]).then(response => {
            setInitialData({...response[0]});
            setIsTouched({...touched});
            setIsChanged(false);
            usersStore.resetChangedRules();
            usersStore.setIsChanged(false);
        });
    }

    const deleteRole = () => {
        usersStore.deleteRoleGroup(currentItem.id).then(response => {
            setRoleData({...emptyRole});
            setInitialData({...emptyRole});
            setIsTouched({...touched});
            setIsChanged(false);
            setIsConfirmModalOpened(false);
            setCurrentItem(null);
        });
    }

    const resetForm = () => {
        setRoleData({...initialData});
        setIsTouched(touched);
        setTreeData(makeTreeObject(initialTreeData));
        usersStore.setIsChanged(false);
        usersStore.resetChangedRules();
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
            <Stack spacing={0.7} sx={{mt: '16px', pl: '16px'}}>
                {currentItem.id !== 'new_group' ?
                    <LabelAndText label='Состояние'
                                  text={getUser(currentItem.id)?.roleStatus === "ACTIVE" ? 'Группа доступа активна' : 'Группа доступа заблокированна'}/> :
                    <LabelAndText label='Состояние'
                                  text='Новая группа'/>}
                <LabelAndInput label='Название' value={roleData.roleName || ''}
                               onChange={(e) => handleChange('roleName', e.target.value)}
                               error={!roleData.roleName.length && isTouched.roleName}
                               helperText={(!roleData.roleName.length && isTouched.roleName) && 'Это поле обязательное'}
                               onFocus={() => setIsTouched({
                                   ...isTouched,
                                   roleName: true
                               })}/>
                <LabelAndMultilineText label='Описание' value={roleData.roleDescription || ''}
                                       onChange={(e) => handleChange('roleDescription', e.target.value)}/>
            </Stack>
            <Box sx={{display: 'flex', flexDirection: 'column', pt: '16px'}}>
                <Box sx={{display: 'flex', fontWeight: 500, borderBottom: '1px solid #1976d2', padding: '4px'}}>
                    <Typography variant='body' component='p' sx={{mr: '16px', width: '280px'}}>Название
                        свойства</Typography>
                    <Divider orientation="vertical" flexItem/>
                    <Typography variant='body' component='p' sx={{ml: '24px', mr: '40px'}}>Значение</Typography>
                </Box>
                <RulesTreeView currentItem={currentItem} setResetTreeCallback={setResetTreeCallback}
                               setInitialTreeData={setInitialTreeData} makeTreeObject={makeTreeObject}
                               treeData={treeData} setTreeData={setTreeData}/>
            </Box>
            <Box sx={{alignSelf: 'flex-end'}}>
                <LoadingButton variant='outlined' onClick={() => {
                    currentItem.id === 'new_group' ? createRole() : updateRole()
                }}
                               color='success'
                               sx={{ml: '8px'}} loading={usersStore.isLoading} loadingPosition="start"
                               size='small'
                               startIcon={<CheckCircleIcon color='inherit'/>}
                               disabled={currentItem.id === 'newUser' ? !isChanged || !roleData.roleName.length : (!isChanged && !usersStore.isChanged) || !roleData.roleName.length}
                >Сохранить</LoadingButton>
                <Button variant='outlined' onClick={() => resetForm()} color='error'
                        sx={{ml: '8px'}} startIcon={<CancelIcon color='inherit'/>} size='small'
                        disabled={!isChanged && !usersStore.isChanged}
                >Отмена</Button>
                {currentItem.id !== 'new_group' &&
                    <Button variant='outlined' onClick={() => setIsConfirmModalOpened(true)} color='info'
                            sx={{ml: '8px'}} size='small' startIcon={<DeleteIcon color='inherit'/>}>Удалить</Button>}
            </Box>
            <ConfirmModal type='deleteRole' setOpen={setIsConfirmModalOpened} open={isConfirmModalOpened}
                          handleConfirmButton={deleteRole} loading={usersStore.isLoading}/>
        </Box>
    );
};

export default observer(RulesForm);