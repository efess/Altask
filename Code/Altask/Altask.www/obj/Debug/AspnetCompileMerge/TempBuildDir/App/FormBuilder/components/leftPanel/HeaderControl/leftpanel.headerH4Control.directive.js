
import leftPanelHeaderControlTemplate from './leftpanel.headerControl.template.html';

const LEFT_PANEL_HEADER_H4_CONTROL_DIRECTIVE = 'leftPanelHeaderH4Control';

export {
    LEFT_PANEL_HEADER_H4_CONTROL_DIRECTIVE
};

function leftPanelHeaderH4Control() {
    let directive = {
        restrict: 'E',
        template: leftPanelHeaderControlTemplate
    };
    return directive;

}

leftPanelHeaderH4Control.$inject = [];

export default leftPanelHeaderH4Control;