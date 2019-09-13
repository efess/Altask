//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class ScheduleUserTypeService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(scheduleUserType) {
		this.Logger.debug('ScheduleUserTypeService.create');
		return this.CrudService.create('ScheduleUserType', scheduleUserType);
    }

	list(filter) {
		this.Logger.debug('ScheduleUserTypeService.list');
        return this.CrudService.list('ScheduleUserType', filter);
    }

	update(scheduleUserType) {
		this.Logger.debug('ScheduleUserTypeService.update');
        return this.CrudService.update('ScheduleUserType', scheduleUserType);
    }
}

ScheduleUserTypeService.$inject = ['AppConfig', 'CrudService', 'Logger'];
