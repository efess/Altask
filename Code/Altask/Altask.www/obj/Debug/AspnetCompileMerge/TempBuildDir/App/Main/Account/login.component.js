class LoginController {
    constructor(AppConfig, AuthService, SignalRService, $state, $stateParams) {
        this.AppConfig = AppConfig;
        this.AuthService = AuthService;
        this.SignalRService = SignalRService;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.init();
    }

    login(credentials) {
        this.working = "Logging in...";
        this.authenticating = true;
        this.errors = [];

        const returnToOriginalState = (response) => {
            this.SignalRService.connect();

            let user = response.data.user;
            let roles = [];

            angular.forEach(response.data.roles, (role) => {
                roles.push({ name: role.Name })
            });

            this.AppConfig.user = {
                id: user.Id,
                fullName: user.FullName,
                userName: user.UserName,
                roles: roles,
            };

            this.AppConfig.clientId = response.data.clientId;
            this.AppConfig.loadSettings(user.Settings);
            this.AppConfig.save();
            let state = this.returnTo.state();
            let params = this.returnTo.params();
            let options = Object.assign({}, this.returnTo.options(), { reload: true });
            this.$state.go(state, params, options);
        };

        const showError = (error) => {
            this.errors = error.data.errors;
        };

        this.AuthService.login(credentials.userName, credentials.password)
        .then(returnToOriginalState)
        .catch(showError)
        .finally(() => {
            this.authenticating = false;
            this.working = "";
        });
    }

    init() {
        this.working = "";
        this.credentials = {
            userName: this.$stateParams.credentials ? (this.$stateParams.credentials.userName || "") : "",
            password: "",
        };

        this.errors = [];

        $(document).ready(function () {
            $('input').keypress(function (e) {
                if (e.keyCode == 13)
                    $('button').click();
            });
        });
    }
}

LoginController.$inject = ['AppConfig', 'AuthService', 'SignalRService', '$state', '$stateParams'];


// This component renders a faux authentication UI
//
// It prompts for the userName/password (and gives hints with bouncy arrows)
// It shows errors if the authentication failed for any reason.
export const login = {
    bindings: { returnTo: '<' },
    controller: LoginController,
    templateUrl: "Views/Account/login.html",
};
