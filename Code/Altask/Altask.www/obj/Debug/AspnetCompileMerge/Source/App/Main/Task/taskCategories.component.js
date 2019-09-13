import {relativeDate} from "../../Utility/utility";

// The controller for the `task categories` component
class TaskCategoriesController {
    constructor(AppConfig, DialogService, TaskCategoryService, $scope, $compile) {
        this.AppConfig = AppConfig;
        this.DialogService = DialogService;
        this.TaskCategoryService = TaskCategoryService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.dirty = false; 

        this.clearCategory();
        this.init();
        this.loadTaskCategories();
    }

    clearCategory() {
        this.$scope.$evalAsync(() => {
            this.copiedCategory = {
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
                <p>The following errors must be addressed before the task category can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Name:</label>
                <div class="col-sm-9">
                    <input id="new_category_name" class="form-control" category="text" req-data="Name" rd-errors="$ctrl.modalErrors" unq-name un-err-model="$ctrl.modalErrors" un-items="$ctrl.categories" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <input id="new_category_description" class="form-control" category="text" />
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_category_name", body)[0], error: "Name is required."});

        this.DialogService.dialog("Create Task Category", body, null, () => {
            let newCategory = {
                Active: true,
                Name: $("#new_category_name").val(),
                Description: $("#new_category_description").val()
            };

            if (this.modalErrors.length > 0){
                return false;
            } else {
                this.working = "Saving Task Category...";
                this.TaskCategoryService.create(newCategory)
                .then((response) => {
                    this.categories.push(response.data.taskCategory);
                    this.table.row.add(response.data.taskCategory).select().draw().show().draw(false);
                })
                .catch((error) => { this.DialogService.error(error); })
                .finally(() => { this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    discard() {
        this.errors = [];
        $(".has-error").removeClass("has-error");

        this.$scope.$evalAsync(() => { 
            this.copiedCategory = angular.copy(this.selectedCategory);
            this.table.row('.selected').data(this.copiedCategory).draw().show().draw(false);  
        });

        this.dirty = false;
    }

    loadTaskCategories() {
        this.working = "Loading Task Categories...";
        this.TaskCategoryService.list()
        .then((response) => {
            this.categories = response.data.taskCategories;
            this.table.rows.add(this.categories).draw();            
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

        this.table = $("#categories").DataTable({
            dom: '<"dt-toolbar"<"create-new-button"><"dt-toolbar-length"l><"dt-toolbar-filter"f>>rt<"dt-footer"<"dt-footer-info"i><"dt-footer-pager"p>>',
            columns: [
                { data: null, width: "25px", render: ( data, category, row ) => { return row.Active ? "Yes" : "No"; } },
                { data: "Name" },
                { data: "Description" }
            ],
            select: "single",
            drawCallback: function(settings) {
            }
        }).on("user-select", (e, dt, category, cell, originalEvent, retriggered) => {
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
            this.selectedCategory = this.table.rows('.selected').data()[0];
            this.$scope.$evalAsync(() => { 
                this.copiedCategory = angular.copy(this.selectedCategory);
            });
        }).on("deselect", () => {
            this.clearCategory();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Create New Task Category" class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));
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
        this.working = "Saving Task Category...";
        this.TaskCategoryService.update(this.copiedCategory)
        .then((response) => {
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")

            this.$scope.$evalAsync(() => {
                this.copiedCategory = angular.copy(response.data.taskCategory);
                this.categories[this.categories.findIndex((elem) => { return elem.Id === this.copiedCategory.Id; })] = response.data.taskCategory;
                this.table.row('.selected').data(this.copiedCategory).draw().show().draw(false);
            });
            
            this.dirty = false;
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "")
    }
}

TaskCategoriesController.$inject = ["AppConfig", "DialogService", "TaskCategoryService", "$scope", "$compile"];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const taskCategories = {
    controller: TaskCategoriesController,
    templateUrl: "Views/Task/categories.html",
};
