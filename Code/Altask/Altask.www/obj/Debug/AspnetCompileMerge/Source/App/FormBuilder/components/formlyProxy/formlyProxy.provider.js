import * as helpers from './formlyProxy.provider.helpers';
const FORMLY_PROXY_MODELS = 'FormlyProxyModels';

function FormlyProxyModels() {
    let _controls = helpers.Controls();
    let _emptyLineModel = helpers.EmptyLineModel();
    let _emptyControlModel = helpers.EmptyControlModel();
    let _newFormModel = helpers.NewFormModel(_emptyLineModel);
    let _emptyFormModel = helpers.EmptyFormModel();
    let _headerTemplate = helpers.HeaderTemplate();
    let _formlyControlTemplate = helpers.FormlyControlTemplate();
    let _customControlProperties = helpers.CustomControlProperties();

    this.addControl = addControl;
    this.getFormlyControlTemplate = getFormlyControlTemplate;
    this.$get = get;

    function addControl(controlDeclaration) {
        if (typeof controlDeclaration !== 'undefined') {
            _controls.controls.push(controlDeclaration);
        }
    }

    function getFormlyControlTemplate() {
        return _formlyControlTemplate;
    }

    get.$inject = [];

    function get() {
        let service = {
            controls: controls,
            newFormModel: newFormModel,
            emptyFormModel: emptyFormModel,
            emptyLineModel: emptyLineModel,
            emptyControlModel: emptyControlModel,
            headerTemplate: headerTemplate,
            headerTemplateInColumn: headerTemplateInColumn,
            formlyControlTemplateInColumn: formlyControlTemplateInColumn
        };

        return service;

        function controls() {
            return _controls;
        }

        function newFormModel() {
            let model = angular.copy(_newFormModel);
            return model;
        }

        function emptyFormModel() {
            let model = angular.copy(_emptyFormModel);
            return model;
        }

        function emptyLineModel() {
            return _emptyLineModel;
        }

        function emptyControlModel() {
            return _emptyControlModel;
        }

        function headerTemplate() {
            return _headerTemplate;
        }

        function headerTemplateInColumn(colIndex, textContent) {
            if (typeof colIndex !== 'undefined' && typeof textContent !== 'undefined') {
                if (colIndex === parseInt(colIndex, 10)) {
                    if (colIndex <= _headerTemplate.cssClass.length) {
                        let headerToReturn = {};
                        headerToReturn.className = _headerTemplate.cssClass[colIndex - 1];
                        _headerTemplate.textContent = textContent;
                        _headerTemplate.selectedClass = headerToReturn.className;
                        headerToReturn.template = [
                            _headerTemplate.simpleHtml1,
                            textContent,
                            _headerTemplate.simpleHtml2
                        ].join('');
                        return headerToReturn;
                    }
                }
            }
        }

        function formlyControlTemplateInColumn(colIndex, controlType) {
            if (typeof colIndex !== 'undefined') {
                if (colIndex === parseInt(colIndex, 10)) {
                    if (colIndex <= _formlyControlTemplate.className.length) {
                        let controlToReturn = angular.copy(_formlyControlTemplate);
                        controlToReturn.className = _formlyControlTemplate.className[colIndex - 1];

                        if (typeof controlType !== 'undefined') {
                            _customControlProperties.forEach((customControlProperty) => {
                                if (customControlProperty.controlType === controlType) {
                                    customControlProperty.properties.forEach((property) => {
                                        if (property.isRoot) {
                                            controlToReturn[property.value] = '';
                                        }

                                        if (property.isTemplateOptions) {
                                            controlToReturn.templateOptions[property.value] = '';
                                        }
                                    });
                                }
                            });
                        }

                        return controlToReturn;
                    }
                }
            }
        }
    }
}

FormlyProxyModels.$inject = [];
export default FormlyProxyModels;
export {
    FORMLY_PROXY_MODELS
};