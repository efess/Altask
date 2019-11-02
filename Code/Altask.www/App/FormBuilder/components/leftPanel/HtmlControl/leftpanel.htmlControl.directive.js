
import leftPanelHtmlControlTemplate from './leftpanel.htmlControl.template.html';

const LEFT_PANEL_HTML_CONTROL_DIRECTIVE = 'leftPanelHtmlControl';

function leftPanelHtmlControl() {
    let directive = {
        restrict: 'E',
        template: leftPanelHtmlControlTemplate
    };
    return directive;
}

leftPanelHtmlControl.$inject = [];

export default leftPanelHtmlControl;

export {
    LEFT_PANEL_HTML_CONTROL_DIRECTIVE
};