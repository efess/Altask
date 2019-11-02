import {getAssetName, getUserName} from "../Utility/utility";

class AuthedController {
    constructor(
        $compile,
        $scope,
        $state,
        AppConfig,
        AssetLogService,
        AssetLogTypeCategoryService,
        AssetLogTypeService,
        AssetService,
        AuthService,
        DialogService,
        FormService,
        OccurrenceService,
        TaskCategoryService,
        TaskService,
        UserService,
        SignalRService) 
    {
        this.$compile = $compile;
        this.$scope = $scope;
        this.$state = $state;
        this.AppConfig = AppConfig;
        this.AssetLogService = AssetLogService;
        this.AssetLogTypeCategoryService = AssetLogTypeCategoryService;
        this.AssetLogTypeService = AssetLogTypeService;
        this.AssetService = AssetService;
        this.AuthService = AuthService;
        this.DialogService = DialogService;
        this.FormService = FormService;
        this.OccurrenceService = OccurrenceService;
        this.TaskCategoryService = TaskCategoryService;
        this.TaskService = TaskService;
        this.UserService = UserService;
        this.SignalRService = SignalRService;
        this.init();
    }

    filterLogType() {
        return (logType) => { return logType.AssetLogTypeCategoryId === this.newLog.AssetLogTypeCategoryId &&
            (logType.Assets.length > 0 ? logType.Assets.find((elem) => { return elem.AssetId === this.newLog.AssetId; }) !== undefined : true); };
    }

    getUserName() {
        return this.AppConfig.user ? this.AppConfig.user.fullName || this.AppConfig.user.userName : '';
    }

    logout() {
        let {AuthService, $state} = this;
        this.SignalRService.disconnect();
        AuthService.logout();
        // Reload states after authentication change
        return $state.go("login", {}, { reload: true });
    }

    isActive(states) {
        let includesState = false;

        angular.forEach(states, (state) => {
            if (this.$state.includes(state)){
                includesState = true;
            }
        });

        return includesState;
    }

