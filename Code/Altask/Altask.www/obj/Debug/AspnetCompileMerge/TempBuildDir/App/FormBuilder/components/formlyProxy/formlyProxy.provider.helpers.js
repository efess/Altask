 export const Controls = () => {
     return {
         controls: [],
         templateId: 'none',
         temporyConfig: {
             templateId: 'none',
             formlyLabel: 'label',
             formlyRequired: false,
             formlyDescription: '',
             formlyPlaceholder: '',
             formlyOptions: []
         }
     };
 };

 export const EmptyLineModel = () => {
     return {
         "line": 1,
         "activeColumn": 1,
         "columns": []
     };
 };

 export const EmptyControlModel = () => {
     return {
         'control': {
             'type': 'blank',
             'key': 'none'
         }
     };
 };

 export const NewFormModel = (_emptyLineModel) => {
     return {
         okText: 'submit',
         okShow: true,
         cancelText: 'cancel',
         cancelShow: true,
         lines: [].concat(_emptyLineModel)
     };
 };

 export const EmptyFormModel = () => {
     let model = NewFormModel();
     model.lines = [];
     return model;
 };

export const HeaderTemplate = function() {
     let headerTemplate = {
         cssClass: ['col-xs-12', 'col-xs-6', 'col-xs-4', 'col-xs-3'],
         textContent: '',
         html_part1: [
             ' <div class="'
         ].join(''),
         selectedClass: '',
         html_part2: [
             '">',
             ' <h2 class="text-center">'
         ].join(''),
         html_part3: this.textContent,
         html_part4: [
             ' <h2>',
             ' <hr/>',
             ' </div>'
         ].join(''),
         simpleHtml1: [
             '<h2 class="text-center">'
         ].join(''),
         simpleHtml2: [
             ' <h2>',
             ' <hr/>'
         ].join('')
     };
     return headerTemplate;
 };

 export const FormlyControlTemplate = () => {
     return {
         className: ['col-xs-12', 'col-xs-6', 'col-xs-4', 'col-xs-3'],
         type: '',
         key: '',
         templateOptions: {
             type: '',
             label: '',
             required: '',
             placeholder: '',
             description: '',
             options: ''
         }
     };
 };

 export const CustomControlProperties = () => {
     return [{
         controlType: 'datepicker',
         properties: [{
             isRoot: false,
             isTemplateOptions: true,
             value: 'datepickerPopup'
         }]
     }];
 };