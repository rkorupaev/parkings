import {makeAutoObservable} from "mobx";
import UsersServices from "../services/UsersServices";

class UserStore {
    user = '';
    password = '';
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    changeUserPassword(id, data) {
        this.setIsLoading(true);
        return UsersServices.changeUserPassword(id, data)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    setUser(user) {
        this.user = user;
    }

    setPassword(password) {
        this.password = password;
    }

    setIsAuth(isAuth) {
        this.isAuth = isAuth;
    }
}

export default new UserStore();
