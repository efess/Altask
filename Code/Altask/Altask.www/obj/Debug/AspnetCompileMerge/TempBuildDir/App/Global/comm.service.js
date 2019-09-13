export class CommService {
    constructor($q, $http, $state, AppConfig, Logger) {
        this.$q = $q;
        this.$http = $http;
        this.$state = $state;
        this.AppConfig = AppConfig;
        this.Logger = Logger;
    }

    serializeHttpParms(parameters) {
        var result = '';
        if (!!parameters) {
            var keys = Object.keys(parameters);
            for (var i = 0; i < keys.length; i++) {
                result +=
                    (0 == i ? '' : '&') +
                    encodeURIComponent(keys[i]) +
                    '=' +
                    encodeURIComponent(parameters[keys[i]]);
            }
        }

        return result;
    }

    call(url, parameters, data) {
        this.Logger.debug('CommService.call');
        var deferred = this.$q.defer();

        try {
            var config = {
                method: 'GET',
                url: url + (parameters ? '?' + this.serializeHttpParms(parameters) : ''),
                timeout: '120000',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'text/plain',
                    'X-Altask-Client-Id': this.AppConfig.clientId ? this.AppConfig.clientId : '',
                    'X-Altask-User-Name' : this.AppConfig.user ? this.AppConfig.user.userName : '',
                },
            };

            if (!!data) {
                angular.extend(config, {
                    method: 'POST',
                    data: data,
                    responseType: 'json',
                });
            };
        } catch (e) {
            this.Logger.debug('CommService.call.error');
            this.Logger.debug(e);
            deferred.reject(e);
            return deferred.promise;
        }

        this.$http(config)
        .then((response) => {
            this.Logger.debug('CommService.call.response');
            this.Logger.debug(response);
            deferred.resolve(response);
        })
        .catch((error) => {
            this.Logger.debug('CommService.call.error');
            this.Logger.debug(error);
            deferred.reject(error);   
        });

        return deferred.promise;
    };

}
CommService.$inject = ['$q', '$http', '$state', 'AppConfig', 'Logger'];
