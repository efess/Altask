import leftPanelBasicSelectControlTemplate from './leftpanel.basicSelectControl.template.html';

const LEFT_PANEL_BASIC_SELECT_CONTROL_DIRECTIVE = 'leftPanelBasicSelectControl';

function leftPanelBasicSelectControl() {
    let directive = {
        restrict: 'E',
        template: leftPanelBasicSelectControlTemplate,
        link: function (scope) { 
            $('#basic_select_options').DataTable( {
                "dom" : "t",
                "scrollY":        "200px",
                "scrollCollapse": true,
                "paging":         false,
                "ordering": false,
                "language": {
                    "emptyTable" : ""
                },
                "initComplete": function () {
                    $('#basic_select_options').DataTable().columns.adjust();
                }
            });
        }
    };
    return directive;
}

leftPanelBasicSelectControl.$inject = [];

export default leftPanelBasicSelectControl;

export {
    LEFT_PANEL_BASIC_SELECT_CONTROL_DIRECTIVE
};