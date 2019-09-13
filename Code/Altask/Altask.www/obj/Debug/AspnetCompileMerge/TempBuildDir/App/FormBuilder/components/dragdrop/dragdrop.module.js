/* global angular */
import ddContentCounter, {
    DD_CONTENT_COUNTER_DIRECTIVE
} from './ddContentCounter/dragdrop.ddContentCounter.directive';
import dragDropItemCounterService, {
    DRAG_DROP_ITEM_COUNTER_SERVICE
} from './ddContentCounter/dragdrop.ddContentCounter.service';
import ddDecorContainerDirective, {
    DD_DECOR_CONTAINER_DIRECTIVE
} from './ddDecorContainer/dragdrop.ddDecorContainer.directive';
import ddDecorContainerController, {
    DD_DECOR_CONTAINER_CONTROLLER_NAME
} from './ddDecorContainer/dragdrop.ddDecorContainer.controller';
import ddDecorDropZone, {
    DD_DECOR_DROPZONE_DIRECTIVE
} from './ddDecorDropZone/dragdrop.ddDecorDropZone.directive';
import ddDecorItem, {
    DRAG_DROP_DECOR_ITEM
} from './ddDecorItem/dragdrop.ddDecorItem.directive';
import dragDropItemDecorationService, {
    DRAG_DROP_ITEM_DECOR_SERVICE
} from './ddDecorItem/dragdrop.ddDecorItem.service';
import ddDecorLine, {
    DRAG_DROP_DECOR_LINE
} from './ddDecorLine/dragdrop.ddDecorLine.directive';

import ddNoEditableControl, {
    DRAG_DROP_NO_EDITABLE_CONTROL
} from './ddNoEditableControl/dragdrop.ddNoEditableControl.directive';


const DRAGDROP_MODULE = 'dragdrop.module';

export default angular
    .module(DRAGDROP_MODULE, [])
    .directive(DD_CONTENT_COUNTER_DIRECTIVE, ddContentCounter)
    .controller(DD_DECOR_CONTAINER_CONTROLLER_NAME, ddDecorContainerController)
    .directive(DD_DECOR_CONTAINER_DIRECTIVE, ddDecorContainerDirective)
    .directive(DD_DECOR_DROPZONE_DIRECTIVE, ddDecorDropZone)
    .directive(DRAG_DROP_DECOR_ITEM, ddDecorItem)
    .service(DRAG_DROP_ITEM_DECOR_SERVICE, dragDropItemDecorationService)
    .directive(DRAG_DROP_NO_EDITABLE_CONTROL, ddNoEditableControl)
    .service(DRAG_DROP_ITEM_COUNTER_SERVICE, dragDropItemCounterService)
    .directive(DRAG_DROP_DECOR_LINE, ddDecorLine);