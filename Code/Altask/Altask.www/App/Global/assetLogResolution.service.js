//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class AssetLogResolutionService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(assetLogResolution) {
		this.Logger.debug('AssetLogResolutionService.create');
		return this.CrudService.create('AssetLogResolution', assetLogResolution);
    }

	list(filter) {
		this.Logger.debug('AssetLogResolutionService.list');
        return this.CrudService.list('AssetLogResolution', filter);
    }

	update(assetLogResolution) {
		this.Logger.debug('AssetLogResolutionService.update');
        return this.CrudService.update('AssetLogResolution', assetLogResolution);
    }
}

AssetLogResolutionService.$inject = ['AppConfig', 'CrudService', 'Logger'];