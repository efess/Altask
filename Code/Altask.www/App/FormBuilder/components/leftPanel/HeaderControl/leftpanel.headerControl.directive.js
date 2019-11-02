import leftPanelHeaderControlTemplate from './leftpanel.headerControl.template.html';

export {
    LEFT_PANEL_HEADER_CONTROL_DIRECTIVE
};

const LEFT_PANEL_HEADER_CONTROL_DIRECTIVE = 'leftPanelHeaderControl';

function leftPanelHeaderControl() {
    let directive = {
        restrict: 'E',
        template: leftPanelHeaderControlTemplate
    };
    return directive;

}

leftPanelHeaderControl.$inject = [];

export default leftPanelHeaderControl;