
import {
    dateFormats,
    setToday,
    clearDateTime
} from './leftPanel.controller.helpers';

const LEFT_PANEL_CONTROLLER = 'leftPanelController';
const LEFT_PANEL_CONTROLLERAS = 'leftPanelController';

class leftPanelController {
    constructor(toaster,
        $timeout,
        $selectOptionMange,
        $scope,
        LeftPanelService) {

        this.toaster = toaster;
        this.$timeout = $timeout;
        this.$selectOptionMange = $selectOptionMange;
        this.$scope = $scope;
        this.LeftPanelService = LeftPanelService;

        this.init();
    }

    init() {
        this.fieldModel = this.LeftPanelService.fieldModel;
        this.fieldModel.templateId = this.fieldModel.temporyConfig.templateId;
        this.basicSelectOptions = this.LeftPanelService.basicSelectOptions;
        this.basicSelectOption = this.LeftPanelService.basicSelectOption;

        this.radioOptions = this.LeftPanelService.radioOptions;
        this.radioOption = this.LeftPanelService.radioOption;

        this.demodt = {};
        this.demodt.formats = dateFormats;
        this.dateOptions = this.getDateOptions();

        this.initNyaSelectConformingSelectedControl();

        this.$scope.$watch(() => this.LeftPanelService.basicSelectOptions, (a, b) => {
            this.basicSelectOptions = this.LeftPanelService.basicSelectOptions;
        });

        this.$scope.$watch(() => this.LeftPanelService.radioOptions, (a, b) => {
            this.radioOptions = this.LeftPanelService.radioOptions;
        });
    }