    init() {
        var onAddNewTaskAsset = (e) => {
            let $elem = $(e.currentTarget);
            
            if ($elem.val()) {
                if ($elem.val()) {
                    this.$scope.$evalAsync(() => {
                        this.newTask.assets.find((elem) => { return elem.Id == $elem.val(); }).selected = true;
                        $(document).off("change", ".add-new-task-asset", onAddNewTaskAsset);
                        $elem.val("");
                        $(document).on("change", ".add-new-task-asset", onAddNewTaskAsset);
                    });
                }
            }
        };
        $(document).ready(function () {
            $(document).click(function (event) {
                var clickover = $(event.target);
                var _opened = $(".navbar-collapse").hasClass("in") && $(".navbar-collapse").hasClass("navbar-collapse");
                if (_opened === true && !clickover.hasClass("navbar-toggle")) {
                    $("button.navbar-toggle").click();
                }
            });
        });
        $(document).on("change", ".add-new-task-asset", onAddNewTaskAsset);

        $(document).on("click", ".remove-new-task-asset", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.newTask.assets.find((elem) => { return elem.Id == $elem.data("new-task-asset"); }).selected = false;
                $elem.parents(".form-group").remove();
            });
        });

        var onAddNewTaskUser = (e) => {
            let $elem = $(e.currentTarget);

            if ($elem.val()) {
                if ($elem.val()) {
                    this.$scope.$evalAsync(() => {
                        this.newTask.users.find((elem) => { return elem.Id ==$elem.val(); }).selected = true;
                        $(document).off("change", ".add-new-task-user", onAddNewTaskUser);
                        $elem.val("");
                        $(document).on("change", ".add-new-task-user", onAddNewTaskUser);
                    });
                }
            }
        };

        $(document).on("change", ".add-new-task-user", onAddNewTaskUser);

        $(document).on("click", ".remove-new-task-user", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.newTask.users.find((elem) => { return elem.Id == $elem.data("new-task-user"); }).selected = false;
                $elem.parents(".form-group").remove();
            });
        });

        $(document).ready(() => {
            this.wireHandlers();
        });

        if (this.AuthService.isAuthenticated()){
            const handleUnauthorized = (error) => {
                if (error.status && error.status === 401) {
                    this.$scope.$evalAsync(() => {
                        this.AppConfig.user = undefined;
                        this.AppConfig.settings = undefined;
                        this.AppConfig.save();
                    });
                }    
            };

            this.AssetLogTypeCategoryService.list({ Active: true })
            .then((response) => { 
                this.logCategories = response.data.assetLogTypeCategories;
                this.logCategories.sort((a,b) => { return a.Name.localeCompare(b.Name);});
                return this.AssetLogTypeService.list({ Active: true });
            })
            .then((response) => { 
                this.logTypes = response.data.assetLogTypes;
                this.logTypes.sort((a,b) => { return a.Name.localeCompare(b.Name); });
                return this.AssetService.list({ Active: true });
            })
            .then((response) => { 
                this.assets = response.data.assets;
                this.assets.sort((a,b) => { return a.Name.localeCompare(b.Name) || a.CustomId.localeCompare(b.CustomId); });
                this.assets.forEach((elem) => { elem.DisplayName = getAssetName(elem); });
                return this.UserService.list({ Active: true });
            })
            .then((response) => { 
                this.users = response.data.users;
                this.users.sort((a,b) => { return (a.FullName || a.UserName).localeCompare(b.FullName || b.UserName); });
                return this.TaskCategoryService.list({ Active: true });
            })
            .then((response) => { 
                this.taskCategories = response.data.taskCategories;
                this.taskCategories.sort((a,b) => { return a.Name.localeCompare(b.Name); });
                return this.FormService.list({ Active: true })
            })
            .then((response) => { 
                this.forms = response.data.forms;
                this.forms.sort((a,b) => { return a.Name.localeCompare(b.Name); });
                this.canLog = this.inRole('Administrator') || this.inRole('Supervisor');
                this.canCreateTask = this.inRole('Administrator') || this.inRole('Supervisor');
            })
            .catch(handleUnauthorized);
        }
    }

    inRole(role) {
        return this.AppConfig.user != null ?this.AppConfig.user.roles.find((elem) => { return elem.name === role; }) != null : false;
    }

    log() {
        this.modalErrors = [];
        
        let categoryId = this.logCategories.find((elem) => { return elem.Name === "Note"; }).Id;
        let logType = this.logTypes.find((elem) => { return elem.AssetLogTypeCategoryId === categoryId; });

        this.newLog = {
            AssetId: this.assets[0].Id,
            AssetLogTypeId: logType.Id,
            AssetLogTypeCategoryId: categoryId,
            Comment: "",
            Description: "",
        };

        let scope = this.$scope.$new();

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the asset log can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Asset:</label>
                <div class="col-sm-9">
                    <select class="form-control" ng-model="$ctrl.newLog.AssetId" ng-options="x.Id as x.DisplayName for x in $ctrl.assets"></select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Log Category:</label>
                <div class="col-sm-9">
                    <select class="form-control" ng-change="$ctrl.selectLogCategory()" ng-model="$ctrl.newLog.AssetLogTypeCategoryId" ng-options="x.Id as x.Name for x in $ctrl.logCategories"></select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Log Type:</label>
                <div class="col-sm-9">
                    <select class="form-control" ng-model="$ctrl.newLog.AssetLogTypeId" ng-options="x.Id as x.Name for x in $ctrl.logTypes | filter:$ctrl.filterLogType()"></select>
                </div>
            </div>` + (logType.CanComment ? `
            <div class="form-group">
                <label class="control-label col-sm-3">Comments:</label>
                <div class="col-sm-9">
                    <textarea class="form-control" ng-model="$ctrl.newLog.Comment"></textarea>
                </div>
            </div>` : ``) +
        `</form>`)(scope);

        this.DialogService.dialog("Log Asset Information", body, null, () => {
            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving Asset Log...";
                this.AssetLogService.create(this.newLog)
                .then((response) => {
                    this.DialogService.success("Log Asset Info", "Your log has been successfully submitted.");
                })
                .catch((error) => { this.DialogService.error(error); })
                .finally(() => { this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    newTask() {
        this.modalErrors = [];
        this.newTask = {
            name: "",
            description: "",
            idleTimeout: 5,
            date: new Date(),
            asEarlyAsN: 1,
            asEarlyAsFrequency: "Hour(s)",
            taskCategoryId: this.taskCategories[0].Id,
            formId: "",
            assets: angular.copy(this.assets),
            assetIds: [],
            users: angular.copy(this.users),
            userIds: []
        }

        this.newTask.assets.forEach((elem) => { elem.selected = false; });
        this.newTask.users.forEach((elem) => { elem.selected = false; });        
        let scope = this.$scope.$new();

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the new task can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback` + (!this.newTask.name ? ` has-error` : ``) + `">
                <label class="col-sm-3 control-label">Name:</label>
                <div class="col-sm-9">
                    <input id="new_task_name" ng-model="$ctrl.newTask.name" class="form-control" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3  col-xs-12 control-label" style="margin-top: 7px;">Date:</label>
                <div class="col-xs-4">
                    <datepicker model="$ctrl.newTask.date" format="MM/dd/yyyy" style="margin-top: 7px;"></datepicker>
                </div>
                <div class="col-xs-4">
                    <div uib-timepicker ng-model="$ctrl.newTask.date" hour-step="1" minute-step="1" show-meridian="true" style="margin-top: -15px;"></div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 col-xs-12 control-label">As Early as:</label>
                <div class="col-xs-4">
                     <input type="number" class="form-control" width="100" min="1" max="12" ng-model="$ctrl.newTask.asEarlyAsN" />
                </div>
                <div class="col-xs-4" style="padding-left: 0px; padding-right: 30px;">
                    <select id="frequency" ng-model="$ctrl.newTask.asEarlyAsFrequency" class="form-control">
                        <option value="">Not Specified</option>
                        <option value="Minute(s)">Minute(s)</option>
                        <option value="Hour(s)">Hour(s)</option>
                        <option value="Day(s)">Day(s)</option>
                        <option value="Week(s)">Week(s)</option>
                        <option value="Month(s)">Month(s)</option>
                    </select>
                </div>
                <div class="col-xs-1" style="padding-top: 6px; padding-left: 0px; margin-left: -16px;">
                    Before
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Task Category:</label>
                 <div class="col-sm-9">
                    <select class="form-control">
                        <option ng-model="$ctrl.newTask.taskCategoryId" ng-repeat="x in ::$ctrl.taskCategories" value="{{x.Id}}">{{x.Name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Form:</label>
                 <div class="col-sm-9">
                    <select class="form-control" ng-model="$ctrl.newTask.formId" >
                        <option value="">Not Specified</option>
                        <option ng-repeat="x in ::$ctrl.forms" value="{{x.Id}}">{{x.Name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Add Asset:</label>
                 <div class="col-sm-9">
                    <select class="form-control add-new-task-asset">
                        <option selected disabled value="">Choose an Asset...</option>
                        <option ng-repeat="x in $ctrl.newTask.assets | filter:{selected:false}" value="{{x.Id}}">{{x.DisplayName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" ng-repeat="x in $ctrl.newTask.assets | filter:{selected:true}">
                <label class="control-label col-sm-3">Asset:</label>
                 <div class="col-sm-9 input-group">
                    <input class="form-control" disabled value="{{x.DisplayName}}" />
                    <span class="input-group-btn remove-new-task-asset" data-new-task-asset="{{x.Id}}">
                        <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-remove"></i></button>
                    </span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Add User:</label>
                 <div class="col-sm-9">
                    <select class="form-control add-new-task-user">
                        <option selected disabled value="">Choose a User...</option>
                        <option ng-repeat="x in $ctrl.newTask.users | filter:{selected:false}" value="{{x.Id}}">{{x.FullName || x.UserName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" ng-repeat="x in $ctrl.newTask.users | filter:{selected:true}">
                <label class="control-label col-sm-3">User:</label>
                 <div class="col-sm-9 input-group">
                    <input class="form-control" disabled value="{{x.FullName || x.UserName}}" />
                    <span class="input-group-btn remove-new-task-user" data-new-task-user="{{x.Id}}">
                        <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-remove"></i></button>
                    </span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 col-xs-12 control-label">Idle Timeout:</label>
                <div class="col-xs-4">
                     <input type="number" class="form-control" width="100" min="1" max="60" ng-model="$ctrl.newTask.idleTimeout" />
                </div>
                <div class="col-xs-1" style="padding-top: 6px; padding-left: 8px; margin-left: -16px;">
                    minute(s)
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <textarea ng-model="$ctrl.newTask.description" class="form-control"></textarea>
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_task_name", body)[0], error: "Name is required."});
        this.DialogService.dialog("Create New Task", body, null, () => {
            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving Task...";
                this.newTask.assets.filter((elem) => { return elem.selected; }).forEach((elem) => { this.newTask.assetIds.push(elem.Id); });
                this.newTask.users.filter((elem) => { return elem.selected; }).forEach((elem) => {this.newTask.userIds.push(elem.Id); });
                this.OccurrenceService.addOneTime(this.newTask.name, this.newTask.taskCategoryId, this.newTask.formId, this.newTask.assetIds, this.newTask.userIds, this.newTask.date, this.newTask.asEarlyAsN, this.newTask.asEarlyAsFrequency, this.newTask.description, this.newTask.idleTimeout)
                .then((response) => {
                    this.DialogService.success("Create New Task", "Your task has been successfully created.");
                })
                .catch((error) => { this.DialogService.error(error); })
                .finally(() => { this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }


    selectLogCategory() {
        this.newLog.AssetLogTypeId = this.logTypes.length > 0 ? this.logTypes.find((elem) => { return elem.AssetLogTypeCategoryId === this.newLog.AssetLogTypeCategoryId  &&
            (elem.Assets.length > 0 ? elem.Assets.find((asset) => { return asset.AssetId === this.newLog.AssetId; }) !== undefined : true); }).Id : "";
    }

    wireHandlers() {

    }
}

AuthedController.$inject = [
    "$compile",
    "$scope",
    "$state",
    "AppConfig",
    "AssetLogService",
    "AssetLogTypeCategoryService",
    "AssetLogTypeService",
    "AssetService",
    "AuthService",
    "DialogService",
    "FormService",
    "OccurrenceService",
    "TaskCategoryService",
    "TaskService",
    "UserService",
    "SignalRService"
];

// This is the `app` component.  It defines the controller and template URL for `app` state.
export const app = {
    controller: AuthedController,
    templateUrl: "Views/App/app.html",
}
