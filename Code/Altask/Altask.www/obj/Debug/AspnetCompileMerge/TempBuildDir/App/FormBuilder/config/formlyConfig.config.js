function formlyConfig(formlyConfig, FormlyProxy, FormBuilder) {
    formlyConfig.setType({
        name: 'blank',
        template: '<div></div>'
    });

    FormlyProxy.addControl({
        id: 'empty',
        name: 'no control',
        subtitle: 'no control',
        group: 'Blank',
        formlyType: 'blank',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
             <div class="form-group">
                 <div class="dd-control-blank">
                    Used to position other controls within a line which can accomidate up to four controls.
                 </div>
             </div>
         </div>`,
        template: `<div class="col-md-12">
             <div class="form-group">
                 <div class="dd-control-blank"></div>
             </div>
         </div>`,
        control: 'empty',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'blank'
    });

    formlyConfig.setType({
        name: 'html',
        template: '<div class="formly-html-content" ng-bind-html="to.label | trustThis"></div>'
    });

    FormlyProxy.addControl({
        id: 'Html',
        name: 'Html',
        subtitle: 'no control',
        group: 'Decoration',
        formlyType: 'html',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <div class="text-center">Html to be rendered on your form.
                </div>
            </div>
        </div>`,
        template: `<div ng-bind-html="to.label | trustThis"></div>`,
        control: 'Html',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'html'
    });

    FormlyProxy.addControl({
        id: 'Header',
        name: 'Header',
        subtitle: 'no control',
        group: 'Decoration',
        formlyType: 'header',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <div class="">
                    <h2 class="text-center">Header</h2>
                    <hr/>
                </div>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <div class="">
                    <h2 class="text-center">{{to.description || 'Header'}}</h2>
                    <hr/>
                </div>
            </div>
        </div>`,
        control: 'Header',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'headers'
    });

    const headerh4Template = `<div class="row">
        <div class="">
            <h4 class="text-center">{{options.label}}<h4>
            <hr/>
        </div>
    </div>`;

    formlyConfig.setType({
        name: 'headerh4',
        template: headerh4Template
    });

    FormlyProxy.addControl({
        id: 'HeaderH4',
        name: 'Header',
        subtitle: 'no control',
        group: 'Decoration',
        formlyType: 'headerh4',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <div class="">
                    <h4 class="text-center">Header</h4>
                    <hr/>
                </div>
            </div>
        </div>`,
        'template': `<div class="col-md-12">
            <div class="form-group">
                <div class="">
                    <h4 class="text-center">{{to.label || 'Header'}}</h4>
                    <hr/>
                </div>
            </div>
        </div>`,
        control: 'HeaderH4',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'headers'
    });

    const headerh5Template = `<div class="row">
        <div class="">
            <h5 class="text-center">{{options.label}}<h5>
            <hr/>
        </div>
    </div>`;

    formlyConfig.setType({
        name: 'headerh5',
        template: headerh5Template
    });

    FormlyProxy.addControl({
        id: 'HeaderH5',
        name: 'Header',
        subtitle: 'no control',
        group: 'Decoration',
        formlyType: 'headerh5',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <div class="">
                    <h5 class="text-center">Header</h5>
                    <hr/>
                </div>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <div class="">
                    <h5 class="text-center">{{to.label || 'Header'}}</h5>
                    <hr/>
                </div>
            </div>
        </div>`,
        control: 'HeaderH5',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'headers'
    });

    FormlyProxy.addControl({
        id: 'TextInput',
        name: 'Text Input',
        subtitle: 'Text Input',
        group: 'input',
        formlyType: 'input',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <label for="inputText" class="control-label pull-left">Text Label <span class="ng-scope">*</span></label>
                <div class="">
                    <input type="text" disabled class="form-control fb-control" id="inputText" placeholder="Placeholder">
                    <p class="help-block pull-left">Description</p>
                </div>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <label for="inputText" class="control-label pull-left">{{to.label || 'Text Label'}} <span ng-if="to.required" class="ng-scope">*</span></label>
                <div class="">
                    <input type="text" disabled class="form-control fb-control" id="inputText" placeholder="{{to.placeholder}}">
                    <p class="help-block pull-left">{{to.description}}</p>
                </div>
            </div>
        </div>`,
        control: 'TextInput',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'inputs'
    });

    formlyConfig.setType({
        name: 'input-number',
        template: '<input type="number" class="form-control" ng-disabled="options.formState.readOnly" ng-model="model[options.key]" placeholder="{{to.placeholder}}" step="{{to.step}}" min="{{to.min}}" max="{{to.max}}">',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    });

    FormlyProxy.addControl({
        id: 'NumberInput',
        name: 'Number Input',
        subtitle: 'Number Input',
        group: 'input',
        formlyType: 'input-number',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: [],
        step: 1,
        min: 0,
        max: 0
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <label for="inputNumber" class="control-label pull-left">Number Label <span class="ng-scope">*</span></label>
                <div class="">
                    <input type="number" disabled class="form-control fb-control" id="inputNumber" placeholder="Placeholder">
                    <p class="help-block pull-left">Description</p>
                </div>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <label for="inputNumber" class="control-label pull-left">{{to.label || 'Number Label'}} <span ng-if="to.required" class="ng-scope">*</span></label>
                <div class="">
                    <input type="number" disabled class="form-control fb-control" id="inputNumber" placeholder="{{to.placeholder}}">
                    <p class="help-block pull-left">{{to.description}}</p>
                </div>
            </div>
        </div>`,
        control: 'NumberInput',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'inputs'
    });

    const datePickerTemplate = `<div class="input-group">
        <input type="text" class="form-control" id="{{id}}" uib-datepicker-popup="{{to.datepickerPopup}}" datepicker-options="to.datepickerOptions" ng-model="model[options.key || index]" is-open="opened" ng-required="{{to.required}}"  />
        <span class="input-group-btn">
        <button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>
        </span>
    </div>`;

    formlyConfig.setType({
        name: 'datepicker',
        template: datePickerTemplate,
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        link: function(scope, element, attrs) {
            scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened = true;
            };; 
        },
        defaultOptions: {
            templateOptions: {
                datepickerPopup: "MM/dd/yyyy",
                datepickerOptions: []
            }
        }
    });

    FormlyProxy.addControl({
        id: 'Date',
        name: 'Date',
        subtitle: 'Date',
        group: 'input',
        formlyType: 'datepicker',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: [],
        datepickerPopup: 'MM/dd/yyyy',
        datepickerOptions: {
            maxDate: null,
            minDate: null,
        }
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <label for="inputDate" class="control-label ng-binding pull-left">Date Input <span class="ng-scope">*</span>
                </label>
                <div class="col-md-12" style="padding: 0; margin-bottom: 15px;">
                    <div class="input-group">
                        <input type="text" disabled class="form-control fb-control" disabled>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                    </div>
                </div>
                <p class="help-block pull-left" style="margin-top: -10px;">Description</p>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <label for="inputDate" class="control-label ng-binding pull-left">{{to.label || 'Date Label'}} <span ng-if="to.required" class="ng-scope">*</span></label>
                <div class="col-md-12" style="padding: 0; margin-bottom: 15px;">
                    <div class="input-group">
                        <input type="text" disabled class="form-control fb-control" disabled>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                    </div>
                </div>
                <p class="help-block pull-left" style="margin-top: -10px;">{{to.description}}</p>
            </div>
        </div>`,
        control: 'Date',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'inputs'
    });

    FormlyProxy.addControl({
        id: 'Texarea',
        name: 'Textarea',
        subtitle: 'Textarea',
        group: 'Textarea',
        formlyType: 'textarea',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <label for="textArea" class="control-label pull-left">Text Area <span>*</span></label>
                <div class="">
                    <textarea disabled class="form-control dragItemtextarea fb-control" rows="1" id="textArea" disabled></textarea>
                    <p class="help-block pull-left">Description</p>
                </div>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <label for="textArea" class="control-label pull-left">{{ to.label || 'Text Area Label'}} <span ng-if="to.required" class="ng-scope">*</span></label>
                <div class="">
                    <textarea disabled class="form-control dragItemtextarea fb-control"rows="{{to.rows}}" id="textArea" disabled></textarea>
                    <p class="help-block pull-left">{{to.description}}</p>
                </div>
            </div>
        </div>`,
        control: 'Texarea',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'textareas'
    });

    let richTextBoxTemplate = `<text-angular name="{{id}}" class="richTextAngular" ng-model="model[options.key || index]"></text-angular>`;

    formlyConfig.setType({
        name: 'richEditor',
        template: richTextBoxTemplate
    });

    FormlyProxy.addControl({
        id: 'RichTextEditor',
        name: 'RichTextEditor',
        subtitle: 'RichTextEditor',
        group: 'Textarea',
        formlyType: 'richEditor',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <label for="textArea" class="control-label pull-left">Rich Text Editor <span>*</span></label>
                <div class="">
                <textarea disabled class="form-control dragItemtextarea fb-control" rows="1" disabled></textarea>
                <p class="help-block pull-left">Description</p>
                </div>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <label for="textArea" class="control-label pull-left">{{to.label || 'Rich Text Editor Label'}} <span ng-if=" class="ng-scope">*</span></label>
                <div class="">
                <textarea disabled class="form-control dragItemtextarea fb-control" rows="{{to.rows}}" disabled></textarea>
                <p class="help-block pull-left">{{to.description}}</p>
                </div>
            </div>
        </div>`,
        control: 'RichTextEditor',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'textareas'
    });

    FormlyProxy.addControl({
        id: 'Radio',
        name: 'Radio',
        subtitle: 'Radio',
        options: [],
        group: 'Radio',
        formlyType: 'radio',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group" style="display: table-cell;">
                <label for="vertRadio" class="control-label pull-left">Radio Group <span>*</span></label>
                <div class="radio-group">
                    <div class="radio text-left">
                        <label>
                            <input type="radio" disabled name="optionsRadios" checked="true">
                            Option A
                        </label>
                    </div>
                    <div class="radio text-left">
                        <label>
                            <input type="radio" disabled name="optionsRadios" checked="">
                            Opiton B
                        </label>
                    </div>
                </div>
                <p class="help-block pull-left">Description</p>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group" style="display: table-cell;">
                <label for="vertRadio" class="control-label pull-left">{{to.label || 'Radio Group'}} <span ng-if="to.required" class="ng-scope">*</span></label>
                <div class="radio-group">
                    <div class="radio text-left" ng-repeat="x in to.options">
                        <label>
                            <input type="radio" disabled name="optionsRadios" value="{{x.value}}">
                            {{x.name}}
                        </label>
                    </div>
                </div>
                <p class="help-block pull-left">{{to.description}}</p>
            </div>
        </div>`,
        control: 'Radio',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'radios'
    });

    FormlyProxy.addControl({
        id: 'Checkbox',
        name: 'Checkbox',
        subtitle: 'Checkbox',
        group: 'Checkbox',
        formlyType: 'checkbox',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="checkbox text-left">
                <label>
                    <input type="checkbox" disabled >
                    <span>Checkbox </span><span>*</span>
                </label>
            </div>
            <p class="help-block pull-left">Description</p>
        </div>`,
        template: `<div class="col-md-12">
            <div class="checkbox text-left">
                <label>
                    <input type="checkbox" disabled>
                    <span>{{to.label || 'Checkbox Label'}} </span><span ng-if="to.required"> *</span>
                </label>
            </div>
            <p class="help-block pull-left">{{to.description}}</p>
        </div>`,
        control: 'Checkbox',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'checkboxes'
    });

    formlyConfig.setType({
        name: 'select-basic',
        template: `<select class="form-control" ng-model="model[options.key]">
              <option ng-hide="to.notNull" value="">{{to.nullDisplay}}</option>
          </select>`,
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        defaultOptions(options) {
            /* jshint maxlen:195 */
            let ngOptions = options.templateOptions.ngOptions || `option[to.valueProp || 'value'] as option[to.labelProp || 'name'] group by option[to.groupProp || 'group'] for option in to.options`;
            return {
                ngModelAttrs: {
                  [ngOptions]: {
                      value: options.templateOptions.optionsAttr || 'ng-options'
                  }
                }
            };
        },
    });

    FormlyProxy.addControl({
        id: 'BasicSelect',
        name: 'Basic select',
        subtitle: 'Basic select',
        options: [],
        group: 'Select',
        formlyType: 'select-basic',
        formlySubtype: '',
        formlyLabel: '',
        formlyRequired: false,
        formlyDescription: '',
        formlyOptions: []
    });

    FormBuilder.addControl({
        label: `<div class="col-md-12">
            <div class="form-group">
                <label class="control-label pull-left">Select <span>*</span></label>
                <select class="form-control" disabled="disabled">
                </select>
                <p class="help-block pull-left">Description</p>
            </div>
        </div>`,
        template: `<div class="col-md-12">
            <div class="form-group">
                <label class="control-label pull-left">{{to.label || 'Basic Select Label'}} <span ng-if=" class="ng-scope">*</span></label>
                <select class="form-control">
                    <option ng-repeat="x in to.options" value="{{x.value}}">
                        {{x.name}}
                    </option>
                </div>
                <p class="help-block pull-left">{{to.description}}</p>
            </div>
        </div>`,
        control: 'BasicSelect',
        cssClass: 'col-xs-12'
    }, {
        addToGroupController: 'selects'
    });

    //FormlyProxy.addControl({
    //    id: 'GroupedSelect',
    //    name: 'Grouped Select',
    //    subtitle: 'Grouped Select',
    //    options: [],
    //    group: 'Select',
    //    formlyType: 'select',
    //    formlySubtype: '',
    //    formlyLabel: '',
    //    formlyRequired: false,
    //    formlyDescription: '',
    //    formlyOptions: []
    //});

    //FormBuilder.addControl({
    //    label: `<div class="col-md-12">
    //        <div class="form-group">
    //            <label class="control-label pull-left">Grouped Select <span>*</span></label>
    //            <select class="form-control" disabled="disabled">
    //            </select>
    //            <p class="help-block pull-left">Description</p>
    //        </div>
    //    </div>`,
    //    template: `<div class="col-md-12">
    //        <div class="form-group">
    //            <label class="control-label pull-left">{{to.label || 'Grouped Select Label'}} <span ng-if=" class="ng-scope">*</span></label>
    //            <select class="form-control">
    //                <option ng-repeat="x in to.options" value="{{x.value}}">
    //                    {{x.name}}
    //                </option>
    //            </div>
    //            <p class="help-block pull-left">{{to.description}}</p>
    //        </div>
    //    </div>`,
    //    control: 'GroupedSelect',
    //    cssClass: 'col-xs-12'
    //}, {
    //    addToGroupController: 'selects'
    //});
}

formlyConfig.$inject = [
    'formlyConfigProvider',
    'FormlyProxyModelsProvider',
    'FormBuilderConfigProvider'
];

export default formlyConfig;