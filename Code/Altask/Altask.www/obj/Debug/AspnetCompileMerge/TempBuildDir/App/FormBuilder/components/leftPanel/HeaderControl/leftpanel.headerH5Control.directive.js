﻿
import leftPanelHeaderControlTemplate from './leftpanel.headerControl.template.html';

export {
    LEFT_PANEL_HEADER_H4_CONTROL_DIRECTIVE
};

const LEFT_PANEL_HEADER_H5_CONTROL_DIRECTIVE = 'leftPanelHeaderH5Control';

function leftPanelHeaderH5Control() {
    let directive = {
        restrict: 'E',
        template: leftPanelHeaderControlTemplate
    };
    return directive;

}

leftPanelHeaderH5Control.$inject = [];

export default leftPanelHeaderH5Control;

export {
    LEFT_PANEL_HEADER_H5_CONTROL_DIRECTIVE
};