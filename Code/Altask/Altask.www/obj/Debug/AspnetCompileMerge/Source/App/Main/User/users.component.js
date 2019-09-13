import { relativeDate } from "../../Utility/utility";

// The controller for the `users` component
class UsersController {
    constructor(AppConfig, AuthService, DialogService, UserService, RoleService, $scope, $compile) {
        this.AppConfig = AppConfig;
        this.AuthService = AuthService;
        this.DialogService = DialogService;
        this.UserService = UserService;
        this.RoleService = RoleService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.dirty = false;

        this.clearUser();
        this.init();
    }

    addCustomProperty() {
        let $tbody = $('.table-metadata > tbody');

        $tbody.append(this.$compile(`<tr>
            <td class="form-group has-feedback has-error">
                <input class="form-control" type="text" req-data="Custom property name" rd-selector="td" rd-errors="$ctrl.errors" rd-change="$ctrl.markDirty()" />
                <span class="form-control-feedback glyphicon glyphicon-remove"></span>
            </td>
            <td class="form-group has-feedback has-error">
                <input class="form-control" type="text" req-data="Custom property value" rd-selector="td" rd-errors="$ctrl.errors" rd-change="$ctrl.markDirty()" />
                <span class="form-control-feedback glyphicon glyphicon-remove"></span>
            </td>
            <td class="remove-metadata-property">
                <span uib-tooltip="Remove Custom Property" ng-click="$ctrl.removeCustomProperty($event)" ng-disabled="!$ctrl.isRowSelected()"><i class="fa fa-times" aria-hidden="true"></i></span>
            </td>
        </tr>`)(this.$scope));

        this.markDirty();
        this.errors.push({ control: $tbody.children("tr:last").children("td:eq(0)").children("input")[0], error: "Custom property name is required." });
        this.errors.push({ control: $tbody.children("tr:last").children("td:eq(1)").children("input")[0], error: "Custom property value is required." });
    }

    clearUser() {
        $(".table-metadata > tbody > tr").remove();
        this.$scope.$evalAsync(() => {
            this.copiedUser = {
                Id: null,
                Active: false,
                UserName: "",
                FullName: "",
                EmailAddress: "",
                SmsAddress: "",
                MobilePhone: "",
                ReceiveEmail: false,
                ReceiveText: false,
                Metadata: { Properties: [] }
            }
        });
    }

