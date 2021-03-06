//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class AssetAlertLogService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(assetAlertLog) {
		this.Logger.debug('AssetAlertLogService.create');
		return this.CrudService.create('AssetAlertLog', assetAlertLog);
    }

	list(filter) {
		this.Logger.debug('AssetAlertLogService.list');
        return this.CrudService.list('AssetAlertLog', filter);
    }

	update(assetAlertLog) {
		this.Logger.debug('AssetAlertLogService.update');
        return this.CrudService.update('AssetAlertLog', assetAlertLog);
    }
}

AssetAlertLogService.$inject = ['AppConfig', 'CrudService', 'Logger'];
