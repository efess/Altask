const FORMLY_PROXY_SERVICE = 'FormlyProxyService';

class FormlyProxyService {
    constructor(FormlyProxyModels) {
        this.FormlyProxyModels = FormlyProxyModels;
    }

    makeNewModel(formBuilderModel) {
        let model = this.FormlyProxyModels.newFormModel();
        angular.copy(model, formBuilderModel);
    }

    setLines(formBuilderModel, lines) {
        let model = this.FormlyProxyModels.emptyFormModel();
        model.lines = [].concat(lines);
        angular.copy(model, formBuilderModel);
    }

    setFormlyModel(formBuilderModel, formlyModel, dataModel) {
        angular.copy([], formlyModel);
        angular.copy({}, dataModel);
        let lineCount = formBuilderModel.lines.length;

        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            let columnCount = formBuilderModel.lines[lineIndex].columns.length;
            let field = {
                className: 'row',
                fieldGroup: []
            };

            let fieldIndex = formlyModel.push(field) - 1;

            formBuilderModel.lines[lineIndex].columns.forEach((column) => {
                let formlyControl = {};

                if (column.control.type !== 'none') {
                    if (column.control.type === 'header' || column.control.type === 'subTitle') {
                        let headerTextContent = column.control.templateOptions.description;
                        formlyControl.template = this.FormlyProxyModels.headerTemplateInColumn(columnCount, headerTextContent).template;
                        formlyControl.className = this.FormlyProxyModels.headerTemplate().selectedClass;
                    } else {
                        formlyControl = this.FormlyProxyModels.formlyControlTemplateInColumn(columnCount, column.control.type);
                        formlyControl.className = column.control.className;
                        formlyControl.type = column.control.type;
                        formlyControl.key = column.control.key;
                        formlyControl.templateOptions.type = column.control.templateOptions.type || '';
                        formlyControl.templateOptions.label = column.control.templateOptions.label || '';
                        formlyControl.templateOptions.required = column.control.templateOptions.required || false;
                        formlyControl.templateOptions.placeholder = column.control.templateOptions.placeholder || '';
                        formlyControl.templateOptions.description = column.control.templateOptions.description || '';
                        formlyControl.templateOptions.options = [].concat(column.control.templateOptions.options);

                        if (column.control.type === 'datepicker') {
                            formlyControl.templateOptions.datepickerPopup = column.control.templateOptions.datepickerPopup;
                            formlyControl.templateOptions.datepickerOptions = column.control.templateOptions.datepickerOptions;
                        }

                        if (column.control.type === 'input-number'){
                            formlyControl.templateOptions.step = column.control.templateOptions.step;
                            formlyControl.templateOptions.min = column.control.templateOptions.min;
                            formlyControl.templateOptions.max = column.control.templateOptions.max;
                        }
                    }

                    if (column.control.key) {
                        dataModel[column.control.key] = null;
                    }

                    formlyModel[fieldIndex].fieldGroup.push(formlyControl);
                }
            });
        }
    }



    // custom errors
    getErrorObject(errorTitle, errorMessage) {
        let messageObj = {
            noError: false,
            title: '',
            Message: ''
        };
        messageObj.noError = false;
        messageObj.title = errorTitle;
        messageObj.Message = errorMessage;
        return messageObj;
    }

    getMessageObject(messageTitle, messageBody) {
        let messageObj = {
            noError: false,
            title: '',
            Message: ''
        };
        messageObj.noError = true;
        messageObj.title = messageTitle;
        messageObj.Message = messageBody;
        return messageObj;
    }

}

FormlyProxyService.$inject = [
    'FormlyProxyModels'
];

export default FormlyProxyService;

export {
    FORMLY_PROXY_SERVICE
};