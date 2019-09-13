import {getAssetName, relativeDate} from "../../Utility/utility";

// The controller for the `asset types` component
class AssetLogTypesController {
    constructor(AppConfig, DialogService, AssetService, AssetLogTypeService, AssetLogTypeCategoryService, $scope, $compile) {
        this.AppConfig = AppConfig;
        this.DialogService = DialogService;
        this.AssetService = AssetService;
        this.AssetLogTypeService = AssetLogTypeService;
        this.AssetLogTypeCategoryService = AssetLogTypeCategoryService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.dirty = false; 

        this.clearType();
        this.init();
    }

    clearType() {
        this.$scope.$evalAsync(() => {
            this.copiedType = {
                Id: null,
                AssetLogTypeCategoryId: null,
                Active: false,
                CanComment: true,
                CanResolve: false,
                Name: "",
                Description: "",
                Value: null,
                System: false
            }
        });
    }

    createNew() {
        this.newType = {
            Active: true,
            AssetLogTypeCategoryId: this.categories.find((elem) => { return elem.Name === "Not Specified"; }).Id.toString(),
            CanComment: true,
            CanResolve: false,
            Name: "",
            Description: ""
        };

        let scope = this.$scope.$new();
        let categoryOptions = ``;

        angular.forEach(this.categories, (elem) => {
            categoryOptions += `<option value="` + elem.Id + `">` + elem.Name + `</option>`;
        });

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the asset log type can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Category:</label>
                <div class="col-sm-9">
                    <select id="new_asset_type" ng-model="$ctrl.newType.AssetLogTypeCategoryId" class="form-control">`
                    + categoryOptions +
                    `</select>
                </div>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Name:</label>
                <div class="col-sm-9">
                    <input id="new_type_name" ng-model="$ctrl.newType.Name" class="form-control" type="text" req-data="Name" rd-errors="$ctrl.modalErrors" unq-name un-err-model="$ctrl.modalErrors" un-items="$ctrl.types" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <input id="new_type_description" ng-model="$ctrl.newType.Description" class="form-control" type="text" />
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_type_name", body)[0], error: "Name is required."});

        this.DialogService.dialog("Create Asset Log Type", body, null, () => {
            if (this.modalErrors.length > 0){
                return false;
            } else {
                this.working = "Saving Asset Log Type...";
                this.AssetLogTypeService.create(this.newType)
                .then((response) => {
                    this.types.push(response.data.assetLogType);
                    this.table.row.add(response.data.assetLogType).select().draw().show().draw(false);
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
            this.copiedType = angular.copy(this.selectedType);
            this.table.row('.selected').data(this.copiedType).draw().show().draw(false);
            this.assets.forEach((elem) => { elem.selected = this.copiedType.Assets.find((asset) => { return asset.AssetId === elem.Id }) != null; });
        });

        this.dirty = false;
    }

    init() {
        this.working = "";
        this.errors = [];
        this.modalErrors = [];

        this.table = $("#types").DataTable({
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
            this.selectedType = this.table.rows('.selected').data()[0];
            this.$scope.$evalAsync(() => { 
                this.copiedType = angular.copy(this.selectedType);
                this.assets.forEach((elem) => { elem.selected = this.copiedType.Assets.find((asset) => { return asset.AssetId === elem.Id }) != null; });
            });
        }).on("deselect", () => {
            this.clearType();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Create New Asset Log Type" class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));
        
        var onAddTypeAsset = (e) => {
            let $elem = $(e.currentTarget);
            
            if ($elem.val()) {
                this.$scope.$evalAsync(() => {
                    this.assets.find((elem) => { return elem.Id == $elem.val(); }).selected = true;
                    $(document).off("change", ".add-type-asset", onAddTypeAsset);
                    $elem.val("");
                    $(document).on("change", ".add-type-asset", onAddTypeAsset);
                    this.markDirty();
                });     
            }
        };

        $(document).on("change", ".add-type-asset", onAddTypeAsset);

        $(document).on("click", ".remove-type-asset", (e) => {
            let $elem = $(e.currentTarget);

            this.$scope.$evalAsync(() => {
                this.assets.find((elem) => { return elem.Id == $elem.data("type-asset"); }).selected = false;
                $elem.parents(".form-group").remove();
                this.markDirty();
            });
        });

        this.working = "Loading Asset Log Type Categories...";
        this.AssetLogTypeCategoryService.list()
        .then((response) => {
            this.categories = response.data.assetLogTypeCategories;
            this.categories.sort((a,b) => { return a.Name === "Not Specified" ? -1 : a.Name.localeCompare(b.Name); });
            this.working = "Loading Asset Log Types...";
            return this.AssetLogTypeService.list();
        })
        .then((response) => {
            this.types = response.data.assetLogTypes;
            this.table.rows.add(this.types).draw();  
            this.working = "Loading Assets...";
            return this.AssetService.list();
        })
        .then((response) => {
            this.assets = response.data.assets;
            this.assets.sort((a,b) => { return a.Name.localeCompare(b.Name) || a.CustomId.localeCompare(b.CustomId); });
            this.assets.forEach((elem) => { 
                elem.selected = false;
                elem.DisplayName = getAssetName(elem);
            });
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
        this.working = "Saving Asset Log Type...";
        this.copiedType.Assets = [];
        this.assets.filter((elem) => { return elem.selected; }).forEach((elem) => { this.copiedType.Assets.push({ AssetId: elem.Id }); });

        this.AssetLogTypeService.update(this.copiedType)
        .then((response) => {
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")

            this.$scope.$evalAsync(() => {
                this.copiedType = angular.copy(response.data.assetLogType);
                this.types[this.types.findIndex((elem) => { return elem.Id === this.copiedType.Id; })] = response.data.assetLogType;
                this.table.row('.selected').data(this.copiedType).draw().show().draw(false);
            });

            this.dirty = false;
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "")
    }

}

AssetLogTypesController.$inject = ["AppConfig", "DialogService", "AssetService", "AssetLogTypeService", "AssetLogTypeCategoryService", "$scope", "$compile"];

export const assetLogTypes = {
    controller: AssetLogTypesController,
    templateUrl: "Views/Asset/logTypes.html",
};
