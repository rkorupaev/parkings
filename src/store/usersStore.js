import {makeAutoObservable, toJS} from "mobx";
import UsersServices from "../services/UsersServices";

class usersStore {
    users = [];
    roleGroups = [];
    currentUser = [];
    isLoading = false;
    terminalChanging = {};
    rules = {};
    changedRules = [];
    isChanged = false;

    constructor() {
        makeAutoObservable(this);
    }

    getUsers() {
        this.setIsLoading(true);
        UsersServices.getUsers()
            .then((response) => {
                this.setUsers(response.data.users);
                console.log(response.data.users);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getRoleGroups() {
        this.setIsLoading(true);
        UsersServices.getRoleGroups()
            .then((response) => {
                this.setRoleGroups(response.data.userRoles);
                console.log(response.data.userRoles);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getRoleRules(id) {
        this.setIsLoading(true);
        this.resetChangedRules();
        this.setIsChanged(false);
        UsersServices.getRoleRules(id)
            .then((response) => {
                this.setRules(response.data);
                console.log(response.data);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getUserInfo(id) {
        this.setIsLoading(true);
        UsersServices.getUserInfo(id)
            .then((response) => {
                this.setCurrentUser(response.data.users[0]);
                console.log(response.data.users);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    createNewUser(data) {
        this.setIsLoading(true);
        return UsersServices.createUserInfo(data)
            .then((response) => {
                this.addUser(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    createNewRoleGroup(data) {
        this.setIsLoading(true);
        return UsersServices.createRoleGroups(data)
            .then((response) => {
                this.addGroup(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    updateUserInfo(id, data) {
        this.setIsLoading(true);
        return UsersServices.updateUserInfo(id, data)
            .then((response) => {
                this.updateUser(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    deleteUserInfo(id) {
        this.setIsLoading(true);
        return UsersServices.updateUserInfo(id, {status: "DELETED"})
            .then((response) => {
                this.deleteUser(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    addUserParking(userId, parkingId) {
        this.setIsLoading(true);
        return UsersServices.addUserParking(userId, parkingId)
            .then((response) => {
                this.updateUser(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    deleteUserParking(userId, parkingId) {
        this.setIsLoading(true);
        return UsersServices.deleteUserParking(userId, parkingId)
            .then((response) => {
                this.updateUser(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    changeUserParkingTerminalStatus(userId, parkingId, body) {
        return UsersServices.changeUserParkingTerminalStatus(userId, parkingId, body)
            .then((response) => {
                this.updateUser(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error));
    }

    updateRoleGroup(id, data) {
        this.setIsLoading(true);
        return UsersServices.updateRoleGroups(id, data)
            .then((response) => {
                this.updateRole(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    updateRoleGroupRules(id) {
        // this.setIsLoading(true);
        return UsersServices.updateRoleGroupsRules(id, this.changedRules)
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                // this.setIsLoading(false);
            });
    }

    deleteRoleGroup(id) {
        this.setIsLoading(true);
        return UsersServices.updateRoleGroups(id, {status: "DELETED"})
            .then((response) => {
                this.deleteRole(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }


    updateRoleRules(id, data) {
        this.setIsLoading(true);
        return UsersServices.updateRoleRules(id, data)
            .then((response) => {
                this.setRules(response.data);
                console.log(response.data);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    setUsers(users) {
        this.users = users;
    }

    setRoleGroups(groups) {
        this.roleGroups = groups;
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    setRules(rules) {
        this.rules = rules;
    }

    setQueryParams(params) {
        this.queryParams = params;
    }

    addUser(data) {
        let copy = toJS(this.users);
        copy.push(data);
        this.users = [...copy];
    }

    addGroup(data) {
        let copy = toJS(this.roleGroups);
        copy.push(data);
        this.roleGroups = [...copy];
    }

    updateUser(data) {
        let copy = toJS(this.users);
        let userIndex = copy.findIndex(user => user.userId === data.userId);
        copy[userIndex] = data;
        this.users = [...copy];
    }

    isTerminalChanging(terminalId, status) {
        let copy = toJS(this.terminalChanging);
        this.terminalChanging[terminalId] = status;
    }

    updateRole(data) {
        let copy = toJS(this.roleGroups);
        let roleIndex = copy.findIndex(role => role.userRoleId === data.userRoleId);
        copy[roleIndex] = data;
        this.roleGroups = [...copy];
    }

    setChangedRules(id, status) {
        let rules = toJS(this.changedRules);
        let index = rules.findIndex(rule => rule.roleAccessId === +id);
        if (index !== -1) {
            rules[index].accessValue = status;
            this.changedRules = rules;
        } else {
            this.changedRules.push({
                roleAccessId: +id,
                accessValue: status,
            });
        }
        this.isChanged = this.checkIfRulesChanged();
    }

    resetChangedRules() {
        this.changedRules = [];
    }

    setIsChanged(status) {
        this.isChanged = status;
    }

    checkIfRulesChanged() {
        let isChanged = false;
        let index = 0;
        while (!isChanged && index < this.changedRules.length) {
            let initialRuleSettings = this.rules.userRules.find(item => item.roleAccessId === this.changedRules[index].roleAccessId);
            if (initialRuleSettings.accessValue !== this.changedRules[index].accessValue) isChanged = true;
            index++;
        }
        return isChanged;
    }

    updateRule(id, status) {
        let rules = toJS(this.rules);
        let ruleIndex = rules.findIndex(rule => rule.roleAccessId === id);
        rules[ruleIndex].accessValue = status;
    }

    deleteUser(data) {
        let copy = toJS(this.users);
        let userIndex = copy.findIndex(user => user.userId === data.userId);
        copy.splice(userIndex, 1);
        this.users = [...copy];
    }

    deleteRole(data) {
        let copy = toJS(this.roleGroups);
        let roleIndex = copy.findIndex(role => role.userRoleId === data.userRoleId);
        copy.splice(roleIndex, 1);
        this.roleGroups = [...copy];
    }

}

export default new usersStore();
