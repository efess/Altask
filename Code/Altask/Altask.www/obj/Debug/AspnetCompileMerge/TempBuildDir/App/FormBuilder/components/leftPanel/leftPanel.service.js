const CONTROLLER_MODAL_PROXY = 'LeftPanelService';
const INIT_OPTION_MODEL = {
    rows: []
};

class LeftPanelService {

    constructor(FormlyProxyModels) {
        this.FormlyProxyModels = FormlyProxyModels;
        this.init();
    }

    init() {
        this.fieldModel = {};
        this.initializeFieldModel();
        this.editor = {
            toggle: false,
            lineIndex: -1,
            columnIndex: -1,
            control: {}
        };
        this.basicSelectOptions = angular.copy(INIT_OPTION_MODEL);
        this.basicSelectOption = angular.copy({
            saisie: ''
        });

        this.groupSelectOptions = angular.copy(INIT_OPTION_MODEL);
        this.groupSelectOption = angular.copy({
            saisie: ''
        });
        this.groupSelectGroups = angular.copy({
            list: []
        });
        this.groupSelectGroup = angular.copy({
            saisie: ''
        });
        this.groupSelectGroupClick = angular.copy({
            showList: false
        });

        this.radioOptions = angular.copy(INIT_OPTION_MODEL);
        this.radioOption = angular.copy({
            saisie: ''
        });
    }

    initializeFieldModel() {
        let model = this.FormlyProxyModels.controls();
        this.fieldModel = angular.copy(model);
    }

    validKeyUniqueness(key, model) {
        let isUnique = true;

        for (let lineIndex = model.lines.length - 1; lineIndex >= 0; lineIndex--) {
            for (let columnIndex = model.lines[lineIndex].columns.length - 1; columnIndex >= 0; columnIndex--) {
                if (model.lines[lineIndex].columns[columnIndex].control.key === key) {
                    isUnique = false;
                }
            }
        }

        return isUnique;
    }

    getFormlyId(field) {
        var formlyId = 'none';
        var fromlyControls = angular.copy(this.FormlyProxyModels.controls().controls);

        fromlyControls.forEach(function(control) {
            if (control.formlyType === field.type && control.formlySubtype === field.subtype) {
                formlyId = control.id;
                return formlyId;
            }
        });

        return formlyId;
    }

    applyToModel(lineIndex, columnIndex, model) {
        let field = angular.copy(this.fieldModel.temporyConfig);

        model.lines[lineIndex].columns[columnIndex].control.templateId = field.templateId;
        model.lines[lineIndex].columns[columnIndex].control.type = field.formlyType;
        model.lines[lineIndex].columns[columnIndex].control.subtype = field.formlySubtype;
        model.lines[lineIndex].columns[columnIndex].control.templateOptions = {
            label: '',
            required: false,
            description: '',
            placeholder: '',
            options: []
        };

        model.lines[lineIndex].columns[columnIndex].control.templateOptions.label = field.formlyLabel;
        model.lines[lineIndex].columns[columnIndex].control.templateOptions.required = field.formlyRequired;
        model.lines[lineIndex].columns[columnIndex].control.templateOptions.description = field.formlyDescription;
        model.lines[lineIndex].columns[columnIndex].control.templateOptions.placeholder = field.formlyPlaceholder;
        model.lines[lineIndex].columns[columnIndex].control.templateOptions.options = field.formlyOptions;

        if (model.lines[lineIndex].columns[columnIndex].control.type === 'datepicker') {
            model.lines[lineIndex].columns[columnIndex].control.templateOptions.datepickerPopup = field.datepickerPopup;
            model.lines[lineIndex].columns[columnIndex].control.templateOptions.datepickerOptions = field.datepickerOptions;
        }

        if (model.lines[lineIndex].columns[columnIndex].control.type === 'input-number') {
            model.lines[lineIndex].columns[columnIndex].control.templateOptions.step = field.step;
            model.lines[lineIndex].columns[columnIndex].control.templateOptions.min = field.min;
            model.lines[lineIndex].columns[columnIndex].control.templateOptions.max = field.max;
        }

        let newKey = model.lines[lineIndex].columns[columnIndex].control.type + '-' + Date.now();

        if (this.validKeyUniqueness(newKey, model) === true) {
            model.lines[lineIndex].columns[columnIndex].control.key = newKey;
        } else {
            newKey = model.lines[lineIndex].columns[columnIndex].control.type + '-' +  Date.now();

            if (this.validKeyUniqueness(newKey, model) === true) {
                model.lines[lineIndex].columns[columnIndex].control.key = newKey;
            } else {
                newKey = model.lines[lineIndex].columns[columnIndex].control.type + '-' +  Date.now();
            }
        }

        model.lines[lineIndex].columns[columnIndex].control.edited = true;
    }

