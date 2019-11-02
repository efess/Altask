import {relativeDate, assetAlertSummary} from "../../Utility/utility";

// The controller for the `assets` component
class AssetsController {
    constructor(
        $compile,
        $scope,
        AppConfig,
        AssetAlertService,
        AssetGroupService,
        AssetLogTypeCategoryService,
        AssetLogTypeService,
        AssetService,
        AssetTypeService,
        DepartmentService,
        DialogService,
        ManufacturerService,
        UserService) 
    {
        this.$compile = $compile;
        this.$scope = $scope;
        this.AppConfig = AppConfig;
        this.AssetAlertService = AssetAlertService;
        this.AssetGroupService = AssetGroupService;
        this.AssetLogTypeCategoryService = AssetLogTypeCategoryService;
        this.AssetLogTypeService = AssetLogTypeService;
        this.AssetService = AssetService;
        this.AssetTypeService = AssetTypeService;
        this.DepartmentService = DepartmentService;
        this.DialogService = DialogService;
        this.ManufacturerService = ManufacturerService;
        this.UserService = UserService;
        this.dirty = false; 

        this.clearAsset();
        this.init();
    }

    addAlert() {
        let categoryId = this.logCategories.find((elem) => { return elem.Name === "Note"; }).Id;

        this.assetAlertOptions = {
            name: "",
            assetLogTypeCategoryId: categoryId,
            assetLogTypeId: this.logTypes.length > 0 ? this.logTypes.find((elem) => { return elem.AssetLogTypeCategoryId === categoryId; }).Id : "",
            users: angular.copy(this.users)
        };

        this.assetAlertOptions.users.forEach((elem) => { elem.selected = false; });
        this.updateAlert();
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

    clearAsset() {
        $(".table-metadata > tbody > tr").remove();
        this.$scope.$evalAsync(() => {
            this.copiedAsset = {
                Id: null,
                Active: false,
                Name: "",
                Description: "",
                Type: null,
                TypeId: "",
                CustomId: "",
                DepartmentId: "",
                ManufacturerId: "",
                Model: "",
                Serial: "",
                Metadata: { Properties: [] }
            }
        });
    }

    copyAlert(e, row) {
        e.stopPropagation();
        let assetAlert = angular.copy(this.assetAlertsTable.row(row).data());
        assetAlert.Id = null;
        this.assetAlertOptions.name = assetAlert.Name || "";
        this.assetAlertOptions.assetLogTypeCategoryId = this.logTypes.find((elem) => { return elem.Id === assetAlert.AssetLogTypeId; }).AssetLogTypeCategoryId;
        this.assetAlertOptions.assetLogTypeId = assetAlert.AssetLogTypeId || "";
        this.assetAlertOptions.users.forEach((elem) => { elem.selected = assetAlert.Users.find((user) => { return user.UserId === elem.Id; }) !== undefined; });
        this.updateAlert(); 
    }

    createNew() {
        this.newAsset = {
            Active: true,
            AssetTypeId: this.assetTypes[0].Id.toString(),
            Name: "",
            CustomId: ""
        };

        let scope = this.$scope.$new();
        let typeOptions = ``;

        angular.forEach(this.assetTypes, (elem) => {
            typeOptions += `<option value="` + elem.Id + `">` + elem.Name + `</option>`;
        });

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the asset can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Type:</label>
                <div class="col-sm-9">
                    <select id="new_asset_type" ng-model="$ctrl.newAsset.AssetTypeId" class="form-control">`
                    + typeOptions +
                    `</select>
                </div>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Name:</label>
                <div class="col-sm-9">
                    <input id="new_asset_name" class="form-control" type="text" ng-model="$ctrl.newAsset.Name" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Custom ID:</label>
                <div class="col-sm-9">
                    <input ng-model="$ctrl.newAsset.CustomId" class="form-control" type="text" />
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_asset_name", body)[0], error: "Name is required."});

        this.DialogService.dialog("Create Asset", body, null, () => {
            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving Asset...";
                this.AssetService.create(this.newAsset)
                .then((response) => {
                    $(".table-metadata > tbody > tr").remove();
                    this.assets.push(response.data.asset);
                    this.table.row.add(response.data.asset).select().draw().show().draw(false);
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
            this.copiedAsset = angular.copy(this.selectedAsset);
            this.table.row('.selected').data(this.copiedAsset).draw();
            this.groups.forEach((elem) => { elem.selected = this.copiedAsset.Groups.find((group) => { return group.AssetGroupId === elem.Id }) != null; });
        });

        this.dirty = false;
    }

    editAlert(e, row) {
        e.stopPropagation();
        let assetAlert = angular.copy(this.assetAlertsTable.row(row).data());
        this.assetAlertOptions.name = assetAlert.Name;
        this.assetAlertOptions.assetLogTypeCategoryId = this.logTypes.find((elem) => { return elem.Id === assetAlert.AssetLogTypeId; }).AssetLogTypeCategoryId;
        this.assetAlertOptions.assetLogTypeId = assetAlert.AssetLogTypeId || "";
        this.assetAlertOptions.users.forEach((elem) => { elem.selected = assetAlert.Users.find((user) => { return user.UserId === elem.Id; }) !== undefined; });
        this.updateAlert(assetAlert.Id, row); 
    }

    filterLogType() {
        return (logType) => { return logType.AssetLogTypeCategoryId === this.assetAlertOptions.assetLogTypeCategoryId &&
            (logType.Assets.length > 0 ? logType.Assets.find((elem) => { return elem.AssetId === this.copiedAsset.Id; }) !== undefined : true); };
    }

    init() {
        this.working = "";
        this.errors = [];
        this.modalErrors = [];

        this.table = $("#assets").DataTable({
            dom: '<"dt-toolbar"<"create-new-button"><"dt-toolbar-length"l><"dt-toolbar-filter"f>>rt<"dt-footer"<"dt-footer-info"i><"dt-footer-pager"p>>',
            columns: [
                { data: null, width: "25px", render: ( data, type, row ) => { return row.Active ? "Yes" : "No"; } },
                { data: "Name" },
                { data: "CustomId" },
                { render: function( data, type, row, meta ) { return row.Type.Name; }},
                { render: function( data, type, row, meta ) { return row.Department ? row.Department.Name : ""; }},
                { render: function( data, type, row, meta ) { return row.Manufacturer ? row.Manufacturer.Name : ""; }},
                { data: "Model" },
                { data: "Serial" }
            ],
            select: "single",
            drawCallback: function(settings) {
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
            this.selectedAsset = this.table.rows('.selected').data()[0];
            $(".table-metadata > tbody > tr").remove();
            this.$scope.$evalAsync(() => { 
                this.copiedAsset = angular.copy(this.selectedAsset);
                this.assetAlertsTable.clear();
                this.assetAlertsTable.rows.add(this.copiedAsset.Alerts).draw();
                this.copiedAsset.DepartmentId = this.copiedAsset.DepartmentId || "";
                this.copiedAsset.ManufacturerId = this.copiedAsset.ManufacturerId || "";
                this.groups.forEach((elem) => { elem.selected = this.copiedAsset.Groups.find((group) => { return group.AssetGroupId === elem.Id }) != null; });
            });
        }).on("deselect", () => {
            this.clearAsset();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Add New Asset..." class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));

        this.assetAlertsTable = $("#asset_alerts").DataTable({
            dom: 't',
            columns: [
                { data: null, width: "25px", render: ( data, type, row ) => { return row.Active ? "Yes" : "No"; } },
                { className: "tbl-btn-group-next", render: function( data, type, row ) { return assetAlertSummary(row); }},
                { className: "tbl-btn-group", render: (data, type, row, meta) => { return `<span data-toggle="tooltip" title="Copy Asset Alert" class="tbl-btn copy-asset-alert" data-row="` + meta.row + `"><i class="fa fa-clone" aria-hidden="true"></i></span><span data-toggle="tooltip" title="Edit Asset Alert" class="tbl-btn edit-asset-alert" data-row="` + meta.row + `"><i class="fa fa-pencil" aria-hidden="true"></i></span>` }, orderable: false, width: "74px" }
            ],
            paging: false,
            select: "single",
            drawCallback: (settings) => {
                $('#asset_alerts tbody [data-toggle="tooltip"]').tooltip(); 
            }
        });

        $("#asset_alerts").on("click", "tbody td span.copy-asset-alert", (e) => {
            let elem = $(e.currentTarget);
            let row = elem.data("row");
            this.copyAlert(e, row);
        });

        $("#asset_alerts").on("click", "tbody td span.edit-asset-alert", (e) => {
            let elem = $(e.currentTarget);
            let row = elem.data("row");
            this.editAlert(e, row);
        });

        var onAddAssetAlertUser = (e) => {
            let $elem = $(e.currentTarget);
            
            if ($elem.val()) {
                this.$scope.$evalAsync(() => {
                    this.assetAlertOptions.users.find((elem) => { return elem.Id == $elem.val(); }).selected = true;
                    let errorIndex = this.modalErrors.findIndex((elem) => { return elem.error == "Please specify one or more users to be alerted."; });

                    if (errorIndex > -1){
                        this.modalErrors.splice(errorIndex, 1);
                    }

                    $(document).off("change", ".add-asset-alert-user", onAddAssetAlertUser);
                    $elem.val("");
                    $(document).on("change", ".add-asset-alert-user", onAddAssetAlertUser);
                });   
            }
        };

        $(document).on("change", ".add-asset-alert-user", onAddAssetAlertUser);

        $(document).on("click", ".remove-asset-alert-user", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.assetAlertOptions.users.find((elem) => { return elem.Id == $elem.data("asset-alert-user"); }).selected = false;
                $elem.parents(".form-group").remove();

                if (!this.assetAlertOptions.users.some((elem) => { return elem.selected; })) {
                    this.modalErrors.push({ control: null, error: "Please specify one or more users to be alerted." });
                }
            });
        });

        var onAddGroup = (e) => {
            let $elem = $(e.currentTarget);

            if ($elem.val()) {           
                this.$scope.$evalAsync(() => {
                    this.groups.find((elem) => { return elem.Id == $elem.val(); }).selected = true;
                    $(document).off("change", ".add-group", onAddGroup);
                    $elem.val("");
                    $(document).on("change", ".add-group", onAddGroup);
                    this.markDirty();
                });
            }
        };

        $(document).on("change", ".add-group", onAddGroup);

        $(document).on("click", ".remove-group", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.groups.find((elem) => { return elem.Id == $elem.data("group"); }).selected = false;
                $elem.parents(".form-group").remove();
                this.markDirty();
            });
        });

        this.working = "Loading Departments...";
        this.DepartmentService.list()
        .then((response) => {
            this.departments = response.data.departments;
            this.departments.sort((a,b) => { return a.Name.localeCompare(b.Name); });
            this.departments.splice(0, 0, {Id: "", Name: "Not Specified"});
            this.working = "Loading Manufacturers...";
            return this.ManufacturerService.list();
        })
        .then((response) => {
            this.manufacturers = response.data.manufacturers;
            this.manufacturers.sort((a,b) => { return a.Name.localeCompare(b.Name); });
            this.manufacturers.splice(0, 0, {Id: "", Name: "Not Specified"});
            this.working = "Loading Users...";
            return this.UserService.list();
        })
        .then((response) => { 
            this.users = response.data.users;
            this.users.sort((a, b) => { return (a.FullName || a.UserName).localeCompare(b.FullName || b.UserName); });
            this.working = "Loading Asset Groups...";
            return this.AssetGroupService.list();
        })
        .then((response) => { 
            this.groups = response.data.assetGroups;
            this.groups.sort((a, b) => { return a.Name.localeCompare(b.Name); });
            this.working = "Loading Asset Log Type Categories...";
            return this.AssetLogTypeCategoryService.list();
        })
        .then((response) => {
            this.logCategories = response.data.assetLogTypeCategories;
            this.logCategories.sort((a,b) => { return a.Name === "Not Specified" ? -1 : a.Name.localeCompare(b.Name); });
            this.working = "Loading Asset Log Types...";
            return this.AssetLogTypeService.list();
        })
        .then((response) => {
            this.logTypes = response.data.assetLogTypes;
            this.working = "Loading Asset Types...";
            return this.AssetTypeService.list();
        })
        .then((response) => { 
            this.assetTypes = response.data.assetTypes;
            this.working = "Loading Assets...";
            return this.AssetService.list();
        })
        .then((response) => {
            this.assets = response.data.assets;
            this.table.rows.add(this.assets).draw(); 
            this.clearAsset();
            this.resetAssetAlertOptions();
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "");
    }

    isAlertValid() {
        let errorIndex = this.modalErrors.findIndex((elem) => { return elem.error == "Please specify a log category."; });

        if (!this.assetAlertOptions.assetLogTypeCategoryId) {
            if (errorIndex == -1) {
                this.modalErrors.push({ control: null, error: "Please specify a log category." });
            }
        } else {
            if (errorIndex > -1) {
                this.modalErrors.splice(errorIndex, 1);
            }
        }

        errorIndex = this.modalErrors.findIndex((elem) => { return elem.error == "Please specify a log type."; });

        if (!this.assetAlertOptions.assetLogTypeId) {
            if (errorIndex == -1) {
                this.modalErrors.push({ control: null, error: "Please specify a log type." });
            }
        } else {
            if (errorIndex > -1){
                this.modalErrors.splice(errorIndex, 1);
            }
        }
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

    resetAssetAlertOptions() {
        this.$scope.$evalAsync(() => {
            let categoryId = this.logCategories.find((elem) => { return elem.Name === "Note"; }).Id;

            this.assetAlertOptions = {
                name: "",
                assetLogTypeCategoryId: categoryId,
                assetLogTypeId: this.logTypes.length > 0 ? this.logTypes.find((elem) => { return elem.AssetLogTypeCategoryId === categoryId; }).Id : "",
                users: angular.copy(this.users)
            };

            this.assetAlertOptions.users.forEach((elem) => { elem.selected = false; });
        });
    }

    save() {
        this.working = "Saving Asset...";
        let xml = {Property: []};

        $(".table-metadata > tbody > tr").each((index, value) => {
            let row = $(value);
            xml.Property.push({ 
                Name: row.children("td:eq(0)").children("input").val(),
                Value: row.children("td:eq(1)").children("input").val()
            });
        });

        this.copiedAsset.Groups = [];
        this.groups.filter((elem) => { return elem.selected; }).forEach((elem) => { this.copiedAsset.Groups.push({ AssetGroupId: elem.Id }); });
        this.copiedAsset.Metadata = JSON.stringify(xml);
        this.AssetService.update(this.copiedAsset)
        .then((response) => {
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
            $(".table-metadata > tbody > tr").remove();

            this.$scope.$evalAsync(() => {
                this.copiedAsset = angular.copy(response.data.asset);
                this.copiedAsset.DepartmentId = this.copiedAsset.DepartmentId || "";
                this.copiedAsset.ManufacturerId = this.copiedAsset.ManufacturerId || "";
                this.assets[this.assets.findIndex((elem) => { return elem.Id === this.copiedAsset.Id; })] = response.data.asset;
                this.table.row('.selected').data(this.copiedAsset).draw().show().draw(false);
            });

            this.dirty = false;
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "")
    }

    selectLogCategory() {
        this.assetAlertOptions.assetLogTypeId = this.logTypes.length > 0 ? this.logTypes.find((elem) => { return elem.AssetLogTypeCategoryId === this.assetAlertOptions.assetLogTypeCategoryId  &&
            (elem.Assets.length > 0 ? elem.Assets.find((asset) => { return asset.AssetId === this.copiedAsset.Id; }) !== undefined : true); }).Id : "";
    }

    updateAlert(updateId, row) {
        let scope = this.$scope.$new();
        this.modalErrors = [];

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the asset alert can be ` + (updateId ? "updated" : "created") + `!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback` + (!this.assetAlertOptions.name ? ` has-error` : ``) + `">
                <label class="col-sm-3 control-label">Name:</label>
                <div class="col-sm-9">
                    <input id="new_asset_alert_name" ng-model="$ctrl.assetAlertOptions.name" class="form-control" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>

            <div class="form-group">
                <label class="control-label col-sm-3">Add User:</label>
                <div class="col-sm-9">
                    <select class="form-control add-asset-alert-user">
                        <option selected disabled value="">Choose a User...</option>
                        <option ng-repeat="x in $ctrl.assetAlertOptions.users | filter:{selected:false}" value="{{x.Id}}">{{x.FullName || x.UserName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" ng-repeat="x in $ctrl.assetAlertOptions.users | filter:{selected:true}">
                <label class="control-label col-sm-3">User:</label>
                <div class="col-sm-9 input-group">
                    <input class="form-control" disabled value="{{x.FullName || x.UserName}}" />
                    <span class="input-group-btn remove-asset-alert-user" data-asset-alert-user="{{x.Id}}">
                        <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-remove"></i></button>
                    </span>
                </div>
            </div>

            <div class="form-group">
                <label class="control-label col-sm-3">Log Category:</label>
                <div class="col-sm-9">
                    <select class="form-control" ng-change="$ctrl.selectLogCategory(); $ctrl.isAlertValid()" ng-model="$ctrl.assetAlertOptions.assetLogTypeCategoryId" ng-options="x.Id as x.Name for x in $ctrl.logCategories"></select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Log Type:</label>
                <div class="col-sm-9">
                    <select class="form-control" ng-change="$ctrl.isAlertValid()" ng-model="$ctrl.assetAlertOptions.assetLogTypeId" ng-options="x.Id as x.Name for x in $ctrl.logTypes | filter:$ctrl.filterLogType()"></select>
                </div>
            </div>
        </form>`)(scope);

        if (!this.assetAlertOptions.name) {
            this.modalErrors.push({control: $("#new_asset_alert_name", body)[0], error: "Name is required."});
        }

        if (!this.assetAlertOptions.users.some((elem) => { return elem.selected; })) {
            this.modalErrors.push({control: null, error: "Please specify one or more users to be alerted."});
        }

        this.DialogService.dialog(updateId ? "Update Asset Alert" : "Create Asset Alert", body, null, () => {
            let assetAlert = {
                Active: true,
                Name: this.assetAlertOptions.name,
                AssetId: this.selectedAsset.Id,
                AssetLogTypeId: this.assetAlertOptions.assetLogTypeId,
            };

            assetAlert.Users = [];
            this.assetAlertOptions.users.filter((elem) => { return elem.selected; }).forEach((elem) => { assetAlert.Users.push({ UserId: elem.Id }); });

            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = updateId ? "Updating Asset Alert..." : "Saving Asset Alert...";
                
                if (updateId) {
                    assetAlert.Id = updateId;
                    this.AssetAlertService.update(assetAlert)
                    .then((response) => {
                        this.$scope.$evalAsync(() => {
                            let index = this.selectedAsset.Alerts.findIndex((elem) => { return elem.Id === response.data.assetAlert.Id; });
                            this.selectedAsset.Alerts[index] = response.data.assetAlert;
                            this.copiedAsset.Alerts[index] = response.data.assetAlert;
                            this.assetAlertsTable.row(row).data(response.data.assetAlert).draw().show().draw(false);
                        });

                        this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
                } else {
                    this.AssetAlertService.create(assetAlert)
                    .then((response) => {
                        this.$scope.$evalAsync(() => {
                            this.selectedAsset.Alerts.push(response.data.assetAlert);
                            this.copiedAsset.Alerts.push(response.data.assetAlert);
                            this.assetAlertsTable.row.add(response.data.assetAlert).draw().show().draw(false);
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

    overflowing(e) {
        let well = $(".well")[1];
        let form = $("fieldset", well)[0];
        return form.scrollHeight > well.offsetHeight;   
    }
}

AssetsController.$inject = [
    "$compile",
    "$scope",
    "AppConfig",
    "AssetAlertService",
    "AssetGroupService",
    "AssetLogTypeCategoryService",
    "AssetLogTypeService",
    "AssetService",
    "AssetTypeService",
    "DepartmentService",
    "DialogService",
    "ManufacturerService",
    "UserService"
];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const assets = {
    controller: AssetsController,
    templateUrl: "Views/Asset/assets.html",
};
