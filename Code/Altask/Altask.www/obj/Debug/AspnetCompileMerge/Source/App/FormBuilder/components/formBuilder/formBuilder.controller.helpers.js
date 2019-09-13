/* global angular */
const DEBUG_MODEL = {
    showDebug: false,
    configurationModelNumberofLines: 1
};

const initDebugModel = () => angular.copy(DEBUG_MODEL);


const DEFAULT_TAB_MODEL = {
    editTab: {
        active: true
    },
    previewTab: {
        active: false,
        tabVisible: true,
        modelsVisible: true
    }
};

const initTabModel = (isPreviewPanelVisible, arePreviewModelsVisible) => {
    let _tabModel = angular.copy(DEFAULT_TAB_MODEL);
    angular.extend(_tabModel.previewTab, {
        tabVisible: isPreviewPanelVisible,
        modelsVisible: arePreviewModelsVisible
    });
    return _tabModel;
};


const COLUMN_TEMPLATE = {
    "line": 1,
    "activeColumn": 1,
    "columns": [{
        "numColumn": 1,
        "exist": true,
        "control": {
            "className": "col-12",
            "type": "header",
            "key": "header-1507756947663",
            "templateOptions": {
                "label": "",
                "required": false,
                "description": "New Form",
                "placeholder": "",
                "options": [

                ]
            },
            "templateId": "Header",
            "subtype": "",
            "edited": true
        }
    }]
};

const initColumnTemplate = () => angular.copy(COLUMN_TEMPLATE);


const LINE_TEMPLATE = {
    "line": 1,
    "activeColumn": 1,
    "columns": [{
        "numColumn": 1,
        "exist": true,
        "control": {
            "className": "col-12",
            "type": "header",
            "key": "header-1507756947663",
            "templateOptions": {
                "label": "",
                "required": false,
                "description": "New Form",
                "placeholder": "",
                "options": [

                ]
            },
            "templateId": "Header",
            "subtype": "",
            "edited": true
        }
    }]
};

const initLineTemplate = () => angular.copy(LINE_TEMPLATE);


const DEFAULT_IHM_MODEL = {
    preview: {
        formlyModelViewExpanded: true,
        formlyFieldsViewExpanded: true,
        customizeFormButtonsExpanded: true,
        saveThisFormExpanded: true
    }
};


const initIhmModel = () => angular.copy(DEFAULT_IHM_MODEL);

export {
    initDebugModel,
    initTabModel,
    initColumnTemplate,
    initLineTemplate,
    initIhmModel
};