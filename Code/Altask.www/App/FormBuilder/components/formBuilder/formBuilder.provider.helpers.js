const LIST_DRAG_DROP_ITEM_CSS_CLASSES = [{
        cssClass: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        numberItemPerRow: 0
    },
    {
        cssClass: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        numberItemPerRow: 1
    },
    {
        cssClass: 'col-xs-6 col-sm-6 col-md-6 col-lg-6',
        numberItemPerRow: 2
    },
    {
        cssClass: 'col-xs-4 col-sm-4 col-md-4 col-lg-4',
        numberItemPerRow: 3
    },
    {
        cssClass: 'col-xs-3 col-sm-3 col-md-3 col-lg-3',
        numberItemPerRow: 4
    }
];

const DRAG_DROP_CONFIG_MODEL = {
    dropZoneConfig: {
        decoration: [{
                WhenIndex: 0,
                ApplycssClass: 'col-md-4 control-list',
                fontAwesomeIcon: 'fa fa-level-up',
                title: 'Drag control from here: '
            },
            {
                WhenIndex: 1,
                ApplycssClass: 'col-md-8 form-builder-editor',
                fontAwesomeIcon: 'fa fa-level-down',
                title: 'Drop control into here: '
            }
        ],
        verboseMode: false
    },
    containerConfig: {
        decoration: [{
                WhenIndex: 0,
                ApplycssClass: 'col-md-12',
                title: 'Blank: ',
                groupId: 'blank',
                isCollapsed: true
            },
            {
                WhenIndex: 1,
                ApplycssClass: 'col-md-12',
                title: 'Html: ',
                groupId: 'html',
                isCollapsed: true
            },
            {
                WhenIndex: 2,
                ApplycssClass: 'col-md-12',
                title: 'Headers: ',
                groupId: 'headers',
                isCollapsed: true
            },
            {
                WhenIndex: 3,
                ApplycssClass: 'col-md-12',
                title: 'Text inputs: ',
                groupId: 'inputs',
                isCollapsed: true
            },
            {
                WhenIndex: 4,
                ApplycssClass: 'col-md-12',
                title: 'Textareas: ',
                groupId: 'textareas',
                isCollapsed: true
            },
            {
                WhenIndex: 5,
                ApplycssClass: 'col-md-12',
                title: 'Radios: ',
                groupId: 'radios',
                isCollapsed: true
            },
            {
                WhenIndex: 6,
                ApplycssClass: 'col-md-12',
                title: 'Checkboxes: ',
                groupId: 'checkboxes',
                isCollapsed: true
            },
            {
                WhenIndex: 7,
                ApplycssClass: 'col-md-12',
                title: 'Selects: ',
                groupId: 'selects',
                isCollapsed: true
            }
        ],
        verboseMode: false,
        collapseEnabled: true,
        collapseController: [{
                atIndex: 0,
                collapse: true
            },
            {
                atIndex: 1,
                collapse: true
            }
        ]
    },
    itemConfig: {
        verboseMode: false
    }
};

const DRAG_DROP_PRESENTATION_MODEL = [
    //1 column here is control selection column
    [],
    [
        //empty 1st line at initialisation
        []
    ]
];

const ITEMS_NOT_TO_COUNT_FOR_REAL = {
    //placeholder: '',
    itemBeingDragged: ''
};

export {
    LIST_DRAG_DROP_ITEM_CSS_CLASSES,
    DRAG_DROP_CONFIG_MODEL,
    DRAG_DROP_PRESENTATION_MODEL,
    ITEMS_NOT_TO_COUNT_FOR_REAL
};