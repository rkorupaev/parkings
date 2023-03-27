import React, {useEffect, useState} from 'react';
import usersStore from "../../../../../../store/usersStore";
import {Box, Button, Stack} from "@mui/material";
import LabelAndText from "../../../../../molecules/LabelAndText/LabelAndText";
import LabelAndInput from "../../../../../molecules/LabelAndInput/LabelAndInput";
import LabelAndSelect from "../../../../../molecules/LabelAndSelect/LabelAndSelect";
import LabelAndMultilineText from "../../../../../molecules/LabelAndMultilineText/LabelAndMultilineText";
import {observer} from "mobx-react-lite";
import {LoadingButton} from "@mui/lab";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {toJS} from "mobx";
import {checkForm} from "../../../../../utils/utils";
import ConfirmModal from "../../../../../molecules/ConfirmModal/ConfirmModal";

const getUser = (id) => {
    return toJS(usersStore.users).find(user => user.userId === id);
}

const makeRoleSelectItems = () => {
    return toJS(usersStore.roleGroups).map(role => ({name: role.roleName, number: role.userRoleId}));
}

const emptyUser = {
    isBlocked: false,
    isPassChange: false,
    login: '',
    parkings: [],
    status: '',
    userDescription: null,
    userId: null,
    userName: '',
    userRegTime: '',
    userRoleId: '',
    userSecondname: '',
    userSurname: '',
}

const newUser = {
    login: '',
    userDescription: '',
    userName: '',
    userRoleId: '',
    userSecondname: '',
    userSurname: '',
}

const touched = {password: false, login: false, name: false, surname: false};


