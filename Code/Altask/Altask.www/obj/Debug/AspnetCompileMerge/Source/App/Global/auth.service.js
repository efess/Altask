export class AuthService {
    constructor(AppConfig, CommService, Logger) {
        this.AppConfig = AppConfig;
        this.CommService = CommService;
        this.Logger = Logger
    }

    changePassword(userName, password, password2) {
        this.Logger.debug('AuthService.changePassword');
        return this.CommService.call('/Account/ChangePassword', null, { UserName: userName, Password: password, ConfirmPassword: password2 });
    }

    isAuthenticated() {
        return !!this.AppConfig.user;
    }

    isAuthorized() {

    }

    login(userName, password) {
        this.Logger.debug('AuthService.login');
        return this.CommService.call('/Account/Login', null, { UserName: userName, Password: password });
    }

    logout() {
        this.Logger.debug('AuthService.logout');
        let userId = angular.copy(this.AppConfig.user.id);
        this.AppConfig.user = undefined;
        this.AppConfig.settings = undefined;
        this.AppConfig.save();
        this.CommService.call('/Account/Logout', null, { userId : userId });
    }

    register(userName, fullName, password, password2, roles) {
        this.Logger.debug('AuthService.register');
        return this.CommService.call('/Account/Register', null, { 
            UserName: userName, 
            FullName: fullName, 
            Password: password, 
            ConfirmPassword: password2, 
            Roles: roles 
        });
    }

    testEmail(email) {
        this.Logger.debug('AuthService.testEmail');
        return this.CommService.call('/Account/TestEmail', null, { email: email });
    }
}

AuthService.$inject = ['AppConfig', 'CommService', 'Logger'];
