//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class AssetLogService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(assetLog) {
		this.Logger.debug('AssetLogService.create');
		return this.CrudService.create('AssetLog', assetLog);
    }

	list(filter) {
		this.Logger.debug('AssetLogService.list');
        return this.CrudService.list('AssetLog', filter);
    }

	update(assetLog) {
		this.Logger.debug('AssetLogService.update');
        return this.CrudService.update('AssetLog', assetLog);
    }
}

AssetLogService.$inject = ['AppConfig', 'CrudService', 'Logger'];
