import {relativeDate} from "../../Utility/utility";

// The controller for the `asset groups` component
class AssetGroupsController {
    constructor(AppConfig, DialogService, AssetGroupService, $scope, $compile) {
        this.AppConfig = AppConfig;
        this.DialogService = DialogService;
        this.AssetGroupService = AssetGroupService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.dirty = false; 

        this.clearGroup();
        this.init();
    }

    clearGroup() {
        this.$scope.$evalAsync(() => {
            this.copiedGroup = {
                Id: null,
                Active: false,
                Name: "",
                Description: "",
                Value: null,
                System: false
            }
        });
    }

    createNew() {
        this.newGroup = {
            Active: true,
            Name: "",
            Description: ""
        };

        let scope = this.$scope.$new();

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the asset group can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Name:</label>
                <div class="col-sm-9">
                    <input id="new_group_name" ng-model="$ctrl.newGroup.Name" class="form-control" type="text" req-data="Name" rd-errors="$ctrl.modalErrors" unq-name un-err-model="$ctrl.modalErrors" un-items="$ctrl.groups" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <input id="new_group_description" ng-model="$ctrl.newGroup.Description" class="form-control" type="text" />
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_group_name", body)[0], error: "Name is required."});

        this.DialogService.dialog("Create Asset Group", body, null, () => {
            if (this.modalErrors.length > 0){
                return false;
            } else {
                this.working = "Saving Asset Group...";
                this.AssetGroupService.create(this.newGroup)
                .then((response) => {
                    this.groups.push(response.data.assetGroup);
                    this.table.row.add(response.data.assetGroup).select().draw().show().draw(false);
                })
                .catch((error) => { this.DialogService.error(error); scope.$destroy(); })
                .finally(() => this.working = "" );
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    discard() {
        this.errors = [];
        $(".has-error").removeClass("has-error");

        this.$scope.$evalAsync(() => { 
            this.copiedGroup = angular.copy(this.selectedGroup);
            this.table.row('.selected').data(this.copiedGroup).draw().show().draw(false);
            this.assets.forEach((elem) => { elem.selected = this.copiedGroup.Assets.find((asset) => { return asset.AssetId === elem.Id }) != null; });
        });

        this.dirty = false;
    }

    init() {
        this.working = "";
        this.errors = [];
        this.modalErrors = [];

        this.table = $("#groups").DataTable({
            dom: '<"dt-toolbar"<"create-new-button"><"dt-toolbar-length"l><"dt-toolbar-filter"f>>rt<"dt-footer"<"dt-footer-info"i><"dt-footer-pager"p>>',
            columns: [
                { data: null, width: "25px", render: ( data, type, row ) => { return row.Active ? "Yes" : "No"; } },
                { data: "Name" },
                { data: "Description" }
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
            this.selectedGroup = this.table.rows('.selected').data()[0];
            this.$scope.$evalAsync(() => { 
                this.copiedGroup = angular.copy(this.selectedGroup);
            });
        }).on("deselect", () => {
            this.clearGroup();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Create New Asset Group" class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));

        this.working = "Loading Asset Groups...";
        this.AssetGroupService.list()
        .then((response) => {
            this.groups = response.data.assetGroups;
            this.table.rows.add(this.groups).draw();  
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

    save() {
        this.working = "Saving Asset Group...";
        this.AssetGroupService.update(this.copiedGroup)
        .then((response) => {
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")

            this.$scope.$evalAsync(() => {
                this.copiedGroup = angular.copy(response.data.assetGroup);
                this.groups[this.groups.findIndex((elem) => { return elem.Id === this.copiedGroup.Id; })] = response.data.assetGroup;
                this.table.row('.selected').data(this.copiedGroup).draw().show().draw(false);
            });

            this.dirty = false;
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "")
    }

}

AssetGroupsController.$inject = ["AppConfig", "DialogService", "AssetGroupService", "$scope", "$compile"];

export const assetGroups = {
    controller: AssetGroupsController,
    templateUrl: "Views/Asset/groups.html",
};
