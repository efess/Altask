require('angular-ui-calendar/src/calendar.js');
require('fullcalendar/dist/fullcalendar.js');
require('fullcalendar/dist/gcal.js');
require("angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js");
/**
 * This file imports the third party library dependencies, then creates the angular module "app"
 * and exports it.
 */
// External dependencies
import "jquery";
import "bootstrap";
import "moment";
import "bootbox";
import "datatables.net";
import "datatables.net-bs";
import "datatables.net-select";
import * as angular from "angular";

import "angular-animate";
import "angular-translate";
import 'textAngular';
import 'textAngular/dist/textAngular-sanitize';
import "angular-strap";
import "@lordfriend/nya-bootstrap-select";
import "angularjs-toaster";

import uiRouter from "@uirouter/angularjs";
import ocLazyLoad from "oclazyload";
import uiBootstrap from "angular-ui-bootstrap";
import * as apiCheck from "api-check";
import formly from "angular-formly";
import formlyBootstrap from "angular-formly-templates-bootstrap";

import mainModule from "../FormBuilder/main";

import { MAIN_MODULE } from "../main/main.module";
import { GLOBAL_MODULE } from "../global/global.module";

// Create the angular module "app".
//
// Since it is exported, other parts of the application (in other files) can then import it and register things.
// In bootstrap.js, the module is imported, and the components, services, and states are registered.
export const ngmodule = angular.module("app", [
    uiRouter,
    ocLazyLoad,
    uiBootstrap,
    mainModule.name,
    formly,
    formlyBootstrap,
    MAIN_MODULE.name,
    GLOBAL_MODULE.name,
    "ui.calendar",
    "angularjs-dropdown-multiselect"
]);

ngmodule.config(["$uiRouterProvider", "uibDatepickerConfig", "uibDatepickerPopupConfig", "formlyConfigProvider", function ($uiRouterProvider, uibDatepickerConfig, uibDatepickerPopupConfig, formlyConfig) {
    uibDatepickerConfig.formatYear="yy";
    uibDatepickerConfig.startingDay = 1;
    uibDatepickerConfig.showWeeks = false;
    uibDatepickerPopupConfig.datepickerPopup = "MM/dd/yyyy";
    uibDatepickerPopupConfig.currentText = "Today";
    uibDatepickerPopupConfig.clearText = "Clear";
    uibDatepickerPopupConfig.closeText = "Close";

    var apiCheck = require('api-check');
    apiCheck.globalConfig.disabled = true;

    $.fn.dataTable.Api.register('row().show()', function() {
        var page_info = this.table().page.info();
        // Get row index
        var new_row_index = this.index();
        // Row position
        var row_position = this.table().rows()[0].indexOf( new_row_index );
        // Already on right page ?
        if( row_position >= page_info.start && row_position < page_info.end ) {
            // Return row object
            return this;
        }
        // Find page number
        var page_to_display = Math.floor( row_position / this.table().page.len() );
        // Go to that page
        this.table().page( page_to_display );
        // Return row object
        return this;
    });
}]);