    getDateOptions() {
        let dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: true,
            initDate: null
        };
        return dateOptions;
    }

    initNyaSelectConformingSelectedControl() {
        //place proxyModel to selection if not none:
        if (this.fieldModel.temporyConfig.templateId !== 'none') {
            for (let i = this.fieldModel.controls.length - 1; i >= 0; i--) {
                if (this.fieldModel.controls[i].id === this.fieldModel.temporyConfig.templateId) {
                    this.modelproxyModel = this.fieldModel.controls[i];
                }
            }

            if (this.fieldModel.temporyConfig.templateId === 'BasicSelect') this.LeftPanelService.setBasicSelect(this.basicSelectOptions);
            if (this.fieldModel.temporyConfig.templateId === 'Radio') this.LeftPanelService.setRadio(this.radioOptions);
        }
    }

    updateSpecialControl() {
        //refresh service data for particular controls as selects and radio
        this.fieldModel.basicSelectOptions = this.basicSelectOptions;
        this.fieldModel.basicSelectOption = this.basicSelectOption;
        this.fieldModel.radioOptions = this.radioOptions;
        this.fieldModel.radioOption = this.radioOption;
        //force apply update proxyModel
        this.LeftPanelService.applyToModelCustom();
        return true;
    }

    resetTemporyConfig() {
        this.fieldModel.temporyConfig = {
            formlyLabel: '',
            formlyRequired: false,
            formlyPlaceholder: '',
            formlyDescription: '',
            formlyOptions: []
        };
    }

    resetControl() {
        this.fieldModel.temporyConfig.formlyLabel = '';
        this.fieldModel.temporyConfig.formlyRequired = false;
        this.fieldModel.temporyConfig.formlyPlaceholder = '';
        this.fieldModel.temporyConfig.formlyDescription = '';
        this.fieldModel.temporyConfig.formlyOptions = [];
        this.fieldModel.temporyConfig.datepickerPopup = "MM/dd/yyyy";
        this.fieldModel.temporyConfig.datepickerOptions = [];
        this.fieldModel.temporyConfig.step = 1;
        this.fieldModel.temporyConfig.min = 0;
        this.fieldModel.temporyConfig.min = 0;
    }


    /**
     * ==============================================================
     * specific controls management
     * (display, properties....: ex: grouped Select)
     * ==============================================================
     */
    addNewOptionRadio() {
        let result = this.$selectOptionMange.addNewOptionRadio(this.radioOptions, this.radioOption.saisie);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: `'${this.radioOption.saisie}' cannot be added.`,
                showCloseButton: true
            });
        }
        //reset input
        this.radioOption = {
            saisie: ''
        };
    }

    removeRadioRow(index) {
        let result = this.$selectOptionMange.removeOption(this.radioOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Delete was cancelled.',
                showCloseButton: true
            });
        }
    }

    upThisRadioRow(index) {
        let result = this.$selectOptionMange.upthisOption(this.radioOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Operation cancelled.',
                showCloseButton: true
            });
        }
    }

    downThisRadioRow(index) {
        let result = this.$selectOptionMange.downthisOption(this.radioOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Operation cancelled.',
                showCloseButton: true
            });
        }
    }

    addNewOptionBasicSelect() {
        let result = this.$selectOptionMange.addNewOptionBasicSelect(this.basicSelectOptions, this.basicSelectOption.saisie);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: `'${this.basicSelectOption.saisie}' cannot be added.`,
                showCloseButton: true
            });
        }
        this.basicSelectOption = {
            saisie: ''
        }; //reset input
    }

    removeRow(index) {
        let result = this.$selectOptionMange.removeOption(this.basicSelectOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Delete was cancelled.',
                showCloseButton: true
            });
        }
    }

    upThisRow(index) {
        let result = this.$selectOptionMange.upthisOption(this.basicSelectOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Operation cancelled.',
                showCloseButton: true
            });
        }
    }

    downThisRow(index) {
        let result = this.$selectOptionMange.downthisOption(this.basicSelectOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Operation cancelled.',
                showCloseButton: true
            });
        }
    }

    showGroupListToChoose() {
        this.groupSelectGroupClick.showList = !this.groupSelectGroupClick.showList;
    }

    addNewGroupToGroupedSelect() {
        if (this.groupSelectGroup.saisie !== '') {
            for (let i = this.groupSelectGroups.list.length - 1; i >= 0; i--) {
                if (this.groupSelectGroups.list[i] === this.groupSelectGroup.saisie) {
                    this.toaster.pop({
                        type: 'warning',
                        timeout: 2000,
                        title: 'Group already exists',
                        body: 'No group added.',
                        showCloseButton: true
                    });
                }
            }
            this.groupSelectGroups.list.push(this.groupSelectGroup.saisie);
        } else {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: 'Not a valid group to add',
                body: 'No group added.',
                showCloseButton: true
            });
        }
        this.groupSelectGroup.saisie = '';
    }


    addNewOptionGroupedSelect() {
        let result = this.$selectOptionMange.addNewOptionGroupedSelect(this.groupSelectOptions, this.groupSelectOption.saisie, '');
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: `'${this.groupSelectOption.saisie}' cannot be added.`,
                showCloseButton: true
            });
        }
        //bind nya: dont bind here $apply is not done fast enough
        //bindGroupedSelectToNya();
        //reset input
        this.groupSelectOption = {
            saisie: ''
        };
    }


    removeGroupedSelectRow(index) {
        let result = this.$selectOptionMange.removeOption(this.groupSelectOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Delete was cancelled.',
                showCloseButton: true
            });
        }
    }

    upThisGroupedSelectRow(index) {
        let result = this.$selectOptionMange.upthisOption(this.groupSelectOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Operation cancelled.',
                showCloseButton: true
            });
        }
    }


    downThisGroupedSelectRow(index) {
        let result = this.$selectOptionMange.downthisOption(this.groupSelectOptions, index);
        if (result.resultFlag === false) {
            this.toaster.pop({
                type: 'warning',
                timeout: 2000,
                title: result.details,
                body: 'Operation cancelled.',
                showCloseButton: true
            });
        }
    }


    today() {
        setToday(this.demodt);
    }


    clear() {
        clearDateTime(this.demodt);
    }


    open($event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.demodt.opened = true;
    }



}

leftPanelController.$inject = [
    'toaster',
    '$timeout',
    '$selectOptionMange',
    '$scope',
    'LeftPanelService'
];

export default leftPanelController;

export {
    LEFT_PANEL_CONTROLLER,
    LEFT_PANEL_CONTROLLERAS
};