const UserForm = ({currentItem, setCurrentItem}) => {
    const [userData, setUserData] = useState({...emptyUser});
    const [initialData, setInitialData] = useState(getUser(currentItem.id));
    const [currentRole, setCurrentRole] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isTouched, setIsTouched] = useState(touched);
    const [loginVacant, setLoginVacant] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (currentItem.id === 'new_user') {
            setUserData({...newUser});
            setInitialData({...newUser});
            setCurrentRole('');
        } else {
            setUserData(getUser(currentItem.id));
            setInitialData(getUser(currentItem.id));
            setCurrentRole(getUser(currentItem.id).userRoleId || '');
        }
        setIsTouched(touched);
    }, [currentItem]);

    useEffect(() => {
        setIsChanged(!checkForm(initialData, userData));
        setIsError(checkIfNotEmpty());
    }, [userData]);

    useEffect(() => {
        setIsPasswordValid(validatePassword());
    }, [userData.password, confirmPassword]);

    useEffect(() => {
        setLoginVacant(checkLogin());
    }, [userData.login, isChanged]);

    const handleCheckboxClick = (field, value) => {
        setUserData({...userData, [field]: value});
    }

    const handleChange = (field, value) => {
        setUserData({...userData, [field]: value.trimStart()});
    }

    const handleLocationSelectChange = (field, value) => {
        setUserData({...userData, userRoleId: value});
        setCurrentRole(value);
    }

    const checkIfNotEmpty = () => {
        return (!userData.userName?.length || !userData.userSurname?.length || !userData.login?.length);
    }

    const createUser = () => {
        usersStore.createNewUser(userData).then((response) => {
            setCurrentItem({id: response.userId, type: 'user'});
            setConfirmPassword('');
        });
    }

    const updateUser = () => {
        let data = {...userData};
        if (userData.login === initialData.login) delete data.login;
        usersStore.updateUserInfo(currentItem.id, data).then(response => {
            setInitialData({...response});
            setIsTouched({...touched});
            setIsChanged(false);
        });
    }

    const resetForm = () => {
        setUserData({...initialData});
        setCurrentRole(initialData.userRoleId);
        setConfirmPassword('');
        setIsTouched(touched);
    }

    const deleteUser = () => {
        usersStore.deleteUserInfo(currentItem.id).then(() => {
            setUserData({...emptyUser});
            setCurrentRole('');
            setIsConfirmModalOpened(false);
            setInitialData({...emptyUser});
            setIsChanged(false);
            setIsTouched({...touched});
            setCurrentItem(null);
        });
    }

    const validatePassword = () => {
        if (confirmPassword && userData.password) return confirmPassword === userData.password;
    }

    const checkLogin = () => {
        if (isChanged && isTouched.login) {
            const index = toJS(usersStore.users).findIndex(user => user.login === userData.login);
            console.log(index, 'index')
            return index !== -1;
        }
        return false;
    }

    const showLoginHelptext = () => {
        // if (isChanged && currentItem.id !== 'newUser') {
        if (!userData.login.length && isTouched.login) return 'Это поле обязательное';
        if (loginVacant && isTouched.login) return 'Такой логин уже занят';
        // }
    }

    const showPasswordHelptext = () => {
        if (!confirmPassword.length && isTouched.password) return 'Это поле обязательное';
        if (!isPasswordValid && isTouched.password) return 'Пароль не соответствует';
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Stack spacing={0.7} sx={{mt: '16px', pl: '16px'}}>
                {currentItem.id !== 'new_user' ?
                    <LabelAndText label='Состояние'
                                  text={getUser(currentItem.id)?.isBlocked ? 'Пользователь заблокирован' : 'Пользователь активен'}/> :
                    <LabelAndText label='Состояние'
                                  text='Новый пользователь'/>}
                <LabelAndInput label='Фамилия' value={userData.userSurname || ''}
                               onChange={(e) => handleChange('userSurname', e.target.value)}
                               error={!userData.userSurname.length && isTouched.surname}
                               helperText={(!userData.userSurname.length && isTouched.surname) && 'Это поле обязательное'}
                               onFocus={() => setIsTouched({
                                   ...isTouched,
                                   surname: true
                               })}/>
                <LabelAndInput label='Имя' value={userData.userName || ''}
                               onChange={(e) => handleChange('userName', e.target.value)}
                               error={!userData.userName && isTouched.name}
                               helperText={(!userData.userName && isTouched.name) && 'Это поле обязательное'}
                               onFocus={() => setIsTouched({
                                   ...isTouched,
                                   name: true
                               })}/>
                <LabelAndInput label='Отчество' value={userData.userSecondname || ''}
                               onChange={(e) => handleChange('userSecondname', e.target.value)}/>
                <LabelAndInput label='Логин' value={userData.login}
                               onChange={(e) => handleChange('login', e.target.value)}
                               error={showLoginHelptext()}
                               helperText={showLoginHelptext()}
                               onFocus={() => setIsTouched({...isTouched, login: true})}/>
                {currentItem.id === 'new_user' && <LabelAndInput label='Пароль' value={userData.password || ''}
                                                                 onChange={(e) => handleChange('password', e.target.value)}
                                                                 type='password'/>}
                {currentItem.id === 'new_user' && <LabelAndInput label='Подтвердите пароль' value={confirmPassword}
                                                                 onChange={(e) => setConfirmPassword(e.target.value)}
                                                                 type='password'
                                                                 error={showPasswordHelptext()}
                                                                 helperText={showPasswordHelptext()}
                                                                 onFocus={() => setIsTouched({
                                                                     ...isTouched,
                                                                     password: true
                                                                 })}/>}
                <LabelAndSelect label='Роль' onChange={handleLocationSelectChange} items={makeRoleSelectItems()}
                                currentItem={currentRole}/>
                {currentItem.id !== 'new_user' &&
                    <FormControlLabel
                        control={<Checkbox checked={userData?.isBlocked || false}
                                           onChange={(e) => handleCheckboxClick('isBlocked', e.target.checked)}
                                           inputProps={{'aria-label': 'controlled'}}/>}
                        label='Заблокировать'
                        sx={{width: '48%', pl: '150px'}}/>}
                <LabelAndMultilineText label='Описание' value={userData.userDescription || ''}
                                       onChange={(e) => handleChange('userDescription', e.target.value)}/>
            </Stack>
            <Box sx={{mt: '16px', alignSelf: 'flex-end'}}>
                <LoadingButton variant='outlined' onClick={() => {
                    currentItem.id === 'new_user' ? createUser() : updateUser()
                }}
                               color='success'
                               sx={{ml: '8px'}} loading={usersStore.isLoading} loadingPosition="start"
                               size='small'
                               startIcon={<CheckCircleIcon color='inherit'/>}
                               disabled={currentItem.id === 'new_user' ? !isChanged || !isPasswordValid || currentRole === '' || loginVacant || isError : !isChanged || currentRole === '' || loginVacant || isError}>Сохранить</LoadingButton>
                <Button variant='outlined' onClick={() => resetForm()} color='error'
                        sx={{ml: '8px'}} startIcon={<CancelIcon color='inherit'/>} size='small'
                        disabled={!isChanged}>Отмена</Button>
                {currentItem.id !== 'new_user' &&
                    <Button variant='outlined' onClick={() => setIsConfirmModalOpened(true)} color='info'
                            sx={{ml: '8px'}} size='small' startIcon={<DeleteIcon color='inherit'/>}>Удалить</Button>}
            </Box>
            <ConfirmModal type='deleteUser' setOpen={setIsConfirmModalOpened} open={isConfirmModalOpened}
                          handleConfirmButton={deleteUser} loading={usersStore.isLoading}/>
        </Box>
    );
};

export default observer(UserForm);
