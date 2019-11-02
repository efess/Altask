import {relativeDate} from "../../Utility/utility";
import moment from "moment";

class ServicesPanelController {
    constructor(AppConfig, CommService, DialogService, $scope, $compile) {
        this.AppConfig = AppConfig;
        this.CommService = CommService;
        this.DialogService = DialogService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.dirty = false; 
        this.init();
    }

    fetchStatus() {
        this.working = "Fetching Services Status...";
        this.CommService.call('/AssetAlertService/GetStatus')
        .then((response) => {
            this.assetAlertService = {
                running: response.data.running,
                lastRun: moment(response.data.lastRun).format("MM/DD/YYYY hh:mm:ss A")
            }

            return this.CommService.call('/TaskAlertService/GetStatus');
        })
        .then((response) => {
            this.taskAlertService = {
                running: response.data.running,
                lastRun: moment(response.data.lastRun).format("MM/DD/YYYY hh:mm:ss A")
            }

            return this.CommService.call('/OccurrenceService/GetStatus');
        })
        .then((response) => {
            this.occurrenceService = {
                running: response.data.running,
                lastRun: moment(response.data.lastRun).format("MM/DD/YYYY hh:mm:ss A")
            }
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "");
    }

    init() {
        this.working = "";
        this.errors = [];
        this.modalErrors = [];
        this.fetchStatus();        
    }

    isModalValid() {
        return this.modalErrors.length === 0;
    }

    isValid() {
        return this.errors.length === 0;
    }

    markDirty() {
        this.$scope.$evalAsync(() => { this.dirty = true; });
    }

    save() {
        
    }

    startService(name){
        this.working = "Starting Service...";
        this.CommService.call('/' + name + '/Start')
        .then((response) => {
            let service = undefined;

            switch(name) {
                case "AssetAlertService": service = this.assetAlertService; break;
                case "OccurrenceService": service = this.occurrenceService; break;
                case "TaskAlertService": service = this.taskAlertService; break;
            }

            service.running = response.data.running;
            service.lastRun = moment(response.data.lastRun).format("MM/DD/YYYY hh:mm:ss A");
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "");
    }

    stopService(name){
        this.working = "Stopping Service...";
        this.CommService.call('/' + name + '/Stop')
        .then((response) => {
            let service = undefined;

            switch(name) {
                case "AssetAlertService": service = this.assetAlertService; break;
                case "OccurrenceService": service = this.occurrenceService; break;
                case "TaskAlertService": service = this.taskAlertService; break;
            }

            service.running = response.data.running;
            service.lastRun = moment(response.data.lastRun).format("MM/DD/YYYY hh:mm:ss A");
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "");
    }
}

ServicesPanelController.$inject = ["AppConfig", "CommService", "DialogService", "$scope", "$compile"];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const servicesPanel = {
    controller: ServicesPanelController,
    templateUrl: "Views/System/servicesPanel.html",
};
