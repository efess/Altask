import {getAssetName, relativeDate, scheduleSummary, taskAlertSummary} from "../../Utility/utility";
import moment from "moment";

// The controller for the `tasks` component
class TasksController {
    constructor(AppConfig, DialogService, TaskService, TaskAlertService, TaskCategoryService, TaskTypeService, ScheduleService, FormService, AssetService, UserService, $scope, $compile) {
        this.AppConfig = AppConfig;
        this.AssetService = AssetService;
        this.DialogService = DialogService;
        this.FormService = FormService;
        this.ScheduleService = ScheduleService;
        this.TaskAlertService = TaskAlertService;
        this.TaskCategoryService = TaskCategoryService;
        this.TaskService = TaskService;
        this.TaskTypeService = TaskTypeService;
        this.UserService = UserService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.dirty = false; 
        this.init();
    }

    addAlert() {
        this.resetTaskAlertOptions();
        this.updateAlert();
    }

    addSchedule() {
        this.resetScheduleOptions();
        this.updateSchedule();
    }

    copyAlert(e, row) {
        e.stopPropagation();
        let taskAlert = angular.copy(this.taskAlertsTable.row(row).data());
        taskAlert.Id = null;
        this.taskAlertOptions.Active = taskAlert.Active || true;
        this.taskAlertOptions.name = taskAlert.Name || "";
        this.taskAlertOptions.TimeN = taskAlert.TimeN || "";
        this.taskAlertOptions.TimeUnit = taskAlert.TimeUnit || "";
        this.taskAlertOptions.IfNot = taskAlert.IfNot || true;
        this.taskAlertOptions.IfStatus = taskAlert.IfStatus || "Started";
        this.taskAlertOptions.users.forEach((elem) => { elem.selected = taskAlert.Users.find((user) => { return user.UserId === elem.Id; }) !== undefined; });
        this.updateAlert(); 
    }

    copySchedule(e, row) {
        e.stopPropagation();
        let schedule = angular.copy(this.schedulesTable.row(row).data());
        schedule.Id = null;
		this.setScheduleOptions(schedule);        
        this.updateSchedule(); 
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
        this.errors.push({control: $tbody.children("tr:last").children("td:eq(0)").children("input")[0], error: "Custom property name is required."});
        this.errors.push({control: $tbody.children("tr:last").children("td:eq(1)").children("input")[0], error: "Custom property value is required."});
    }

    open() {
        this.popup.opened = true;
    }

    overflowing(e) {
        let well = $(".well")[1];
        let form = $("fieldset", well)[0];
        return form.scrollHeight > well.offsetHeight;   
    }

    clearTask() {
        $(".table-metadata > tbody > tr").remove();

        if (this.schedulesTable){
            this.schedulesTable.clear().draw();
        }

        if (this.taskAlertsTable){
            this.taskAlertsTable.clear().draw();
        }

        this.$scope.$evalAsync(() => {
            this.copiedTask = {
                Id: null,
                Active: false,
                TaskCategoryId: "",
                TaskTypeId: "",
                ParentTaskId: "",
                FormId: "",
                Description: "",
                Metadata: { Properties: [] },
                IdleTimeout: 0,
                Schedules: []
            }
        });
    }

