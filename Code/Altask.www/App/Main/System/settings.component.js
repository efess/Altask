import {relativeDate} from "../../Utility/utility";

class SettingsController {
    constructor(AppConfig, DialogService, FormService, SettingService, TaskCategoryService, $scope, $compile, $q) {
        this.AppConfig = AppConfig;
        this.DialogService = DialogService;
        this.FormService = FormService;
        this.SettingService = SettingService;
        this.TaskCategoryService = TaskCategoryService;
        this.$scope = $scope;
        this.$compile = $compile;
        this.$q = $q;
        this.dirty = false; 
        this.init();
        this.loadSettings();
    }

    discard() {
        this.errors = [];
        $(".has-error").removeClass("has-error");
        this.loadSettings();
        this.dirty = false;
    }

    getSetting(area, classification, name) {
        if (this.settings.list) {
            return this.settings.list.find((elem) => { return elem.Area === area && elem.Classification === classification && elem.Name === name; })
        }

        return { Value: "" }
    }

    loadSettings() {
        this.working = "Loading Settings...";
        this.SettingService.list()
        .then((response) => {
            this.settings = {
                alertResolution: {},
                list: response.data.settings
            };
            this.working = "Loading Task Categories...";
            return this.TaskCategoryService.list({ Active: true });
        })
        .then((response) => {
            this.taskCategories = response.data.taskCategories;
            this.taskCategories.sort((a,b) => { return a.Name.localeCompare(b.Name); });
            this.working = "Loading Forms...";
            return this.FormService.list({ Active: true});
        })
        .then((response) => {
            this.forms = response.data.forms;
            this.forms.sort((a,b) => { return a.Name.localeCompare(b.Name); });
            this.extractSettings();
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
    }

    isModalValid() {
        return this.modalErrors.length === 0;
    }

    isValid() {
        return this.errors.length === 0;
    }

    extractSettings() {
        this.settings.system = {
            email: {
                smtpAddress: this.getSetting("System", "Email", "SmtpAddress").Value,
                smtpPort: parseInt(this.getSetting("System", "Email", "SmtpPort").Value),
                from: this.getSetting("System", "Email", "From").Value,
                userName: this.getSetting("System", "Email", "UserName").Value,
                password: this.getSetting("System", "Email", "Password").Value
            }
        };

        this.settings.alertResolution = {
            defaults: {
                name: this.getSetting("AlertResolution", "Default", "Name").Value,
                taskCategoryId: null,
                taskCategory: this.getSetting("AlertResolution", "Default", "TaskCategory").Value,
                formId: null,
                form: this.getSetting("AlertResolution", "Default", "Form").Value,
                idleTimeout: parseInt(this.getSetting("AlertResolution", "Default", "IdleTimeout").Value),
                description: this.getSetting("AlertResolution", "Default", "Description").Value,
                asEarlyAsN: parseInt(this.getSetting("AlertResolution", "Default", "AsEarlyAsN").Value),
                asEarlyAsFrequency: this.getSetting("AlertResolution", "Default", "AsEarlyAsFrequency").Value,
            }
        };

        let index = this.taskCategories.findIndex((elem) => { return elem.Name === this.settings.alertResolution.defaults.taskCategory; });

        if (index > -1) {
            this.settings.alertResolution.defaults.taskCategoryId = this.taskCategories[index].Id;
        }

        index = this.forms.findIndex((elem) => { return elem.Name === this.settings.alertResolution.defaults.form; });

        if (index > -1) {
            this.settings.alertResolution.defaults.formId = this.forms[index].Id;
        }
    }

    markDirty() {
        this.$scope.$evalAsync(() => { this.dirty = true; });
    }

    save() {
        this.working = "Saving Setting...";
        let taskCategory = this.taskCategories.find((elem) => { return elem.Id === this.settings.alertResolution.defaults.taskCategoryId; });
        let form = this.forms.find((elem) => { return elem.Id == this.settings.alertResolution.defaults.formId; });
        this.getSetting("System", "Email", "SmtpAddress").Value = this.settings.system.email.smtpAddress;
        this.getSetting("System", "Email", "SmtpPort").Value = this.settings.system.email.smtpPort;
        this.getSetting("System", "Email", "SmtpPort").Value = this.settings.system.email.smtpPort;
        this.getSetting("System", "Email", "From").Value = this.settings.system.email.from;
        this.getSetting("System", "Email", "UserName").Value = this.settings.system.email.userName;
        this.getSetting("System", "Email", "Password").Value = this.settings.system.email.password;
        this.getSetting("AlertResolution", "Default", "Name" ).Value = this.settings.alertResolution.defaults.name;
        this.getSetting("AlertResolution", "Default", "TaskCategory" ).Value = taskCategory ? taskCategory.Name : "";
        this.getSetting("AlertResolution", "Default", "Form" ).Value = form ? form.Name : "";
        this.getSetting("AlertResolution", "Default", "IdleTimeout" ).Value = this.settings.alertResolution.defaults.idleTimeout;
        this.getSetting("AlertResolution", "Default", "Description" ).Value = this.settings.alertResolution.defaults.description;
        this.getSetting("AlertResolution", "Default", "AsEarlyAsN" ).Value = this.settings.alertResolution.defaults.asEarlyAsN;
        this.getSetting("AlertResolution", "Default", "AsEarlyAsFrequency" ).Value = this.settings.alertResolution.defaults.asEarlyAsFrequency;
        var promises = [];

        angular.forEach(this.settings.list, (setting) => {
            promises.push(this.SettingService.update(setting));
        });

        this.$q.all(promises)
        .then((response) => {
            this.DialogService.success("Changes Saved!", "Your changes have been successfully saved.")
            this.dirty = false;
        })
        .catch((error) => {
            this.DialogService.error(error);
        })
        .finally(() => this.working = "")
    }
}

SettingsController.$inject = ["AppConfig", "DialogService", "FormService", "SettingService", "TaskCategoryService", "$scope", "$compile", "$q"];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const settings = {
    controller: SettingsController,
    templateUrl: "Views/System/settings.html",
};
