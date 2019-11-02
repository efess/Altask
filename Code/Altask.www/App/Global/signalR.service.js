import { hubConnection } from "signalr-no-jquery";
let _instance = null;

export class SignalRService {
    constructor($timeout, $q, AppConfig, Logger) {
        if (!_instance) {
            _instance = this;
        }

        this.$timeout = $timeout;
        this.$q = $q;
        this.AppConfig = AppConfig;
        this.Logger = Logger
        this.connectionState = {
            connecting: 0,
            connected: 1,
            reconnecting: 2,
            disconnected: 4
        };
    }

    connect() {
        this.Logger.debug('SignalRService.connect');
        var deferred = this.$q.defer();

        if (!this.connection || this.connection.start === this.connectionState.disconnected) {
            this.connection = hubConnection();
            this.hub = this.connection.createHubProxy("signalRHub");
            // We have to add this dummy event before calling connection.start().  SignalR will not subscribe
            // to the serivce without having any events registered before calling connection.start() which will
            // result in any event handlers added via subscribe not being invoked.
            this.hub.on("dummy", () => {});
            this.connection.logging = this.Logger.DEBUG;
            this.connection.reconnected(() => { this.Logger.debug("SignalR connection re-established"); });
            this.connection.start().done(() => {
                try {
                    var result = this.hub.invoke("connect", this.AppConfig.clientId, this.AppConfig.user.userName);
                    this.Logger.debug("SignalR connection established.");
                    this.Logger.debug(this.hub);
                    deferred.resolve(this.hub);
                } catch(error){
                    this.Logger.error(error);
                    deferred.reject(error);
                    _instance = null;
                }
            })
            .fail((error) => {
                this.Logger.error("SignalR connection failed: " + error);
            });
        } else {
            deferred.resolve(this.hub);
        }

        return deferred.promise;
    }

    subscribe(entityType, notifyCreate, notifyUpdate) {
        this.Logger.debug('SignalRService.subscribe');
        var deferred = this.$q.defer();

        this.connect()
        .then(() => {
            if (notifyCreate) {
                this.Logger.debug("SignalR method " + "notify" + entityType + "Create" + " subscribed to.");
                this.hub.on("notify" + entityType + "Create", notifyCreate);
            }
        
            if (notifyUpdate) {
                this.Logger.debug("SignalR method " + "notify" + entityType + "Update" + " subscribed to.");
                this.hub.on("notify" + entityType + "Update", notifyUpdate)
            }

            deferred.resolve();
        })
        .catch((error) => {
            this.Logger.error("Unable to subscribe to SignalR hub: " + error);
            deferred.reject(error);
        });

        return deferred.promise;
    }

    disconnect() {
        this.Logger.debug('SignalRService.disconnect');

        if (this.connection && this.connection.state !== this.connectionState.disconnected){
            var result = this.hub.invoke("disconnect", this.AppConfig.user.userName);
            this.Logger.debug("SignalR connection terminated.");
            this.Logger.debug(result);
        }
    }
}

SignalRService.$inject = ["$timeout", "$q", "AppConfig", "Logger"];
