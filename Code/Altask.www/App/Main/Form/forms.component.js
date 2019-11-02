import {relativeDate} from "../../Utility/utility";
import moment from "moment";

// The controller for the `forms` component
class FormsController {
    constructor(AppConfig, DialogService, FormService, $scope, $compile, $timeout) {
        this.AppConfig = AppConfig;
        this.DialogService = DialogService;
        this.FormService = FormService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.dirty = false; 

        this.init();
        this.clearForm();
        this.loadForms();
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

    clearForm() {
        $(".table-metadata > tbody > tr").remove();
        this.$scope.$evalAsync(() => {
            this.copiedForm = {
                Id: null,
                Active: false,
                Name: "",
                Description: "",
                DraftModel: "",
                PublishedModel: "",
                Version: "",
                Metadata: { Properties: [] }
            }
        });
    }

    createNew() {
        let scope = this.$scope.$new();
        let formOptions = `<option value="" selected>None</option>`;

        angular.forEach(this.forms, (elem) => {
            formOptions += `<option value="` + elem.Id + `">` + elem.Name + `</option>`;
        });

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="!$ctrl.isModalValid()">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the form can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback has-error">
                <label class="control-label col-sm-3">Name:</label>
                <div class="col-sm-9">
                    <input id="new_form_name" class="form-control" type="text" req-data="Name" rd-errors="$ctrl.modalErrors" unq-name un-err-model="$ctrl.modalErrors" un-items="$ctrl.forms" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <textarea id="new_form_description" class="form-control" type="text"></textarea>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Copy Form:</label>
                <div class="col-sm-9">
                    <select id="new_form_copy_form" class="form-control">`
                    + formOptions +
                    `</select>
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({control: $("#new_form_name", body)[0], error: "Name is required."});

        this.DialogService.dialog("Create Form", body, null, () => {
            let copyFormId = $("#new_form_copy_form").val();
            let formModel = "{}";

            if (copyFormId) {
                formModel = this.forms.find((elem) => { return elem.Id === parseInt(copyFormId); }).PublishedModel;
            }

            let newForm = {
                Active: true,
                Name: $("#new_form_name").val(),
                Description: $("#new_form_description").val(),
                DraftModel: formModel,
                PublishedModel: formModel,
                Metadata: JSON.stringify({Property: []}),
                Version: moment().format("YYYY.MM.DD.HH.mm.ss")
            };

            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving Form...";
                this.FormService.create(newForm)
                .then((response) => {
                    $(".table-metadata > tbody > tr").remove();
                    this.forms.push(response.data.form);
                    this.table.row.add(response.data.form).draw().select().show().draw(false);
                })
                .catch((error) => { this.DialogService.error(error); })
                .finally(() => {this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    disableFormBuilder() {
        $('.form-builder-container').find('*').attr("disabled", "true");
    }

    discard() {
        this.errors = [];
        $(".table-metadata > tbody > tr").remove();
        $(".has-error").removeClass("has-error");

        let timer = this.$timeout(()=>{
            this.copiedForm = angular.copy(this.selectedForm);
            this.copiedForm.DraftModel = JSON.parse(this.copiedForm.DraftModel);
            this.copiedForm.PublishedModel = JSON.parse(this.copiedForm.PublishedModel);
            this.table.row('.selected').data(this.copiedForm).draw().show().draw(false);
        }, 20);

        this.$scope.$on('$destroy', ()=>this.$timeout.cancel(timer));
        this.markClean();
    }

    enableFormBuilder() {
        $('.form-builder-container').find('*').removeAttr("disabled");
    }

    loadForms() {
        this.working = "Loading Forms...";
        this.FormService.list()
        .then((response) => {
            this.forms = response.data.forms;
            this.table.rows.add(this.forms).draw();            
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "");
    }

    hasFormChanged() {
        return JSON.stringify(this.copiedForm.DraftModel) != JSON.stringify(this.copiedForm.PublishedModel);
    }

    init() {
        this.working = "";
        this.errors = [];
        this.modalErrors = [];
        this.disableFormBuilder();

        this.table = $("#forms").DataTable({
            dom: '<"dt-toolbar"<"create-new-button"><"dt-toolbar-length"l><"dt-toolbar-filter"f>>rt<"dt-footer"<"dt-footer-info"i><"dt-footer-pager"p>>',
            columns: [
                { data: null, width: "25px", render: ( data, type, row ) => { return row.Active ? "Yes" : "No"; } },
                { data: "Name" }
            ],
            select: "single"
        }).on("user-select", (e, dt, type, cell, originalEvent, retriggered) => {
            if (this.dirty) {
                e.preventDefault();

                this.DialogService.confirm("Unsaved Changes!", "Your changes will be discarded, would you like to proceed?", (result) => {
                    if (result) {
                        this.markClean();
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
            this.selectedForm = this.table.rows('.selected').data()[0];
            $(".table-metadata > tbody > tr").remove();

            this.$scope.$evalAsync(() => {
                this.copiedForm = angular.copy(this.selectedForm);
                this.copiedForm.DraftModel = JSON.parse(this.copiedForm.DraftModel);
                this.copiedForm.PublishedModel = JSON.parse(this.copiedForm.PublishedModel);
            });

            this.markClean();
            this.enableFormBuilder();
        }).on("deselect", () => {
            this.clearForm();
            this.markClean();
            this.disableFormBuilder();
        });

        $("div.create-new-button").html(this.$compile('<button uib-tooltip="Create New Form" class="btn btn-primary" ng-click="$ctrl.createNew()" ng-disabled="$ctrl.dirty"><i class="fa fa-plus fa-sm" aria-hidden="true"></i>Add</button>')(this.$scope));
        
        $(window).on("scroll", () => {
            let $list = $(".control-list");
            let $editor = $(".form-builder-editor");
            let scrollTop = $(window).scrollTop() + 50;
            let builderTop = $list.parent().offset().top;
            let listBottom = $list.offset().top + $list.height();
            let editorBottom = $editor.offset().top + $editor.height();
            
            let limit = editorBottom - $list.height();
            let top = builderTop - scrollTop;

            if (top <= 0) {
                $list.stop().animate({"marginTop": Math.abs(top) + "px"}, "slow" );
            } else {
                $list.stop().animate({"marginTop": "0px"}, "slow" );
            }
        });

        $(".alert-publish .btn-primary").removeAttr("disabled");
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

    markClean() {
        let timer = this.$timeout(()=>{
            this.errors = [];
            this.modelErrors = [];
            this.dirty = false;
        }, 10);

        this.$scope.$on('$destroy', ()=>this.$timeout.cancel(timer));
    }

    markDirty() {
        this.$scope.$evalAsync(() => { this.dirty = true; });
    }

    overflowing(e) {
        let well = $(".well")[1];
        let form = $("fieldset", well)[0];
        return form.scrollHeight > well.offsetHeight;   
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

    publish() {
        this.working = "Publishing Form...";
        let xml = {Property: []};

        $(".table-metadata > tbody > tr").each((index, value) => {
            let row = $(value);
            xml.Property.push({ 
                Name: row.children("td:eq(0)").children("input").val(),
                Value: row.children("td:eq(1)").children("input").val()
            });
        });

        if (typeof this.copiedForm.DraftModel.formName !== 'undefined') {
            this.copiedForm.DraftModel = JSON.stringify(this.copiedForm.DraftModel);
        }

        if (typeof this.copiedForm.PublishedModel.formName !== 'undefined') {
            this.copiedForm.PublishedModel = JSON.stringify(this.copiedForm.PublishedModel);
        }

        this.copiedForm.Metadata = JSON.stringify(xml);
        this.FormService.publish(this.copiedForm)
        .then((response) => {
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved and the latest version of you form has been published.")
            $(".table-metadata > tbody > tr").remove();
                
            this.$scope.$evalAsync(() => {
                this.selectedForm = response.data.form;
                this.copiedForm = angular.copy(this.selectedForm);
                this.copiedForm.DraftModel = JSON.parse(this.copiedForm.DraftModel);
                this.copiedForm.PublishedModel = JSON.parse(this.copiedForm.PublishedModel);
                this.table.row('.selected').data(response.data.form).draw().show().draw(false);
            });

            this.forms[this.forms.findIndex((elem) => { return elem.Id === this.selectedForm.Id; })] = response.data.form;
            this.markClean();
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "");
    }

    save() {
        let saveFunction = () => {
            this.working = "Saving Form...";
            let xml = {Property: []};

            $(".table-metadata > tbody > tr").each((index, value) => {
                let row = $(value);
                xml.Property.push({ 
                    Name: row.children("td:eq(0)").children("input").val(),
                    Value: row.children("td:eq(1)").children("input").val()
                });
            });

            this.copiedForm.Metadata = JSON.stringify(xml);
            this.FormService.update(this.copiedForm)
            .then((response) => {
                this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
                $(".table-metadata > tbody > tr").remove();
                
                this.$scope.$evalAsync(() => {
                    this.selectedForm = response.data.form;
                    this.copiedForm = angular.copy(this.selectedForm);
                    this.copiedForm.DraftModel = JSON.parse(this.copiedForm.DraftModel);
                    this.copiedForm.PublishedModel = JSON.parse(this.copiedForm.PublishedModel);
                    this.table.row('.selected').data(response.data.form).draw().show().draw(false);
                });

                this.forms[this.forms.findIndex((elem) => { return elem.Id === this.selectedForm.Id; })] = response.data.form;
                this.markClean();
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
        };

        if (this.hasFormChanged()){
            this.DialogService.dialog("Save Form", "<p>The Form's draft and published versions differ.  Would you like to publish the latest version of the Form now?</p>",
                {
                    cancel: {
                        label: "Cancel",
                        className: 'btn-default'
                    },
                    ok: {
                        label: "No, Save Draft",
                        className: 'btn-success',
                        callback: (result) => { saveFunction(); }
                    },
                    publish: {
                        label: "Yes, Save and Publish",
                        className: 'btn-primary',
                        callback: (result) => {
                            this.publish();
                        }
                    }
                }
           );
        } else {
            saveFunction();
        }
    }

    saveForm(formBuilderModel) {
        formBuilderModel.formName = this.copiedForm.Name;
        this.copiedForm.DraftModel = JSON.stringify(formBuilderModel);
        this.copiedForm.PublishedModel = JSON.stringify(this.copiedForm.PublishedModel);
        this.save();
    }
}

FormsController.$inject = ["AppConfig", "DialogService", "FormService", "$scope", "$compile", "$timeout"];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const forms = {
    controller: FormsController,
    templateUrl: "Views/Form/forms.html",
};
