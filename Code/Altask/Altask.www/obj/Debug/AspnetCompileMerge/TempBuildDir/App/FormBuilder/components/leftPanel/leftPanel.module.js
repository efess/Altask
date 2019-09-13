/* global angular */
import leftPanelController, {
    LEFT_PANEL_CONTROLLER
} from './leftPanel.controller';

import leftPanel, {
    LEFT_PANEL_DIRECTIVE
} from './leftPanel.directive';

import selectOptionMange, {
    LEFT_PANEL_SELECT_OPTION_MANAGE_SERVICE
} from './leftPanel.selectOptionManage.service';

import LeftPanelService, {
    CONTROLLER_MODAL_PROXY
} from './leftPanel.service';

import leftPanelValidEditFooter, {
    LEFT_PANEL_VALID_EDIT_FOOTER_DIRECTIVE
} from './validEditFooter/leftpanel.validEditFooter.directive';

import leftPanelTextInputControl, {
    LEFT_PANEL_TEXT_INPUT_CONTROL_DIRECTIVE
} from './TextInputControl/leftpanel.textInputControl.directive';

import leftPanelNumberInputControl, {
    LEFT_PANEL_NUMBER_INPUT_CONTROL_DIRECTIVE
} from './NumberInputControl/leftpanel.numberInputControl.directive';

import leftPanelTextareaControl, {
    LEFT_PANEL_TEXTAREA_CONTROL_DIRECTIVE
} from './TextAreaControl/leftpanel.textareaControl.directive';

import leftPanelSubtitleControl, {
    LEFT_PANEL_SUBTITLE_CONTROL_DIRECTIVE
} from './SubTitleControl/leftpanel.subtitleControl.directive';

import leftPanelRichTextEditorControl, {
    LEFT_PANEL_RICH_TEXT_EDITOR_CONTROL_DIRECTIVE
} from './RichTextEditorControl/leftpanel.richTextEditorControl.directive';

import leftPanelRadioControl, {
    LEFT_PANEL_RADIO_CONTROL_DIRECTIVE
} from './RadioControl/leftpanel.radioControl.directive';

import leftPanelPasswordControl, {
    LEFT_PANEL_PASSWORD_CONTROL_DIRECTIVE
} from './PasswordControl/leftpanel.passwordControl.directive';

import leftPanelHeaderControl, {
    LEFT_PANEL_HEADER_CONTROL_DIRECTIVE
} from './HeaderControl/leftpanel.headerControl.directive';

import leftPanelHeaderH4Control, {
    LEFT_PANEL_HEADER_H4_CONTROL_DIRECTIVE
} from './HeaderControl/leftpanel.headerH4Control.directive';

import leftPanelHeaderH5Control, {
    LEFT_PANEL_HEADER_H5_CONTROL_DIRECTIVE
} from './HeaderControl/leftpanel.headerH5Control.directive';

import leftPanelGroupedSelectControl, {
    LEFT_PANEL_GROUPED_SELECT_CONTROL_DIRECTIVE
} from './GroupedSelectControl/leftpanel.groupedSelectControl.directive';

import leftPanelDateControl, {
    LEFT_PANEL_DATE_CONTROL_DIRECTIVE
} from './DateControl/leftpanel.dateControl.directive';

import leftPanelCheckBoxControl, {
    LEFT_PANEL_CHECKBOX_CONTROL_DIRECTIVE
} from './CheckBoxControl/leftpanel.checkBoxControl.directive';

import leftPanelBlankControl, {
    LEFT_PANEL_BLANK_CONTROL_DIRECTIVE
} from './BlankControl/leftpanel.blankControl.directive';

import leftPanelBasicSelectControl, {
    LEFT_PANEL_BASIC_SELECT_CONTROL_DIRECTIVE
} from './BasicSelectControl/leftpanel.basicSelectControl.directive';

import leftPanelHtmlControl, {
    LEFT_PANEL_HTML_CONTROL_DIRECTIVE
} from './HtmlControl/leftpanel.htmlControl.directive';

const LEFT_PANEL_MODULE = 'leftPanel.module';

export default angular
    .module(LEFT_PANEL_MODULE, [])
    .directive(LEFT_PANEL_DIRECTIVE, leftPanel)
    .controller(LEFT_PANEL_CONTROLLER, leftPanelController)
    .service(LEFT_PANEL_SELECT_OPTION_MANAGE_SERVICE, selectOptionMange)
    .service(CONTROLLER_MODAL_PROXY, LeftPanelService)
    .directive(LEFT_PANEL_VALID_EDIT_FOOTER_DIRECTIVE, leftPanelValidEditFooter)
    .directive(LEFT_PANEL_TEXT_INPUT_CONTROL_DIRECTIVE, leftPanelTextInputControl)
    .directive(LEFT_PANEL_TEXTAREA_CONTROL_DIRECTIVE, leftPanelTextareaControl)
    .directive(LEFT_PANEL_SUBTITLE_CONTROL_DIRECTIVE, leftPanelSubtitleControl)
    .directive(LEFT_PANEL_RICH_TEXT_EDITOR_CONTROL_DIRECTIVE, leftPanelRichTextEditorControl)
    .directive(LEFT_PANEL_RADIO_CONTROL_DIRECTIVE, leftPanelRadioControl)
    .directive(LEFT_PANEL_PASSWORD_CONTROL_DIRECTIVE, leftPanelPasswordControl)
    .directive(LEFT_PANEL_HEADER_CONTROL_DIRECTIVE, leftPanelHeaderControl)
    .directive(LEFT_PANEL_GROUPED_SELECT_CONTROL_DIRECTIVE, leftPanelGroupedSelectControl)
    .directive(LEFT_PANEL_DATE_CONTROL_DIRECTIVE, leftPanelDateControl)
    .directive(LEFT_PANEL_CHECKBOX_CONTROL_DIRECTIVE, leftPanelCheckBoxControl)
    .directive(LEFT_PANEL_BLANK_CONTROL_DIRECTIVE, leftPanelBlankControl)
    .directive(LEFT_PANEL_BASIC_SELECT_CONTROL_DIRECTIVE, leftPanelBasicSelectControl)
    .directive(LEFT_PANEL_NUMBER_INPUT_CONTROL_DIRECTIVE, leftPanelNumberInputControl)
    .directive(LEFT_PANEL_HEADER_H4_CONTROL_DIRECTIVE, leftPanelHeaderH4Control)
    .directive(LEFT_PANEL_HEADER_H5_CONTROL_DIRECTIVE, leftPanelHeaderH5Control)
    .directive(LEFT_PANEL_HTML_CONTROL_DIRECTIVE, leftPanelHtmlControl);