/* global angular */

///////////////////////////////////////////////////////////////////////
// TODO:
// - check no use methods that come from step way and delete if not needed
// - check other TODO (a lot of fixes are needed)
///////////////////////////////////////////////////////////////////////

import {
    initTabModel,
    initIhmModel
} from './formBuilder.controller.helpers.js';

const FORM_BUILDER_CONTROLLER = 'formBuilderController';
const FORM_BUILDER_CONTROLLERAS = 'vm';


class formBuilderController {

    constructor(
        $scope,
        Version,
        $filter,
        $anchorScroll,
        toaster,
        $timeout,
        $log,
        FormlyProxyService,
        LeftPanelService,
        dragDropItemDecorationService,
        ControlProxyService,
        FormBuilderConfig
    ) {
        this.initializing = true;
        this.$scope = $scope;
        this.Version = Version;
        this.$filter = $filter;
        this.$anchorScroll = $anchorScroll;
        this.toaster = toaster;
        this.$timeout = $timeout;
        this.$log = $log;
        this.FormlyProxyService = FormlyProxyService;
        this.LeftPanelService = LeftPanelService;
        this.dragDropItemDecorationService = dragDropItemDecorationService;
        this.ControlProxyService = ControlProxyService;
        this.Config = FormBuilderConfig;

        this.init();
        this.initializing = false;
    }


    init() {
        this.eratorVERSION = this.Version;
        this.tab = initTabModel(this.Config.isPreviewPanelVisible(), this.Config.arePreviewModelsVisible());
        this.returnSaveEvent = false;
        this.editedControlKey = null;
        this.dataModel = {}; //was vm.model in ES5 version
        this.formlyFields = [];
        this.ihm = initIhmModel();
        this.formBuilderProperties = this.Config.getDragDropConfigModel();
        this.dragDropModel = [].concat(this.Config.getDragDropPresentationModel());
        this.numberOfColumns = 1;
        this.MaxNumberOfColumns = 3;
        this.MinNumberOfColumns = 1;
        this.formBuilderModel = {};
        this.animationsEnabled = this.Config.getModalAnimationValue();
        this.editor = {
            toggle: false
        };
        this.debugProxyModel = this.LeftPanelService.ProxyModel;
        this.model = [];
        this.returnDirtyEvent = false;
        this.isDirty = false;
        this.edaNgDisabled = false;

        this.FormlyProxyService.makeNewModel(this.formBuilderModel, false);
        this.LeftPanelService.initializeFieldModel();
    }


    collapseAllGroupControl(allExceptThisGroupIndex) {
        angular.forEach(this.formBuilderProperties.containerConfig.decoration, (value) => {
            if (value.WhenIndex !== allExceptThisGroupIndex) this.Config.setDragDropConfigContainerDecorationCollapse(this.formBuilderProperties, value.WhenIndex, true);
        });
    }


    onSubmit() {

    }

    save() {
        this.FormlyProxyService.setFormlyModel(this.formBuilderModel, this.formlyFields, this.dataModel);
        this.returnSaveEvent = true;
        this.returnDirtyEvent = false;
        return true;
    }

    discard() {
        this.returnDiscardEvent = true;
        this.returnDirtyEvent = false;
        return true;
    }

    markDirty() {
        if (!this.initializing) {
            this.returnDirtyEvent = true;
            this.isDirty = true;
            return true;
        }
    }

    dragoverCallbackContainer(parentparentIndex, parentIndex, index) {
        //prevent container in layout column to be drag to control select contianer
        if (index === 0) return false;
        return true;
    }

    dropCallback(event, index, item, external, type, allowedType) {
        if (external) {
            if (allowedType === 'itemType' && !item.label) return false;
            if (allowedType === 'containerType' && !angular.isArray(item)) return false;
        }
        //set a timeout befire binding since ddModel may not be called when already full updated
        let timerRefreshDDToConfig = this.$timeout(() => {
            this.formBuilderModel = angular.copy(this.ControlProxyService.setFormModel(this.formBuilderModel, this.dragDropModel));
            this.FormlyProxyService.setFormlyModel(this.formBuilderModel, this.formlyFields, this.dataModel);
            this.ControlProxyService.setBuilderModelKeys(this.formBuilderModel, this.dragDropModel);
            this.markDirty();
        }, 200);
        this.$scope.$on('$destroy', () => this.$timeout.cancel(timerRefreshDDToConfig));
        return item;
    }

    dndItemMoved(parentParentIndex, parentIndex, itemIndex) {
        //prevent item from first container to disapear when dropped on other container
        if (parentParentIndex > 0) {
            this.dragDropModel[parentParentIndex][parentIndex].splice(itemIndex, 1);
        }
    }

    dragoverCallbackItems(ParentParentIndex, parentIndex) {
        //prevent items in layout column to be drag to control select
        if (parentIndex === 0) return false;
        return true;
    }

    dropCallbackItems(event, index, realIndex, parentIndex, parentParentIndex, parentParentParentIndex, item, external, type, allowedType) {
        if (external) {
            if (allowedType === 'itemType' && !item.label) return false;
            if (allowedType === 'containerType' && !angular.isArray(item)) return false;
        }
        //set a timeout before binding since ddModel may not be called when already full updated
        let timerRefreshDDToConfig = this.$timeout(() => {
            this.formBuilderModel = angular.copy(this.ControlProxyService.setFormModel(this.formBuilderModel, this.dragDropModel));
            this.FormlyProxyService.setFormlyModel(this.formBuilderModel, this.formlyFields, this.dataModel);
            // refresh controls key in dragDrop Model to persist already exists controls between refreshes when item drop events
            this.ControlProxyService.setBuilderModelKeys(this.formBuilderModel, this.dragDropModel);
            this.markDirty();
        }, 200);

        // timerRefreshDDToConfig timer destruction
        this.$scope.$on('$destroy', () => this.$timeout.cancel(timerRefreshDDToConfig));
        return item;
    }


