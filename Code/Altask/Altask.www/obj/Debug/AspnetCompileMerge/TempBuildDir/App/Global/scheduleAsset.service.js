//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class ScheduleAssetService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(scheduleAsset) {
		this.Logger.debug('ScheduleAssetService.create');
		return this.CrudService.create('ScheduleAsset', scheduleAsset);
    }

	list(filter) {
		this.Logger.debug('ScheduleAssetService.list');
        return this.CrudService.list('ScheduleAsset', filter);
    }

	update(scheduleAsset) {
		this.Logger.debug('ScheduleAssetService.update');
        return this.CrudService.update('ScheduleAsset', scheduleAsset);
    }
}

ScheduleAssetService.$inject = ['AppConfig', 'CrudService', 'Logger'];
