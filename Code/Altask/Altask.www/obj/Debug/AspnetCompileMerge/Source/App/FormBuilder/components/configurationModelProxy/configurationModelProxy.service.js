const CONTROL_PROXY_SERVICE = 'ControlProxyService';

class ControlProxyService {
    constructor(FormlyProxyModels, FormBuilderConfig, $parse) {
        this.FormlyProxyModels = FormlyProxyModels;
        this.Config = FormBuilderConfig;
        this.$parse = $parse;
    }

    setFormModel(formModel, builderModel) {
        formModel.lines = [];

        angular.forEach(builderModel[1], (line, lineIndex) => {
            formModel.lines.push(angular.copy(this.FormlyProxyModels.emptyLineModel()));
            formModel.lines[lineIndex].line = lineIndex + 1;

            angular.forEach(line, (column, columnIndex) => {
                let formControl = {
                    control: angular.copy(this.FormlyProxyModels.formlyControlTemplateInColumn(line.length, this.getFormlyTemplate(line[columnIndex]).formlyType))
                };
                let formlyDetailedControlModel = this.getFormlyTemplate(line[columnIndex]);

                if (typeof column.key !== 'undefined') {
                    formControl.control = angular.copy(column.control);
                    var template = this.FormlyProxyModels.formlyControlTemplateInColumn(line.length, this.getFormlyTemplate(line[columnIndex]).formlyType);
                    formControl.control.className = template.className;
                    formControl.control.cssClass = template.className;
                } else {
                    this.bindConfigControllerModelFromFormlyDetailedControllerModel(formlyDetailedControlModel, formControl, formModel);
                }

                formModel.lines[lineIndex].columns.push(angular.copy(this.FormlyProxyModels.emptyControlModel()));
                formModel.lines[lineIndex].columns[columnIndex].control = angular.copy(formControl.control);
                formModel.lines[lineIndex].columns[columnIndex].numColumn = columnIndex + 1;
                formModel.lines[lineIndex].columns[columnIndex].exist = true;
            });
        });
        return formModel;
    }


    setBuilderModelKeys(formModel, builderModel) {
        angular.forEach(formModel.lines, (line, lineIndex) => {
            angular.forEach(line.columns, (control, columnIndex) => {
                if (typeof builderModel[1][lineIndex] !== 'undefined') {
                    if (builderModel[1][lineIndex].length > 0) {
                        builderModel[1][lineIndex][columnIndex].key = control.control.key;
                        builderModel[1][lineIndex][columnIndex].control = angular.copy(control.control);
                    }
                }
            });
        });
    }

    loadBuilderFromModel(model, builderModel) {
        let templateList = builderModel[0];
        builderModel[1] = [];

        angular.forEach(model.lines, (line, lineIndex) => {
            builderModel[1].push([]);

            angular.forEach(line.columns, (modelControl) => {
                let control = {};

                angular.forEach(templateList, (group) => {
                    angular.forEach(group, (templateControl) => {
                        if (templateControl.control === modelControl.control.templateId) {
                            control = angular.copy(templateControl);
                        }
                    });
                });

                builderModel[1][lineIndex].push(control);
                let cssClass = this.Config.cssClassFromColumns(builderModel[1][lineIndex].length);
                angular.forEach(builderModel[1][lineIndex], (control) => control.cssClass = cssClass);
            });
        });
    }

    getFormlyTemplate(control) {
        let templateModel = {};
        let templateControls = this.FormlyProxyModels.controls();
        let getter = this.$parse('controls');

        angular.forEach(getter(templateControls), (templateControl) => {
            if (templateControl.id === control.control) {
                templateModel = templateControl;
            }
        });

        return templateModel;
    }

    validKeyUniqueness(thisKey, configurationObj) {
        let isUnique = true;
        for (var i = configurationObj.lines.length - 1; i >= 0; i--) {
            for (var j = configurationObj.lines[i].columns.length - 1; j >= 0; j--) {
                if (typeof configurationObj.lines[i].columns[j].control !== 'undefined') {
                    if (configurationObj.lines[i].columns[j].control.key === thisKey) {
                        isUnique = false;
                    }
                }
            }
        }
        return isUnique;
    }


    createUniqueKey(baseKeyValue, configurationObj) {
        // unique key (set only first time) in this model is formly control type + Date.now(); 
        let newKey = baseKeyValue + '-' +  Date.now();
        if (this.validKeyUniqueness(newKey, configurationObj) === true) {
            return newKey;
        } else {
            newKey = baseKeyValue + '-' +  Date.now();
            if (this.validKeyUniqueness(newKey, configurationObj) === true) {
                return newKey;
            } else {
                newKey = baseKeyValue + '-' +  Date.now();
                return newKey;
            }
        }
    }

    /**
     * bind formly detailed model to configuration control model
     */
    bindConfigControllerModelFromFormlyDetailedControllerModel(formlyDetailControllerModel, configurationControllerModel, formModel) {
        /**
         * TODO:properties should be served by provider 
         * more configurable without pain
         */
        //set selected control:
        this.$parse('control.templateId').assign(configurationControllerModel, this.$parse('id')(formlyDetailControllerModel));
        //set type:
        this.$parse('control.type').assign(configurationControllerModel, this.$parse('formlyType')(formlyDetailControllerModel));
        //set key:
        this.$parse('control.key').assign(configurationControllerModel, this.createUniqueKey(this.$parse('control.type')(configurationControllerModel), formModel));
        //set subtype:
        this.$parse('control.subtype').assign(configurationControllerModel, this.$parse('formlySubtype')(formlyDetailControllerModel));
        //set templateOptions.label:
        this.$parse('control.templateOptions.label').assign(configurationControllerModel, this.$parse('formlyLabel')(formlyDetailControllerModel));
        //set templateOptions.required:
        this.$parse('control.templateOptions.required').assign(configurationControllerModel, this.$parse('formlyRequired')(formlyDetailControllerModel));
        //set templateOptions.required:
        this.$parse('control.templateOptions.description').assign(configurationControllerModel, this.$parse('formlyDescription')(formlyDetailControllerModel));
        //set templateOptions.required:
        this.$parse('control.templateOptions.placeholder').assign(configurationControllerModel, this.$parse('formlyPlaceholder')(formlyDetailControllerModel));
        //set templateOptions.required:
        this.$parse('control.templateOptions.options').assign(configurationControllerModel, this.$parse('formlyOptions')(formlyDetailControllerModel));

        if (this.$parse('control.type')(configurationControllerModel) === 'datepicker') {
            this.$parse('control.templateOptions.datepickerPopup').assign(configurationControllerModel, this.$parse('datepickerPopup')(formlyDetailControllerModel));
            this.$parse('control.templateOptions.datepickerOptions').assign(configurationControllerModel, this.$parse('datepickerOptions')(formlyDetailControllerModel));
        }

        if (this.$parse('control.type')(configurationControllerModel) === 'input-number') {
            this.$parse('control.templateOptions.step').assign(configurationControllerModel, this.$parse('step')(formlyDetailControllerModel));
            this.$parse('control.templateOptions.min').assign(configurationControllerModel, this.$parse('min')(formlyDetailControllerModel));
            this.$parse('control.templateOptions.max').assign(configurationControllerModel, this.$parse('max')(formlyDetailControllerModel));
        }
    }


}

ControlProxyService.$inject = ['FormlyProxyModels', 'FormBuilderConfig', '$parse'];

export default ControlProxyService;
export {
   CONTROL_PROXY_SERVICE
};