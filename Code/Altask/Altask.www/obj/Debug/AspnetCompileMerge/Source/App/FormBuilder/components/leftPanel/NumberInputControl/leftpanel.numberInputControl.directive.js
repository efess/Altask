import leftPanelNumberInputControlTemplate from './leftpanel.numberInputControl.template.html';

const LEFT_PANEL_NUMBER_INPUT_CONTROL_DIRECTIVE = 'leftPanelNumberInputControl';

function leftPanelNumberInputControl() {
    let directive = {
        restrict: 'E',
        template: leftPanelNumberInputControlTemplate
    };
    return directive;
}

leftPanelNumberInputControl.$inject = [];

export default leftPanelNumberInputControl;

export {
    LEFT_PANEL_NUMBER_INPUT_CONTROL_DIRECTIVE
};