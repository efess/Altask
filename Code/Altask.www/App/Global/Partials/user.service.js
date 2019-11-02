import {UserService} from "../user.service";

export class UserServiceExt extends UserService {
    constructor(AppConfig, CommService, CrudService, Logger) {
        super(AppConfig, CrudService, Logger);
        this.CommService = CommService;
    }

    updateWithRoles(user, roles) {
        this.Logger.debug('UserService.updateRoles');
        return this.CommService.call('/User/UpdateWithRoles', null, {user: user, roles: roles});
    }

    updateSettings(id, settings) {
        this.Logger.debug("UserService.saveSettings");
        return this.CommService.call('/User/UpdateSettings', null, { id: id, settings: settings });
    }
}

UserServiceExt.$inject = ['AppConfig', 'CommService', 'CrudService', 'Logger'];
