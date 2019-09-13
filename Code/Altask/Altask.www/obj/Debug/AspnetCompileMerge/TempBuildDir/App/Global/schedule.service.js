//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class ScheduleService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(schedule) {
		this.Logger.debug('ScheduleService.create');
		return this.CrudService.create('Schedule', schedule);
    }

	list(filter) {
		this.Logger.debug('ScheduleService.list');
        return this.CrudService.list('Schedule', filter);
    }

	update(schedule) {
		this.Logger.debug('ScheduleService.update');
        return this.CrudService.update('Schedule', schedule);
    }
}

ScheduleService.$inject = ['AppConfig', 'CrudService', 'Logger'];
