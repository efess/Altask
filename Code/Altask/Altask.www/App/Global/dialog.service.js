import bootbox from "bootbox";

export class DialogService {
    constructor($state, AppConfig, Logger){
        this.$state = $state;
        this.AppConfig = AppConfig;
        this.Logger = Logger;
    }

    alert(title, message, className) {
        bootbox.alert({
            backdrop: true,
            title: title,
            message: "<p class=\"alert " + className + "\">" + message + "</p>",
        });
    }

    confirm(title, message, callback, buttons, className) {
        bootbox.confirm({
            backdrop: true,
            buttons: buttons || {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-default'
                }
            },
            title: title,
            message: className ? "<p class=\"alert " + className + "\">" + message + "</p>" : message,
            callback: (result) => { if (callback) { return callback(result); } }
        });
    }

    dialog(title, body, buttons, onOkay, onCancel) {
        bootbox.dialog({
            title: title,
            message: body,
            buttons: buttons || {
                cancel: {
                    label: "Cancel",
                    className: 'btn-default',
                    callback: (result) => { if (onCancel) { return onCancel(result); }}
                },
                ok: {
                    label: "Save",
                    className: 'btn-success',
                    callback: (result) => { if (onOkay) { return onOkay(result); } }
                }
            }
        });
    }

    error(error, title) { 
        if (error.status && error.status === 401) {
            let userName = this.AppConfig.user ? this.AppConfig.user.userName : "";
            this.AppConfig.user = undefined;
            this.AppConfig.settings = undefined;
            this.AppConfig.save();
            this.$state.go('login', { credentials: { userName: userName }});
        }  else {
            let message = "";

            if (error.data && error.data.errors){
                for (let index = 0; index < error.data.errors.length; index++) {
                    message += error.data.errors[index].Description + "\n";
                }

                this.Logger.warn(message);
            } else if (error.message) {
                this.Logger.error(error);
                message = error.message;
            } else {
                message = error;
                this.Logger.warn(message);
            }
        
            this.alert(title || "Error", message, "alert-danger");
        }
    }

    info(title, message) {
        this.alert(title, message, "alert-info");
    }

    success(title, message) {
        this.alert(title, message, "alert-success");
    }

    warning(title, message) {
        this.alert(title, message, "alert-warning");
    }
}

DialogService.$inject = ["$state", "AppConfig", "Logger"];