    createNew() {
        let scope = this.$scope.$new();
        let formOptions = `<option value="" selected>None</option>`;

        angular.forEach(this.forms, (elem) => {
            formOptions += `<option value="` + elem.Id + `">` + elem.Name + `</option>`;
        });

        let categoryOptions = ``;

        angular.forEach(this.taskCategories, (elem) => {
            categoryOptions += `<option value="` + elem.Id + `">` + elem.Name + `</option>`;
        });

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the task can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Name:</label>
                <div class="col-sm-9">
                    <input id="new_task_name" class="form-control" type="text" req-data="Name" rd-errors="$ctrl.modalErrors" unq-name un-err-model="$ctrl.modalErrors" un-items="$ctrl.tasks" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <textarea id="new_task_description" class="form-control"></textarea>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Category:</label>
                <div class="col-sm-9">
                    <select id="new_task_category" class="form-control">`
                    + categoryOptions +
                    `</select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Form:</label>
                <div class="col-sm-9">
                    <select id="new_task_form" class="form-control">`
                    + formOptions +
                    `</select>
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_task_name", body)[0], error: "Name is required."});

        this.DialogService.dialog("Create Task", body, null, () => {
            let newTask = {
                Active: true,
                TaskTypeId: this.taskTypes.filter((elem) => { return elem.Name === "Reccurring" ; })[0].Id,
                TaskCategoryId: parseInt($("#new_task_category").val()),
                FormId: $("#new_task_form").val() ? parseInt($("#new_task_form").val()) : null,
                Name: $("#new_task_name").val(),
                Description: $("#new_task_description").val(),
            };

            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving Task...";
                this.TaskService.create(newTask)
                .then((response) => {
                    $(".table-metadata > tbody > tr").remove();
                    this.tasks.push(response.data.task);
                    this.table.row.add(response.data.task).select().draw().show().draw(false);
                })
                .catch((error) => { this.DialogService.error(error); })
                .finally(() => { this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    editAlert(e, row) {
        e.stopPropagation();
        let taskAlert = angular.copy(this.taskAlertsTable.row(row).data());

        this.taskAlertOptions.Active = taskAlert.Active;
        this.taskAlertOptions.name = taskAlert.Name;
        this.taskAlertOptions.TimeN = taskAlert.TimeN || "";
        this.taskAlertOptions.TimeUnit = taskAlert.TimeUnit || "";
        this.taskAlertOptions.IfNot = taskAlert.IfNot ? "Is Not": "Is";
        this.taskAlertOptions.IfStatus = taskAlert.IfStatus || "Started";
        this.taskAlertOptions.users.forEach((elem) => { elem.selected = taskAlert.Users.find((user) => { return user.UserId === elem.Id; }) !== undefined; });
        this.updateAlert(taskAlert.Id, row); 
    }

    editSchedule(e, row) {
        e.stopPropagation();
        let schedule = angular.copy(this.schedulesTable.row(row).data());
		this.setScheduleOptions(schedule);
        this.updateSchedule(schedule.Id, row); 
    }

    discard() {
        this.errors = [];
        $(".table-metadata > tbody > tr").remove();
        $(".has-error").removeClass("has-error");

        this.$scope.$evalAsync(() => {
            this.copiedTask = angular.copy(this.selectedTask);
            this.table.row('.selected').data(this.copiedTask).draw().show().draw(false);
        });

        this.dirty = false;
    }

    loadTasks() {
        this.working = "Loading Tasks...";
        this.TaskService.list()
        .then((response) => {
            this.tasks = response.data.tasks;
            this.table.rows.add(this.tasks).draw();            
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "");
    }

    init() {
        this.errors = [];
        this.modalErrors = [];
        this.working = "";

        this.table = $("#tasks").DataTable({
            dom: '<"dt-toolbar"<"create-new-button"><"dt-toolbar-length"l><"dt-toolbar-filter"f>>rt<"dt-footer"<"dt-footer-info"i><"dt-footer-pager"p>>',
            columns: [
                { data: null, width: "25px", render: ( data, type, row ) => { return row.Active ? "Yes" : "No"; } },
                { data: "Name" },
                { render: function( data, type, row, meta ) { return row.Category.Name; }},
                { className: "tbl-btn-group-next", render: function( data, type, row, meta ) { return row.Form ? row.Form.Name : ""; }},
                //{ className: "tbl-btn-group", render: (data, type, row, meta) => { return `<span class="tbl-btn" ng-click="$ctrl.createChildTask($event, ` + meta.row + `)"><i class="fa fa-plus" aria-hidden="true"></i></span>` }, orderable: false, width: "28px" }
            ],
            select: "single",
            rowCallback: ( row, data, index ) => {
                this.$compile(row)(this.$scope);
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
            this.selectedTask = this.table.rows('.selected').data()[0];
            $(".table-metadata > tbody > tr").remove();
            this.$scope.$evalAsync(() => { 
                this.copiedTask = angular.copy(this.selectedTask);
                this.schedulesTable.clear();
                this.schedulesTable.rows.add(this.copiedTask.Schedules).draw();
                this.taskAlertsTable.clear();
                this.taskAlertsTable.rows.add(this.copiedTask.Alerts).draw();
            });
        }).on("deselect", () => {
            this.clearTask();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Create New Task" class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));
    
        this.taskAlertsTable = $("#task_alerts").DataTable({
            dom: 't',
            columns: [
                { data: null, width: "25px", render: ( data, type, row ) => { return row.Active ? "Yes" : "No"; } },
                { className: "tbl-btn-group-next", render: function( data, type, row ) { return taskAlertSummary(row); }},
                { className: "tbl-btn-group", render: (data, type, row, meta) => { return `<span data-toggle="tooltip" title="Copy Task Alert" class="tbl-btn copy-task-alert" data-row="` + meta.row + `"><i class="fa fa-clone" aria-hidden="true"></i></span><span data-toggle="tooltip" title="Edit Task Alert" class="tbl-btn edit-task-alert" data-row="` + meta.row + `"><i class="fa fa-pencil" aria-hidden="true"></i></span>` }, orderable: false, width: "74px" }
            ],
            paging: false,
            select: "single",
            drawCallback: (settings) => {
                $('#task_alerts tbody [data-toggle="tooltip"]').tooltip(); 
            }
        });

        $("#task_alerts").on("click", "tbody td span.copy-task-alert", (e) => {
            let elem = $(e.currentTarget);
            let row = elem.data("row");
            this.copyAlert(e, row);
        });

        $("#task_alerts").on("click", "tbody td span.edit-task-alert", (e) => {
            let elem = $(e.currentTarget);
            let row = elem.data("row");
            this.editAlert(e, row);
        });

        this.schedulesTable = $("#schedules").DataTable({
            dom: 't',
            columns: [
                { data: null, width: "25px", render: ( data, type, row ) => { return row.Active ? "Yes" : "No"; } },
                { render: function( data, type, row ) { return scheduleSummary(row); }},
                { render: function( data, type, row ) {
                    var assetSummary = "";

                    angular.forEach(row.Assets, (asset) => {
                        assetSummary = assetSummary.concat(getAssetName(asset.Asset)).concat(", ");
                    });

                    return assetSummary.slice(0, -2);
                }},
                { className: "tbl-btn-group-next", render: function( data, type, row ) {
                    var userSummary = "";

                    angular.forEach(row.Users, (user) => {
                        userSummary = userSummary.concat(user.User.FullName || user.User.UserName).concat(", ");
                    });

                    return userSummary.slice(0, -2);
                }},
                { className: "tbl-btn-group", render: (data, type, row, meta) => { return `<span data-toggle="tooltip" title="Copy Task Schedule" class="tbl-btn copy-schedule" data-row="` + meta.row + `"><i class="fa fa-clone" aria-hidden="true"></i></span><span data-toggle="tooltip" title="Edit Task Schedule" class="tbl-btn edit-schedule" data-row="` + meta.row + `"><i class="fa fa-pencil" aria-hidden="true"></i></span>` }, orderable: false, width: "74px" }
            ],
            paging: false,
            select: "single",
            drawCallback: (settings) => {
                $('#schedules tbody [data-toggle="tooltip"]').tooltip(); 
            }
        });

        $("#schedules").on("click", "tbody td span.copy-schedule", (e) => {
            let elem = $(e.currentTarget);
            let row = elem.data("row");
            this.copySchedule(e, row);
        });

        $("#schedules").on("click", "tbody td span.edit-schedule", (e) => {
            let elem = $(e.currentTarget);
            let row = elem.data("row");
            this.editSchedule(e, row);
        });

        $(document).on("change", ".add-task-alert-user", (e) => {
            let $elem = $(e.currentTarget);
            
            if ($elem.val()) {
                this.$scope.$evalAsync(() => {
                    this.taskAlertOptions.users.find((elem) => { return elem.Id == $elem.val(); }).selected = true;
                    $elem.val("");
                });
            }
        });

        $(document).on("click", ".remove-task-alert-user", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.taskAlertOptions.users.find((elem) => { return elem.Id == $elem.data("task-alert-user"); }).selected = false;
                $elem.parents(".form-group").remove();
            });
        });

        $(document).on("change", ".add-schedule-asset", (e) => {
            let $elem = $(e.currentTarget);
            
            if ($elem.val()) {
                this.$scope.$evalAsync(() => {
                    this.scheduleOptions.assets.find((elem) => { return elem.Id == $elem.val(); }).selected = true;
                    $elem.val("");
                });
            }
        });

        $(document).on("click", ".remove-schedule-asset", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.scheduleOptions.assets.find((elem) => { return elem.Id == $elem.data("schedule-asset"); }).selected = false;
                $elem.parents(".form-group").remove();
            });
        });

        $(document).on("change", ".add-schedule-user", (e) => {
            let $elem = $(e.currentTarget);

            if ($elem.val()) {
                this.$scope.$evalAsync(() => {
                    this.scheduleOptions.users.find((elem) => { return elem.Id ==$elem.val(); }).selected = true;
                    $elem.val("");
                });
            }
        });

        $(document).on("click", ".remove-schedule-user", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.scheduleOptions.users.find((elem) => { return elem.Id == $elem.data("schedule-user"); }).selected = false;
                $elem.parents(".form-group").remove();
            });
        });

        this.working = "Loading Task Types...";
        this.TaskTypeService.list()
        .then((response) => { 
            this.taskTypes = response.data.taskTypes; 
            this.working = "Loading Task Categories...";
            return this.TaskCategoryService.list();
        })
        .then((response) => { 
            this.taskCategories = response.data.taskCategories; 
            this.working = "Loading Forms...";
            return this.FormService.list();
        })
        .then((response) => { 
            this.forms = response.data.forms; 
            this.forms.sort((a, b) => { return a.Name.localeCompare(b.Name); })
            this.working = "Loading Assets...";
            return this.AssetService.list();
        })
        .then((response) => { 
            this.assets = response.data.assets; 
            this.assets.sort((a, b) => { return a.Name.localeCompare(b.Name) || a.CustomId.localeCompare(b.CustomId); });
            this.assets.forEach((elem) => { elem.DisplayName = getAssetName(elem); });
            this.working = "Loading Users...";
            return this.UserService.list();
        })
        .then((response) => { 
            this.users = response.data.users;
            this.users.sort((a, b) => { return (a.FullName || a.UserName).localeCompare(b.FullName || b.UserName); });
            this.working = "Loading Tasks...";
            return this.TaskService.list();
        })
        .then((response) => { 
            this.tasks = response.data.tasks;
            this.table.rows.add(this.tasks).draw();
            this.clearTask();
            this.resetTaskAlertOptions();
            this.resetScheduleOptions();
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

    resetTaskAlertOptions() {
        this.$scope.$evalAsync(() => {
            this.taskAlertOptions = {
                name: "",
                TimeN: 0,
                TimeUnit: "Minute(s)",
                TimeUnits : ["Minute(s)", "Hour(s)", "Day(s)", "Week(s)"],
                When: "BeforeDueDate",
                Whens: [{name: "Before Due Date", value: "BeforeDueDate"},{name: "After Due Date", value: "AfterDueDate"}],
                IfNot: "Is Not",
                IfNots: ["Is", "Is Not"],
                IfStatus: "Started",
                IfStatuses: ["Dismissed","Started","Stopped","Resumed","Completed"],
                users: angular.copy(this.users)
            };

            this.taskAlertOptions.users.forEach((elem) => { elem.selected = false; });
        });
    }

    resetScheduleOptions() {
        this.$scope.$evalAsync(() => {
            this.scheduleOptions = {
                assets: angular.copy(this.assets),
                asEarlyAsN: "",
                asEarlyAsFrequencies : [
                    { id: 0, value: "Minute(s)" },
                    { id: 1, value: "Hour(s)" },
                    { id: 2, value: "Day(s)" },
                    { id: 3, value: "Week(s)" },
                    { id: 4, value: "Month(s)" },
                ],
                asEarlyAsFrequency: "",
                name: "",
                frequencies: [
                    { id: 0, value: "Daily" }, 
                    { id: 1, value: "Weekly" }, 
					{ id: 2, value: "Monthly" },
					{ id: 3, value: "Quarterly" },
					{ id: 4, value: "Yearly" }
                ],
                frequency: "0",
                everyNs: [
                    { id: 1, value: 1 }, 
                    { id: 2, value: 2 }, 
                    { id: 3, value: 3 }, 
                    { id: 4, value: 4 },
                    { id: 5, value: 5 }, 
                    { id: 6, value: 6 }],
                everyN: "1",
                daysOfWeek: [
                    { name: "Sun", id: 0, selected: true, description: "Sunday" },
                    { name: "Mon", id: 1, selected: false, description: "Monday" },
                    { name: "Tue", id: 2, selected: false, description: "Tuesday" },
                    { name: "Wed", id: 3, selected: false, description: "Wednesday" },
                    { name: "Thu", id: 4, selected: false, description: "Thursday" },
                    { name: "Fri", id: 5, selected: false, description: "Friday" },
                    { name: "Sat", id: 6, selected: false, description: "Saturday" }
                ],
                startsOnDate: new Date(),
                endsOn: "occurrence",
                endsOnDate: new Date(),
                endsAfter: 1,
                onWeek: 1,
                time: "any",
                weeks: [
                    { id: 1, value: "Week 1" },
                    { id: 2, value: "Week 2"},
                    { id: 3, value: "Week 3" },
                    { id: 4, value: "Week 4" },
                    { id: 5, value: "Last Week of Month" },
                    { id: 6, value: "Last Working Day of Month" }
                ],
                users: angular.copy(this.users)
            };

            this.scheduleOptions.assets.forEach((elem) => { elem.selected = false; });
            this.scheduleOptions.users.forEach((elem) => { elem.selected = false; });
        });
    }

    updateAlert(updateId, row) {
        let scope = this.$scope.$new();
        this.modalErrors = [];

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the task alert can be ` + (updateId ? "updated" : "created") + `!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Active:</label>
                <div class="col-sm-9 btn-group" role="group">
                    <button type="button" class="btn btn-default btn-yes-no" ng-class="$ctrl.taskAlertOptions.Active ? 'active' : ''" ng-click="$ctrl.taskAlertOptions.Active = true; $ctrl.markDirty()">Yes</button>
                    <button type="button" class="btn btn-default btn-yes-no" ng-class="!$ctrl.taskAlertOptions.Active ? 'active' : ''" ng-click="$ctrl.taskAlertOptions.Active = false; $ctrl.markDirty()">No</button>
                </div>
            </div>
            <div class="form-group has-feedback` + (!this.taskAlertOptions.name ? ` has-error` : ``) + `">
                <label class="col-sm-3 control-label">Name:</label>
                <div class="col-sm-9">
                    <input id="new_task_alert_name" ng-model="$ctrl.taskAlertOptions.name" class="form-control" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Add User:</label>
                <div class="col-sm-9">
                    <select class="form-control add-task-alert-user">
                        <option selected disabled value="">Choose a User...</option>
                        <option ng-repeat="x in $ctrl.taskAlertOptions.users | filter:{selected:false}" value="{{x.Id}}">{{x.FullName || x.UserName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" ng-repeat="x in $ctrl.taskAlertOptions.users | filter:{selected:true}">
                <label class="control-label col-sm-3">User:</label>
                <div class="col-sm-9 input-group">
                    <input class="form-control" disabled value="{{x.FullName || x.UserName}}" />
                    <span class="input-group-btn remove-task-alert-user" data-task-alert-user="{{x.Id}}">
                        <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-remove"></i></button>
                    </span>
                </div>
            </div>

            <div class="form-group">
                <label class="col-sm-3 control-label">Send Alert:</label>
                <div class="col-sm-3">
                     <input type="number" class="form-control" width="100" min="0" max="60" ng-model="$ctrl.taskAlertOptions.TimeN" />
                </div>
                <div class="col-sm-3" style="padding-left: 0px; padding-right: 30px;">
                    <select ng-model="$ctrl.taskAlertOptions.TimeUnit" class="form-control">
                        <option ng-repeat="x in $ctrl.taskAlertOptions.TimeUnits" value="{{x}}">{{x}}</option>
                    </select>
                </div>
                <div class="col-sm-3" style="padding-left: 0px;padding-right: 0px;margin-left: -15px;">
                    <select ng-model="$ctrl.taskAlertOptions.When" class="form-control">
                        <option ng-repeat="x in $ctrl.taskAlertOptions.Whens" value="{{x.value}}">{{x.name}}</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="col-sm-3 control-label">If Status:</label>
                <div class="col-sm-4">
                    <select id="on_type" ng-model="$ctrl.taskAlertOptions.IfNot" class="form-control">
                        <option ng-repeat="x in $ctrl.taskAlertOptions.IfNots" value="{{x}}">{{x}}</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="col-sm-3 control-label">Status:</label>
                <div class="col-sm-4">
                    <select id="frequency" ng-model="$ctrl.taskAlertOptions.IfStatus" class="form-control">
                        <option ng-repeat="x in $ctrl.taskAlertOptions.IfStatuses" value="{{x}}">{{x}}</option>
                    </select>
                </div>
            </div>
          
        </form>`)(scope);

        if (!this.taskAlertOptions.name) {
            this.modalErrors.push({control: $("#new_task_alert_name", body)[0], error: "Name is required."});
        }

        this.DialogService.dialog(updateId ? "Update Task Alert" : "Create Task Alert", body, null, () => {
            let taskAlert = {
                Active: this.taskAlertOptions.Active,
                TaskId: this.selectedTask.Id,
                Name: this.taskAlertOptions.name,
                TimeN : this.taskAlertOptions.TimeN > 0 ? this.taskAlertOptions.TimeN : null,
                TimeUnit: this.taskAlertOptions.TimeN > 0 ? this.taskAlertOptions.TimeUnit : null,
                When: this.taskAlertOptions.When,
                IfNot: this.taskAlertOptions.IfNot === "Is Not",
                IfStatus: this.taskAlertOptions.IfStatus
            };

            taskAlert.Users = [];
            this.taskAlertOptions.users.filter((elem) => { return elem.selected; }).forEach((elem) => { taskAlert.Users.push({ UserId: elem.Id }); });

            if (!taskAlert.Name) {
                return false;
            } else {
                this.working = updateId ? "Updating Task Alert..." : "Saving Task Alert...";
                
                if (updateId) {
                    taskAlert.Id = updateId;
                    this.TaskAlertService.update(taskAlert)
                    .then((response) => {
                        this.$scope.$evalAsync(() => {
                            let index = this.selectedTask.Alerts.findIndex((elem) => { return elem.Id === response.data.taskAlert.Id; });
                            this.selectedTask.Alerts[index] = response.data.taskAlert;
                            this.copiedTask.Alerts[index] = response.data.taskAlert;
                            this.taskAlertsTable.row(row).data(response.data.taskAlert).draw().show().draw(false);
                        });

                        this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
                } else {
                    this.TaskAlertService.create(taskAlert)
                    .then((response) => {
                        this.$scope.$evalAsync(() => {
                            this.selectedTask.Alerts.push(response.data.taskAlert);
                            this.copiedTask.Alerts.push(response.data.taskAlert);
                            this.taskAlertsTable.row.add(response.data.taskAlert).draw().show().draw(false);
                        });

                        this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
                }
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy() });
    }

    updateSchedule(updateId, row) {
        let scope = this.$scope.$new();
        this.modalErrors = [];

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the task schedule can be ` + (updateId ? "updated" : "created") + `!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Active:</label>
                <div class="col-sm-9 btn-group" role="group">
                    <button type="button" class="btn btn-default btn-yes-no" ng-class="$ctrl.scheduleOptions.Active ? 'active' : ''" ng-click="$ctrl.scheduleOptions.Active = true; $ctrl.markDirty()">Yes</button>
                    <button type="button" class="btn btn-default btn-yes-no" ng-class="!$ctrl.scheduleOptions.Active ? 'active' : ''" ng-click="$ctrl.scheduleOptions.Active = false; $ctrl.markDirty()">No</button>
                </div>
            </div>
            <div class="form-group has-feedback` + (!this.scheduleOptions.name ? ` has-error` : ``) + `">
                <label class="col-sm-3 control-label">Name:</label>
                <div class="col-sm-9">
                    <input id="new_schedule_name" ng-model="$ctrl.scheduleOptions.name" class="form-control" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Add Asset:</label>
                 <div class="col-sm-9">
                    <select class="form-control add-schedule-asset">
                        <option selected disabled value="">Choose an Asset...</option>
                        <option ng-repeat="x in $ctrl.scheduleOptions.assets | filter:{selected:false}" value="{{x.Id}}">{{x.DisplayName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" ng-repeat="x in $ctrl.scheduleOptions.assets | filter:{selected:true}">
                <label class="control-label col-sm-3">Asset:</label>
                 <div class="col-sm-9 input-group">
                    <input class="form-control" disabled value="{{x.DisplayName}}" />
                    <span class="input-group-btn remove-schedule-asset" data-schedule-asset="{{x.Id}}">
                        <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-remove"></i></button>
                    </span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Add User:</label>
                 <div class="col-sm-9">
                    <select class="form-control add-schedule-user">
                        <option selected disabled value="">Choose a User...</option>
                        <option ng-repeat="x in $ctrl.scheduleOptions.users | filter:{selected:false}" value="{{x.Id}}">{{x.FullName || x.UserName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" ng-repeat="x in $ctrl.scheduleOptions.users | filter:{selected:true}">
                <label class="control-label col-sm-3">User:</label>
                 <div class="col-sm-9 input-group">
                    <input class="form-control" disabled value="{{x.FullName || x.UserName}}" />
                    <span class="input-group-btn remove-schedule-user" data-schedule-user="{{x.Id}}">
                        <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-remove"></i></button>
                    </span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">Repeats:</label>
                <div class="col-sm-4">
                    <select id="frequency" ng-model="$ctrl.scheduleOptions.frequency" class="form-control">
                        <option ng-repeat="option in $ctrl.scheduleOptions.frequencies" value="{{option.id}}">{{option.value}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">Every:</label>
                <div class="col-sm-4">
                    <select id="every_n" ng-model="$ctrl.scheduleOptions.everyN" class="form-control">
                        <option ng-repeat="option in $ctrl.scheduleOptions.everyNs" value="{{option.id}}">{{option.value}}</option>
                    </select>
                </div>
                <div class="col-sm-4" style="padding-top: 6px; padding-left: 0px;">
                    {{ $ctrl.scheduleOptions.frequency === '0' ? 'Day(s)' : ($ctrl.scheduleOptions.frequency === '1' ? 'Week(s)' : ($ctrl.scheduleOptions.frequency === '2' ? 'Month(s)' : ($ctrl.scheduleOptions.frequency === '3' ? 'Quarter(s)' : 'Year(s)'))) }}
                </div>
            </div>
            <div class="form-group" ng-show="$ctrl.scheduleOptions.frequency == 2">
                <label class="col-sm-3 control-label">On:</label>
                <div class="col-sm-5">
                    <select id="on_week" ng-model="$ctrl.scheduleOptions.onWeek" class="form-control">
                        <option ng-repeat="option in $ctrl.scheduleOptions.weeks" value="{{option.id}}">{{option.value}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" ng-show="$ctrl.scheduleOptions.frequency > 0 && $ctrl.scheduleOptions.frequency < 3 && !($ctrl.scheduleOptions.frequency == 2 && $ctrl.scheduleOptions.onWeek == 6)">
                <label class="col-sm-3 control-label">On Days:</label>
                <div class="col-sm-8">
                    <span ng-repeat="dayOfWeek in $ctrl.scheduleOptions.daysOfWeek">
                        <label class="checkbox-inline" style="margin-right: 8px;">
                            <input type="checkbox" ng-model="$ctrl.scheduleOptions.daysOfWeek[dayOfWeek.id].selected" ng-change="$ctrl.validateDow(dayOfWeek.id);" ng-required="true" name="on_dow" id="{{dayOfWeek.id}}" />
                                {{dayOfWeek.name}}
                        </label>
                    </span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">Starts On:</label>
                <div class="col-sm-4">
                    <datepicker model="$ctrl.scheduleOptions.startsOnDate" id="new_schedule_starts_on" format="MM/dd/yyyy"></datepicker>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">Due By:</label>
                <div class="col-sm-4">
                    <select id="on_week" ng-model="$ctrl.scheduleOptions.time" class="form-control">
                        <option selected value="any">Any Time</option>
                        <option value="time">Time of Day</option>
                    </select>
                </div>
                <div class="col-sm-4" ng-show="$ctrl.scheduleOptions.time === 'time'">
                    <div uib-timepicker ng-model="$ctrl.scheduleOptions.startsOnDate" hour-step="1" minute-step="1" show-meridian="true"></div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">As Early as:</label>
                <div class="col-sm-4">
                     <input type="number" class="form-control" width="100" min="1" max="12" ng-model="$ctrl.scheduleOptions.asEarlyAsN" />
                </div>
                <div class="col-sm-4" style="padding-left: 0px; padding-right: 30px;">
                    <select id="frequency" ng-model="$ctrl.scheduleOptions.asEarlyAsFrequency" class="form-control">
                        <option  value="">Not Specified</option>
                        <option ng-repeat="option in $ctrl.scheduleOptions.asEarlyAsFrequencies" value="{{option.id}}">{{option.value}}</option>
                    </select>
                </div>
                <div class="col-sm-1" style="padding-top: 6px; padding-left: 0px; margin-left: -16px;">
                    Before
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">End After:</label>
                <div class="col-sm-4">
                    <select id="on_week" ng-model="$ctrl.scheduleOptions.endsOn" class="form-control">
                        <option selected value="occurrence"># of Times</option>
                        <option value="date">Date</option>
                    </select>
                </div>
                <div class="col-sm-4" ng-show="$ctrl.scheduleOptions.endsOn === 'occurrence'" style="padding-left: 0px; padding-right: 30px;">
                    <input type="number" class="form-control" width="100" min="1" max="52" ng-model="$ctrl.scheduleOptions.endsAfter" />
                </div>
                <div class="col-sm-4" ng-show="$ctrl.scheduleOptions.endsOn === 'date'" style="padding-left: 0px; padding-right: 30px;">
                    <datepicker model="$ctrl.scheduleOptions.endsOnDate" id="new_schedule_ends_on" format="MM/dd/yyyy"></datepicker>
                </div>
            </div>
        </form>`)(scope);

        if (!this.scheduleOptions.name){
            this.modalErrors.push({control: $("#new_schedule_name", body)[0], error: "Name is required."});
        }

        this.DialogService.dialog(updateId ? "Update Task Schedule" : "Create Task Schedule", body, null, () => {
            let startsOn = this.scheduleOptions.startsOnDate;

            if (this.scheduleOptions.time === "any") {
                if (startsOn.setHours) {
                    startsOn.setHours(0,0,0,0);
                } else {
                    startsOn.startOf("day");
                }
            }

            let schedule = {
                Active: this.scheduleOptions.Active,
                AsEarlyAsN: this.scheduleOptions.asEarlyAsN || "",
                AsEarlyAsFrequency: this.scheduleOptions.asEarlyAsFrequency ? this.scheduleOptions.asEarlyAsFrequencies[this.scheduleOptions.asEarlyAsFrequency].value : "",
                AnyTime: this.scheduleOptions.time === "any" ? true : false,
                TaskId: this.selectedTask.Id,
                Name: this.scheduleOptions.name,
                EndsAfter: this.scheduleOptions.endsOn === "occurrence" ? this.scheduleOptions.endsAfter : null,
                EndsOn: this.scheduleOptions.endsOn === "date" ? this.scheduleOptions.endsOnDate : null,
                EveryN: this.scheduleOptions.everyN,
                Frequency: this.scheduleOptions.frequencies[this.scheduleOptions.frequency].value,
                OnWeek: this.scheduleOptions.onWeek,
                OnSunday: this.scheduleOptions.daysOfWeek[0].selected,
                OnMonday: this.scheduleOptions.daysOfWeek[1].selected,
                OnTuesday: this.scheduleOptions.daysOfWeek[2].selected,
                OnWednesday: this.scheduleOptions.daysOfWeek[3].selected,
                OnThursday: this.scheduleOptions.daysOfWeek[4].selected,
                OnFriday: this.scheduleOptions.daysOfWeek[5].selected,
                OnSaturday: this.scheduleOptions.daysOfWeek[6].selected,
                StartsOn: startsOn
            };

            schedule.Assets = [];
            this.scheduleOptions.assets.filter((elem) => { return elem.selected; }).forEach((elem) => { schedule.Assets.push({ AssetId: elem.Id, ScheduleAssetTypeId: 1 }); });
            schedule.Users = [];
            this.scheduleOptions.users.filter((elem) => { return elem.selected; }).forEach((elem) => { schedule.Users.push({ UserId: elem.Id, ScheduleUserTypeId: 1 }); });

            if (!schedule.Name) {
                return false;
            } else {
                this.working = updateId ? "Updating Task Schedule..." : "Saving Task Schedule...";
                
                if (updateId) {
                    schedule.Id = updateId;
                    this.ScheduleService.update(schedule)
                    .then((response) => {
                        this.$scope.$evalAsync(() => {
                            let index = this.selectedTask.Schedules.findIndex((elem) => { return elem.Id === response.data.schedule.Id; });
                            this.selectedTask.Schedules[index] = response.data.schedule;
                            this.copiedTask.Schedules[index] = response.data.schedule;
                            this.schedulesTable.row(row).data(response.data.schedule).draw().show().draw(false);
                        });

                        this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
                } else {
                    this.ScheduleService.create(schedule)
                    .then((response) => {
                        this.$scope.$evalAsync(() => {
                            this.selectedTask.Schedules.push(response.data.schedule);
                            this.copiedTask.Schedules.push(response.data.schedule);
                            this.schedulesTable.row.add(response.data.schedule).draw().show().draw(false);
                        });

                        this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
                }
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy() });
    }

    save() {
        this.working = "Saving Task...";
        let xml = {Property: []};

        $(".table-metadata > tbody > tr").each((index, value) => {
            let row = $(value);
            xml.Property.push({ 
                Name: row.children("td:eq(0)").children("input").val(),
                Value: row.children("td:eq(1)").children("input").val()
            });
        });

        this.copiedTask.Metadata = JSON.stringify(xml);
        this.TaskService.update(this.copiedTask)
        .then((response) => {
            $(".table-metadata > tbody > tr").remove();

            this.$scope.$evalAsync(() => {
                this.copiedTask = angular.copy(response.data.task);
                this.tasks[this.tasks.findIndex((elem) => { return elem.Id === this.copiedTask.Id; })] = response.data.task;
                this.table.row('.selected').data(this.copiedTask).draw().show().draw(false);
            });

            this.dirty = false;
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "")
	}

	setScheduleOptions(schedule) {
		this.scheduleOptions.Active = schedule.Active;
		this.scheduleOptions.asEarlyAsN = schedule.AsEarlyAsN || "";
		this.scheduleOptions.asEarlyAsFrequency = "";

		switch (schedule.AsEarlyAsFrequency) {
			case "Minute(s)": this.scheduleOptions.asEarlyAsFrequency = "0"; break;
			case "Hour(s)": this.scheduleOptions.asEarlyAsFrequency = "1"; break;
			case "Day(s)": this.scheduleOptions.asEarlyAsFrequency = "2"; break;
			case "Week(s)": this.scheduleOptions.asEarlyAsFrequency = "3"; break;
			case "Month(s)": this.scheduleOptions.asEarlyAsFrequency = "4"; break;
		}

		this.scheduleOptions.time = schedule.AnyTime ? "any" : "time";
		this.scheduleOptions.name = schedule.Name;
		this.scheduleOptions.endsOn = schedule.EndsOn ? "date" : "occurrence";
		this.scheduleOptions.endsAfter = schedule.EndsAfter;
		this.scheduleOptions.endsOnDate = moment(schedule.EndsOn).toDate();
		this.scheduleOptions.everyN = schedule.EveryN.toString();

		switch (schedule.Frequency) {
			case "Daily": this.scheduleOptions.frequency = "0"; break;
			case "Weekly": this.scheduleOptions.frequency = "1"; break;
			case "Monthly": this.scheduleOptions.frequency = "2"; break;
			case "Quarterly": this.scheduleOptions.frequency = "3"; break;
			case "Yearly": this.scheduleOptions.frequency = "4"; break;
		}

		this.scheduleOptions.onWeek = schedule.OnWeek ? schedule.OnWeek.toString() : null;
		this.scheduleOptions.daysOfWeek[0].selected = schedule.OnSunday;
		this.scheduleOptions.daysOfWeek[1].selected = schedule.OnMonday;
		this.scheduleOptions.daysOfWeek[2].selected = schedule.OnTuesday;
		this.scheduleOptions.daysOfWeek[3].selected = schedule.OnWednesday;
		this.scheduleOptions.daysOfWeek[4].selected = schedule.OnThursday;
		this.scheduleOptions.daysOfWeek[5].selected = schedule.OnFriday;
		this.scheduleOptions.daysOfWeek[6].selected = schedule.OnSaturday;
		this.scheduleOptions.startsOnDate = schedule.StartsOn ? moment(schedule.StartsOn).toDate() : moment().toDate();
		this.scheduleOptions.assets.forEach((elem) => { elem.selected = schedule.Assets.find((asset) => { return asset.AssetId === elem.Id; }) !== undefined; });
		this.scheduleOptions.users.forEach((elem) => { elem.selected = schedule.Users.find((user) => { return user.UserId === elem.Id; }) !== undefined; });
	}

    validateDow(id) {
        if (!this.scheduleOptions.daysOfWeek.some(function (e) { return e.id != id && e.selected })) {
            this.scheduleOptions.daysOfWeek[id].selected = true;
        }
    }
}

TasksController.$inject = [
    "AppConfig", 
    "DialogService", 
    "TaskService",
    "TaskAlertService",
    "TaskCategoryService", 
    "TaskTypeService", 
    "ScheduleService", 
    "FormService", 
    "AssetService", 
    "UserService", 
    "$scope", 
    "$compile"
];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const tasks = {
    controller: TasksController,
    templateUrl: "Views/Task/tasks.html",
};
