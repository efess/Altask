import formlyConfigFunct from './config/formlyConfig.config';
import dragDropConfigFunt, {
    VERSION_NAME,
    VERSION_VALUE
} from './config/dragDropConfig.config';
import coreModule from './core/core.module';
import leftPanelModule from './components/leftPanel/leftPanel.module';
import formlyProxyModule from './components/formlyProxy/formlyProxy.module';
import dragdropModule from './components/dragdrop/dragdrop.module';
import configProxyModule from './components/configurationModelProxy/configurationModelProxy.module';

import dragAndDropListModule from './components/common/dragAndDropList/dragAndDropList.module';
import pageSlideModule from './components/common/pageslide/pageslide.module';

import formBuilderModule from './components/formBuilder/formBuilder.module';
import trustThisFilterModule from './components/common/edaTrustThisFilter/trustThis.module';

const MODULE_NAME = 'eda.easyformGen.dragDropWay';

const DRAG_DROP_MODULES_INJECT = [
    coreModule.name,
    configProxyModule.name,
    trustThisFilterModule.name,
    leftPanelModule.name,
    formlyProxyModule.name,
    dragdropModule.name,
    formBuilderModule.name,
    dragAndDropListModule.name,
    pageSlideModule.name
];

const mainModule = angular
    .module(MODULE_NAME, DRAG_DROP_MODULES_INJECT)
    .config(dragDropConfigFunt)
    .config(formlyConfigFunct)
    .value(VERSION_NAME, VERSION_VALUE);

export default mainModule;