    setFieldModel(model, lineIndex, columnIndex) {
        if (typeof model.lines[lineIndex].columns[columnIndex].control != 'undefined') {
            this.fieldModel.templateId = typeof model.lines[lineIndex].columns[columnIndex].control.type != 'undefined' ? this.getFormlyId(model.lines[lineIndex].columns[columnIndex].control) : 'none';
            this.fieldModel.temporyConfig.templateId = typeof model.lines[lineIndex].columns[columnIndex].control.type != 'undefined' ? this.getFormlyId(model.lines[lineIndex].columns[columnIndex].control) : 'none';
            this.fieldModel.temporyConfig.formlyType = typeof model.lines[lineIndex].columns[columnIndex].control.type != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.type : 'none';
            this.fieldModel.temporyConfig.formlySubtype = typeof model.lines[lineIndex].columns[columnIndex].control.subtype != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.subtype : 'none';
            this.fieldModel.temporyConfig.formlyLabel = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.label != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.label : '';
            this.fieldModel.temporyConfig.formlyRequired = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.required != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.required : '';
            this.fieldModel.temporyConfig.formlyDescription = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.description != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.description : '';
            this.fieldModel.temporyConfig.formlyPlaceholder = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.placeholder != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.placeholder : '';
            this.fieldModel.temporyConfig.formlyOptions = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.options != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.options : '';

            if (this.fieldModel.temporyConfig.templateId === 'Date') {
                this.fieldModel.temporyConfig.datepickerPopup = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.datepickerPopup != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.datepickerPopup : 'MM/dd/yyyy';
                this.fieldModel.temporyConfig.datepickerOptions = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.datepickerOptions != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.datepickerOptions : [];
            }

            if (this.fieldModel.temporyConfig.templateId === 'NumberInput') {
                this.fieldModel.temporyConfig.step = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.step != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.step : 1;
                this.fieldModel.temporyConfig.min = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.min != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.min : 0;
                this.fieldModel.temporyConfig.max = typeof model.lines[lineIndex].columns[columnIndex].control.templateOptions.max != 'undefined' ? model.lines[lineIndex].columns[columnIndex].control.templateOptions.max : 0;
            }

            if (this.fieldModel.temporyConfig.templateId === 'BasicSelect') {
                this.basicSelectOptions = angular.copy(INIT_OPTION_MODEL);
                this.basicSelectOption = angular.copy({
                    saisie: ''
                });

                angular.forEach(this.fieldModel.temporyConfig.formlyOptions, (elem) => {
                    this.basicSelectOptions.rows.push({
                        option: angular.copy(elem.name),
                        order: angular.copy(elem.value)
                    });
                });
            }

            if (this.fieldModel.temporyConfig.templateId === 'Radio') {
                this.radioOptions = angular.copy(INIT_OPTION_MODEL);
                this.radioOption = angular.copy({
                    saisie: ''
                });

                angular.forEach(this.fieldModel.temporyConfig.formlyOptions, (elem) => {
                    this.radioOptions.rows.push({
                        option: angular.copy(elem.name),
                        order: angular.copy(elem.value)
                    });
                });
            }
        }

        return this.fieldModel;
    }

    setEditor(lineIndex, columnIndex, item) {
        this.editor.lineIndex = lineIndex;
        this.editor.columnIndex = columnIndex;
        angular.merge(this.editor, item);
    }

    getColumn() {
        return this.editor.columnIndex;
    }

    getLine() {
        return this.editor.lineIndex;
    }

    getControl() {
        return this.editor.control;
    }

    toggleState() {
        return this.editor.toggle;
    }

    toggle(toggle) {
        this.editor.toggle = toggle;
    }

    applyToModelCustom() {
        if (this.fieldModel.templateId === 'BasicSelect') {
            this.applyBasicSelectToModel(this.basicSelectOptions);
        }
        if (this.fieldModel.templateId === 'GroupedSelect') {
            this.applyGroupSelectToModel(this.groupSelectOptions);
        }
        if (this.fieldModel.templateId === 'Radio') {
            this.applyRadioToModel(this.radioOptions);
        }
    }

    setBasicSelect(options) {
        for (let index = 0; index < this.fieldModel.temporyConfig.formlyOptions.length; index++) {
            let newOption = {
                'option': this.fieldModel.temporyConfig.formlyOptions[index].name,
                'order': index
            };

            options.rows.push(newOption);
        }
    }

    applyBasicSelectToModel(options) {
        this.fieldModel.temporyConfig.formlyOptions = [];

        for (let index = 0; index < options.rows.length; index++) {
            let option = {
                'name': options.rows[index].option,
                'value': index
            };

            this.fieldModel.temporyConfig.formlyOptions.push(option);
        }
    }

    setGroupSelect(options, groupSelectGroups) {
        if (this.fieldModel.temporyConfig.formlyOptions.length > 0) {
            for (let index = 0; index < this.fieldModel.temporyConfig.formlyOptions.length; index++) {
                let option = {
                    'option': this.fieldModel.temporyConfig.formlyOptions[index].name,
                    'order': index,
                    'group': this.fieldModel.temporyConfig.formlyOptions[index].group
                };

                options.rows.push(option);
            }

            let filteredGroup = _.uniq(_.pluck(options.rows, 'group'));
            angular.copy(filteredGroup, groupSelectGroups.list);
        }
    }

    applyGroupSelectToModel(options) {
        this.fieldModel.temporyConfig.formlyOptions = [];

        for (let index = 0; index < options.rows.length; index++) {
            let option = {
                'name': options.rows[index].option,
                'value': index,
                'group': options.rows[index].group
            };

            this.fieldModel.temporyConfig.formlyOptions.push(option);
        }
    }

    setRadio(options) {
        for (let index = 0; index < this.fieldModel.temporyConfig.formlyOptions.length; index++) {
            let option = {
                'option': this.fieldModel.temporyConfig.formlyOptions[index].name,
                'order': index,
                'group': ''
            };

            options.rows.push(option);
        }
    }

    applyRadioToModel(options) {
        this.fieldModel.temporyConfig.formlyOptions = [];

        for (let index = 0; index < options.rows.length; index++) {
            let option = {
                'name': options.rows[index].option,
                'value': index,
                'group': ''
            };

            this.fieldModel.temporyConfig.formlyOptions.push(option);
        }
    }

}

LeftPanelService.$inject = [
    'FormlyProxyModels'
];

export default LeftPanelService;

export {
    CONTROLLER_MODAL_PROXY
};