    changePassword() {
        let scope = this.$scope.$new();
        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the user can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Password:</label>
                <div class="col-sm-9">
                    <input id="new_user_password" class="form-control" type="password" req-data="Password" rd-errors="$ctrl.modalErrors" rd-pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{6,50}$" rd-pattern-msg="Passwords must be at least six characters in length including both lower and uppercase characters, one special character (e.g., ~\`!@#$%^&*()-_+={}[]|\\;:<>,./?) and at least one numeric character." />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Confirm Password:</label>
                <div class="col-sm-9">
                    <input id="new_user_password2" class="form-control" type="password" req-data="Confirm Password" rd-errors="$ctrl.modalErrors" rd-match="new_user_password" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({ control: $("#new_user_password", body)[0], error: "Password is required." });
        this.modalErrors.push({ control: $("#new_user_password2", body)[0], error: "Confirm Password is required." });

        this.DialogService.dialog("Change Password", body, null, () => {
            let password = $("#new_user_password").val();
            let password2 = $("#new_user_password2").val();

            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving User...";
                this.AuthService.changePassword(this.copiedUser.UserName, password, password2)
                    .then((response) => {
                        this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    createNew() {
        let scope = this.$scope.$new();
        let roleOptions = ``;
        this.newRoles = [];
        let index = 0;

        angular.forEach(this.roles, (role) => {
            this.newRoles.push({ Id: role.Id, Name: role.Name, Active: false });

            roleOptions += `<div class="form-group">
                <label class="control-label col-sm-3">Is ` + role.Name + `?</label>
                <div class="col-sm-9 btn-group" role="group">
                    <button type="button" class="btn btn-default btn-yes-no" ng-class="$ctrl.newRoles[` + index + `].Active ? 'active' : ''" ng-click="$ctrl.newRoles[` + index + `].Active = true;">Yes</button>
                    <button type="button" class="btn btn-default btn-yes-no" ng-class="!$ctrl.newRoles[` + index + `].Active ? 'active' : ''" ng-click="$ctrl.newRoles[` + index + `].Active = false;">No</button>
                </div>
            </div>`;

            index++;
        });

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the user can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">User Name:</label>
                <div class="col-sm-9">
                    <input id="new_user_name" class="form-control" type="text" req-data="User Name" rd-errors="$ctrl.modalErrors" unq-name un-err-model="$ctrl.modalErrors" un-field="{{'User Name'}}" un-other-func="$ctrl.notUniqueModal()" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Password:</label>
                <div class="col-sm-9">
                    <input id="new_user_password" class="form-control" type="password" req-data="Password" rd-errors="$ctrl.modalErrors" rd-pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{6,50}$" rd-pattern-msg="Passwords must be at least six characters in length including both lower and uppercase characters, one special character (e.g., ~\`!@#$%^&*()-_+={}[]|\\;:<>,./?) and at least one numeric character." />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Confirm Password:</label>
                <div class="col-sm-9">
                    <input id="new_user_password2" class="form-control" type="password" req-data="Confirm Password" rd-errors="$ctrl.modalErrors" rd-match="new_user_password" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Full Name:</label>
                <div class="col-sm-9">
                    <input id="new_user_full_name" class="form-control" type="text" />
                </div>
            </div>`
            + roleOptions + `
        </form>`)(scope);

        this.modalErrors.push({ control: $("#new_user_name", body)[0], error: "User Name is required." });
        this.modalErrors.push({ control: $("#new_user_password", body)[0], error: "Password is required." });
        this.modalErrors.push({ control: $("#new_user_password2", body)[0], error: "Confirm Password is required." });

        this.DialogService.dialog("Create User", body, null, () => {
            let userName = $("#new_user_name").val();
            let fullName = $("#new_user_full_name").val();
            let password = $("#new_user_password").val();
            let password2 = $("#new_user_password2").val();
            let roles = [];

            angular.forEach(this.newRoles, (item) => {
                if (item.Active) {
                    roles.push(item.Name);
                }
            });

            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving User...";
                this.AuthService.register(userName, fullName, password, password2, roles)
                    .then((response) => {
                        $(".table-metadata > tbody > tr").remove();
                        this.users.push(response.data.user);
                        this.table.row.add(response.data.user).select().draw().show().draw(false);
                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    discard() {
        this.errors = [];
        $(".table-metadata > tbody > tr").remove();
        $(".has-error").removeClass("has-error");

        this.$scope.$evalAsync(() => {
            this.copiedUser = angular.copy(this.selectedUser);
            this.table.row('.selected').data(this.copiedUser).draw().show().draw(false);

            angular.forEach(this.roles, (role) => {
                role.selected = this.copiedUser.Roles.find((elem) => { return elem.Name === role.Name; }) != null;
            });
        });

        this.dirty = false;
    }

    loadUsers() {
        this.working = "Loading Users...";
        this.UserService.list()
            .then((response) => {
                this.users = response.data.users;
                this.table.rows.add(this.users).draw().show().draw(false);
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    init() {
        this.working = "";
        this.errors = [];
        this.modalErrors = [];

        this.table = $("#users").DataTable({
            dom: '<"dt-toolbar"<"create-new-button"><"dt-toolbar-length"l><"dt-toolbar-filter"f>>rt<"dt-footer"<"dt-footer-info"i><"dt-footer-pager"p>>',
            columns: [
                { data: null, width: "25px", render: (data, type, row) => { return row.Active ? "Yes" : "No"; } },
                { data: "UserName" },
                { data: "FullName" },
                { data: "EmailAddress" },
                { data: null, width: "25px", render: (data, type, row) => { return row.ReceiveEmail ? "Yes" : "No"; } },
                { data: "SmsAddress" },
                { data: null, width: "25px", render: (data, type, row) => { return row.ReceiveText ? "Yes" : "No"; } },
            ],
            select: "single",
            drawCallback: function (settings) {
            }
        }).on("user-select", (e, dt, type, cell, originalEvent, retriggered) => {
            if (this.dirty) {
                e.preventDefault();

                this.DialogService.confirm("Unsaved Changes!", "Your changes will be discarded, would you like to proceed?", (result) => {
                    if (result) {
                        this.dirty = false;
                        this.errors = [];
                        $(".has-error").removeClass("has-error");

                        if (this.table.rows('.selected').any()) {
                            let selected = this.table.row('.selected');
                            let source = this.table.row(cell.index().row);

                            if (selected.index() === source.index()) {
                                this.table.rows(cell.index().row).deselect();
                            } else {
                                selected.deselect();
                                source.select().show().draw(false);
                            }
                        } else {
                            this.table.row(cell.index().row).select().show().draw(false);
                        }
                    }
                });
            }
        }).on("select", () => {
            this.selectedUser = this.table.rows('.selected').data()[0];
            $(".table-metadata > tbody > tr").remove();
            this.$scope.$evalAsync(() => {
                this.copiedUser = angular.copy(this.selectedUser);

                angular.forEach(this.roles, (role) => {
                    role.selected = this.copiedUser.Roles.find((elem) => { return elem.Name === role.Name; }) != null;
                });
            });
        }).on("deselect", () => {
            this.clearUser();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Create New User" class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));

        this.working = "Loading Roles...";
        this.RoleService.list()
            .then((response) => {
                this.roles = response.data.roles;
                this.working = "Loading Users...";
                return this.UserService.list();
            })
            .then((response) => {
                this.users = response.data.users;
                this.table.rows.add(this.users).draw();
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    isModalValid() {
        return this.modalErrors.length === 0;
    }

    isRowSelected() {
        return this.table.rows('.selected').any();
    }

    notUnique() {
        let elem = this.users.find((elem) => { return elem.UserName === this.copiedUser.UserName; });
        return elem && elem != this.selectedUser;
    }

    notUniqueModal() {
        let elem = this.users.find((elem) => { return elem.UserName === $("#new_user_name").val(); });
        return elem;
    }

    isValid() {
        return this.errors.length === 0;
    }

    markDirty() {
        this.$scope.$evalAsync(() => { this.dirty = true; });
    }

    removeCustomProperty(e) {
        let $row = $(e.currentTarget).parents("tr");
        let $name = $row.children("td:eq(0)").children("input")[0];
        let $value = $row.children("td:eq(1)").children("input")[0];
        this.errors = this.errors.filter((elem) => {
            return elem.control !== $name && elem.control !== $value;
        });

        $row.remove();
        this.markDirty();
    }

    testEmail() {
        this.working = "Testing Email...";
        this.AuthService.testEmail(this.copiedUser.EmailAddress)
            .then((response) => {
                this.DialogService.alert("Email Test", "The email address is valid.", "alert-info");
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    testSms() {
        this.working = "Testing SMS...";
        this.AuthService.testEmail(this.copiedUser.SmsAddress)
            .then((response) => {
                this.DialogService.alert("Email Test", "The SMS address is valid.", "alert-info");
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    save() {
        this.working = "Saving User...";
        let xml = { Property: [] };

        $(".table-metadata > tbody > tr").each((index, value) => {
            let row = $(value);
            xml.Property.push({
                Name: row.children("td:eq(0)").children("input").val(),
                Value: row.children("td:eq(1)").children("input").val()
            });
        });

        this.copiedUser.Metadata = JSON.stringify(xml);
        let roles = [];

        angular.forEach(this.roles, (role) => {
            if (role.selected) {
                roles.push(role.Name);
            }
        });

        this.working = "Saving User..."
        this.UserService.updateWithRoles(this.copiedUser, roles)
            .then((response) => {
                this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                $(".table-metadata > tbody > tr").remove();

                this.$scope.$evalAsync(() => {
                    this.copiedUser = angular.copy(response.data.user);

                    angular.forEach(this.roles, (role) => {
                        role.selected = this.copiedUser.Roles.find((elem) => { return elem.Name === role.Name; }) != null;
                    });

                    this.users[this.users.findIndex((elem) => { return elem.Id === this.copiedUser.Id; })] = response.data.user;
                    this.table.row('.selected').data(this.copiedUser).draw().show().draw(false);
                });


                this.dirty = false;
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    overflowing(e) {
        let well = $(".well")[1];
        let form = $("fieldset", well)[0];
        return form.scrollHeight > well.offsetHeight;
    }
}

UsersController.$inject = ["AppConfig", "AuthService", "DialogService", "UserService", "RoleService", "$scope", "$compile"];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const users = {
    controller: UsersController,
    templateUrl: "Views/User/users.html",
};
