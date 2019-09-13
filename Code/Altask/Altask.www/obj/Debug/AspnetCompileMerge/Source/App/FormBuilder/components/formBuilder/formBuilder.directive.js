/* global angular */


//TODO: to bindToController
//-> then angular 1.4+ will be required...
//-> check methot to refactor inside rag drop way then common step way and drag drop way

import formBuilderDirectiveTemplate from './formBuilder.template.html';
import {
    FORM_BUILDER_CONTROLLER,
    FORM_BUILDER_CONTROLLERAS
} from './formBuilder.controller';


const FORM_BUILDER_DIRECTIVE = 'formBuilder';

function formBuilder(
    $timeout,
    FormlyProxyService,
    ControlProxyService,
    // dragDropConfig,
    FormBuilderConfig) {

    let directive = {
        restrict: 'E',
        template: formBuilderDirectiveTemplate,
        scope: {
            fbModel: '=',
            fbOnSave: '&fbOnSave',
            fbOnDirty: '&fbOnDirty',
            fbOnDiscard: '&fbOnDiscard',
            fbParentDirty: '=',
        },
        controller: FORM_BUILDER_CONTROLLER,
        controllerAs: FORM_BUILDER_CONTROLLERAS,
        replace: false,
        link: linkFct
    };
    return directive;

    function linkFct(scope) {
        // watch "scope.eratorModel"
        scope.$watch(() => scope.fbModel, () => {
            loadExistingConfigurationModel();
        });

        scope.$watch(() => scope.vm.formBuilderModel.okText, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                scope.vm.markDirty();
            }
        }, true);
        scope.$watch(() => scope.vm.formBuilderModel.okShow, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                scope.vm.markDirty();
            }
        }, true);
        scope.$watch(() => scope.vm.formBuilderModel.cancelText, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                scope.vm.markDirty();
            }
        }, true);
        scope.$watch(() => scope.vm.formBuilderModel.cancelShow, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                scope.vm.markDirty();
            }
        }, true);

        scope.$watch(() => scope.fbParentDirty, () => {
            if (scope.vm.isDirty != scope.fbParentDirty) {
                scope.vm.isDirty = scope.fbParentDirty;
            }
        }, true);

        // watch "scope.returnSaveEvent"" = catch saving form event 
        scope.$watch(() => scope.vm.returnSaveEvent, (newValue) => {
            if (newValue === true) {
                let formBuilderModel = {
                    formName: scope.vm.formBuilderModel.formName,
                    okText: scope.vm.formBuilderModel.okText,
                    showOk: scope.vm.formBuilderModel.okShow,
                    cancelText: scope.vm.formBuilderModel.cancelText,
                    showCancel: scope.vm.formBuilderModel.cancelShow,
                    formBuilderFieldsModel: scope.vm.formBuilderModel.lines,
                    formlyFieldsModel: scope.vm.formlyFields,
                    dataModel: scope.vm.dataModel
                };
                scope.fbOnSave({
                    formBuilderModel: formBuilderModel
                });
                //back to false, waiting next save event
                scope.vm.returnSaveEvent = false;
            }
        });

        // watch "scope.returnDirtyEvent"" = catch saving form event 
        scope.$watch(() => scope.vm.returnDirtyEvent, (newValue) => {
            if (newValue === true) {
                scope.fbOnDirty();
                //back to false, waiting next dirty event
                scope.vm.returnDirtyEvent = false;
            }
        });

        // watch "scope.returnDiscardEvent"" = catch saving form event 
        scope.$watch(() => scope.vm.returnDiscardEvent, (newValue) => {
            if (newValue === true) {
                scope.fbOnDiscard();
                //back to false, waiting next dirty event
                scope.vm.returnDiscardEvent = false;
            }
        });

        function returnAttributeConfigurationLinesIfNotEmpty() {
            let fbModelToReturn = (
                angular.isArray(scope.fbModel.formBuilderFieldsModel) ? (
                    scope.fbModel.formBuilderFieldsModel.length > 0 ?
                    scope.fbModel.formBuilderFieldsModel :
                    emptyEdaFieldsModel()
                ) :
                emptyEdaFieldsModel()
            );
            return fbModelToReturn;
        }

        /**
         * empty fields model: to display at least an empty line
         * otherwise would look like ugly empty line like it were a bug
         */
        function emptyEdaFieldsModel() {
            let emptyModel = [{
                "line": 1,
                "activeColumn": 1,
                "columns": [{
                    "numColumn": 1,
                    "exist": true,
                    "control": {
                        "className": "col-xs-12",
                        "type": "header",
                        "key": "header-1507756947663",
                        "templateOptions": {
                            "label": "",
                            "required": false,
                            "description": "New Form",
                            "placeholder": "",
                            "options": [

                            ]
                        },
                        "templateId": "Header",
                        "subtype": "",
                        "edited": true
                    }
                }]
            }];
            return emptyModel;
        }

        function returnAttributeDataModelIfNotEmpty() {
            let dataModelToReturn = (
                angular.isArray(scope.fbModel.dataModel) ? (
                    scope.fbModel.dataModel.length > 0 ?
                    scope.fbModel.dataModel : []
                ) : []
            );
            return dataModelToReturn;
        }


        function loadExistingConfigurationModel() {
            if (angular.isDefined(scope.fbModel)) {
                let configlines = returnAttributeConfigurationLinesIfNotEmpty();
                scope.vm.formBuilderModelLoaded = {};
                FormlyProxyService.setLines(scope.vm.formBuilderModelLoaded, configlines, false);
                //apply configuration model
                scope.vm.formBuilderModel = angular.copy(scope.vm.formBuilderModelLoaded);
                //apply ddModel
                ControlProxyService.loadBuilderFromModel(scope.vm.formBuilderModel, scope.vm.dragDropModel);
                updateConfigurationClassName(scope.vm.formBuilderModel);
                ControlProxyService.setBuilderModelKeys(scope.vm.formBuilderModel, scope.vm.dragDropModel);
                //apply formly model
                FormlyProxyService.setFormlyModel(scope.vm.formBuilderModel, scope.vm.formlyFields, scope.vm.dataModel);
                //scope.vm.dataModel = returnAttributeDataModelIfNotEmpty();
                scope.vm.formBuilderModel.formName = angular.isString(scope.fbModel.formName) ? scope.fbModel.formName : '';
                scope.vm.formBuilderModel.okText = angular.isString(scope.fbModel.okText) ? scope.fbModel.okText : 'Submit';
                scope.vm.formBuilderModel.okShow = scope.fbModel.showOk === undefined ? true : scope.fbModel.showOk;
                scope.vm.formBuilderModel.cancelText = angular.isString(scope.fbModel.cancelText) ? scope.fbModel.cancelText : 'Cancel';
                scope.vm.formBuilderModel.cancelShow = scope.fbModel.showCancel === undefined ? true : scope.fbModel.showCancel;
            }
        }


        function updateConfigurationClassName(configModel) {
            angular.forEach(configModel.lines, (aline) => {
                let cssClassToApply = FormBuilderConfig.cssClassFromColumns(aline.columns.length);
                angular.forEach(aline.columns, (aControl) => aControl.control.className = cssClassToApply);
            });
        }

    }



}

formBuilder.$inject = [
    '$timeout',
    'FormlyProxyService',
    'ControlProxyService',
    // 'dragDropConfig',
    'FormBuilderConfig'
];

export default formBuilder;

export {
    FORM_BUILDER_DIRECTIVE
};