    saveFromEditPanel() {
        this.LeftPanelService.applyToModelCustom();
        this.LeftPanelService.applyToModel(this.LeftPanelService.getLine(), this.LeftPanelService.getColumn(), this.formBuilderModel);
        this.FormlyProxyService.setFormlyModel(this.formBuilderModel, this.formlyFields, this.dataModel);
        this.ControlProxyService.setBuilderModelKeys(this.formBuilderModel, this.dragDropModel);
        this.LeftPanelService.toggle(false);
        this.editor.toggle = this.LeftPanelService.toggleState();
        this.markDirty();
        this.editedControlKey = angular.copy(this.LeftPanelService.editor.control.key);
    }


    closeEditPanel() {
        this.LeftPanelService.applyToModel(this.LeftPanelService.getLine(), this.LeftPanelService.getColumn(), this.formBuilderModel);
        this.FormlyProxyService.setFormlyModel(this.formBuilderModel, this.formlyFields, this.dataModel);
        this.LeftPanelService.toggle(false);
        this.editor.toggle = this.LeftPanelService.toggleState();
    }

    toggleEditPanel(event, lineIndex, colIndex, item) {
        if (this.LeftPanelService.toggleState()) {
            this.LeftPanelService.applyToModel(this.LeftPanelService.getLine(), this.LeftPanelService.getColumn(), this.formBuilderModel);
            this.FormlyProxyService.setFormlyModel(this.formBuilderModel, this.formlyFields, this.dataModel);

            // check if new control right clicked otherwise just toggle side panel
            if (typeof this.LeftPanelService.getLine() !== 'undefined' &&
                typeof this.LeftPanelService.getColumn() !== 'undefined' &&
                typeof this.LeftPanelService.getControl() !== 'undefined') {
                if (this.LeftPanelService.getLine() === lineIndex &&
                    this.LeftPanelService.getColumn() === colIndex &&
                    angular.equals(this.LeftPanelService.getControl(), item.control)) {
                    //console.info('already opened for SAME ctrl: so close - no re-open');
                } else {
                    //console.info('already opened for DIFFERENT ctrl: so re-open');
                    item.rightCliked = true;
                    // set a timeout before re-opening, 500ms is ok for a ps-size="400px"
                    let timerCloseOpenedEditPanel = this.$timeout(() => {
                        this.LeftPanelService.setEditor(lineIndex, colIndex, item);
                        this.LeftPanelService.setFieldModel(this.formBuilderModel, lineIndex, colIndex);
                        this.LeftPanelService.toggle(true);

                        if (this.$scope.editor) {
                            this.$scope.editor.toggle = this.LeftPanelService.toggleState();
                        }
                    }, 200);
                    this.$scope.$on('$destroy', () => this.$timeout.cancel(timerCloseOpenedEditPanel));
                }
            }
        } else {
            // previous state = closed = immediate open
            // console.info('NOT already opened: so open');
            item.rightCliked = true;

            this.LeftPanelService.setEditor(lineIndex, colIndex, item);
            this.LeftPanelService.setFieldModel(this.formBuilderModel, lineIndex, colIndex);
            this.LeftPanelService.toggle(true);
            this.editor.toggle = this.LeftPanelService.toggleState();
        }
    }

    refreshModel() {
        let timerRefreshDDToConfig = this.$timeout(() => {
            this.formBuilderModel = angular.copy(this.ControlProxyService.setFormModel(this.formBuilderModel, this.dragDropModel));
            this.FormlyProxyService.setFormlyModel(this.formBuilderModel, this.formlyFields, this.dataModel);
            this.ControlProxyService.setBuilderModelKeys(this.formBuilderModel, this.dragDropModel);
            this.markDirty();
        }, 200);
        this.$scope.$on('$destroy', () => this.$timeout.cancel(timerRefreshDDToConfig));
    }

    removeLine(lineIndex) {
        this.dragDropModel[1].splice(lineIndex, 1);
        this.refreshModel();
    }

    insertLine(lineIndex) {
        this.dragDropModel[1].splice(lineIndex, 0, []);
        this.refreshModel();
    }

    removeItem(lineIndex, itemIndex, item) {
        this.dragDropModel[1][lineIndex].splice(itemIndex, 1);
        this.refreshModel();
    }

    lineUp(lineIndex) {
        if (lineIndex > 0) {
            let line = this.dragDropModel[1][lineIndex];
            this.dragDropModel[1].splice(lineIndex, 1);
            this.dragDropModel[1].splice((lineIndex - 1), 0, line);
            this.refreshModel();
        }
    }

    lineDown(lineIndex) {
        if (lineIndex < this.dragDropModel[1].length - 1) {
            let line = this.dragDropModel[1][lineIndex];
            this.dragDropModel[1].splice(lineIndex, 1);
            this.dragDropModel[1].splice((lineIndex + 1), 0, line);
            this.refreshModel();
        }
    }

    addLine() {
        this.dragDropModel[1].push([]);
        this.refreshModel();
    }
}

formBuilderController.$inject = [
    '$scope',
    'Version',
    '$filter',
    '$anchorScroll',
    'toaster',
    '$timeout',
    '$log',
    'FormlyProxyService',
    'LeftPanelService',
    'dragDropItemDecorationService',
    'ControlProxyService',
    'FormBuilderConfig'
];

export default formBuilderController;

export {
    FORM_BUILDER_CONTROLLER,
    FORM_BUILDER_CONTROLLERAS
};