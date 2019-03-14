import {relativeDate} from "../../Utility/utility";

// The controller for the `asset types` component
class AssetLogTypeCategoriesController {
    constructor(AppConfig, DialogService, AssetLogTypeCategoryService, $scope, $compile) {
        this.AppConfig = AppConfig;
        this.DialogService = DialogService;
        this.AssetLogTypeCategoryService = AssetLogTypeCategoryService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.dirty = false; 

        this.clearType();
        this.init();
        this.loadTypes();
    }

    clearType() {
        this.$scope.$evalAsync(() => {
            this.copiedType = {
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
        let scope = this.$scope.$new();
        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the asset log type can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Name:</label>
                <div class="col-sm-9">
                    <input id="new_type_name" class="form-control" type="text" req-data="Name" rd-errors="$ctrl.modalErrors" unq-name un-err-model="$ctrl.modalErrors" un-items="$ctrl.types" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <input id="new_type_description" class="form-control" type="text" />
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_type_name", body)[0], error: "Name is required."});

        this.DialogService.dialog("Create Asset Log Type Category", body, null, () => {
            let newType = {
                Active: true,
                Name: $("#new_type_name").val(),
                Description: $("#new_type_description").val()
            };

            if (this.modalErrors.length > 0){
                return false;
            } else {
                this.working = "Saving Asset Log Type Category...";
                this.AssetLogTypeCategoryService.create(newType)
                .then((response) => {
                    this.types.push(response.data.assetLogTypeCategory);
                    this.table.row.add(response.data.assetLogTypeCategory).select().draw().show().draw(false);
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
        });

        this.dirty = false;
    }

    loadTypes() {
        this.working = "Loading Asset Log Type Category Categories...";
        this.AssetLogTypeCategoryService.list()
        .then((response) => {
            this.types = response.data.assetLogTypeCategories;
            this.table.rows.add(this.types).draw();            
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
            });
        }).on("deselect", () => {
            this.clearType();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Create New Asset Log Type Category" class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));
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
        this.working = "Saving Asset Log Type Category...";
        this.AssetLogTypeCategoryService.update(this.copiedType)
        .then((response) => {
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")

            this.$scope.$evalAsync(() => {
                this.copiedType = angular.copy(response.data.assetLogTypeCategory);
                this.types[this.types.findIndex((elem) => { return elem.Id === this.copiedType.Id; })] = response.data.assetLogTypeCategory;
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

AssetLogTypeCategoriesController.$inject = ["AppConfig", "DialogService", "AssetLogTypeCategoryService", "$scope", "$compile"];

export const assetLogTypeCategories = {
    controller: AssetLogTypeCategoriesController,
    templateUrl: "Views/Asset/logTypeCategories.html",
};
