export class CrudService {
    constructor(AppConfig, CommService, Logger) {
        this.AppConfig = AppConfig;
        this.CommService = CommService;
        this.Logger = Logger
    }

    create(controllerName, asset) {
        this.Logger.debug('CrudService.' + controllerName + '.create');
        return this.CommService.call('/' + controllerName + '/Create', null, asset);
    }

    list(controllerName, filter) {
        this.Logger.debug('CrudService.' + controllerName + '.list');
        return this.CommService.call('/' + controllerName + '/List', filter);
    }

    update(controllerName, asset) {
        this.Logger.debug('CrudService.' + controllerName + '.update');
        return this.CommService.call('/' + controllerName + '/Update', null, asset);
    }
}

CrudService.$inject = ['AppConfig', 'CommService', 'Logger'];
