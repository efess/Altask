//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class TaskAlertService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(taskAlert) {
		this.Logger.debug('TaskAlertService.create');
		return this.CrudService.create('TaskAlert', taskAlert);
    }

	list(filter) {
		this.Logger.debug('TaskAlertService.list');
        return this.CrudService.list('TaskAlert', filter);
    }

	update(taskAlert) {
		this.Logger.debug('TaskAlertService.update');
        return this.CrudService.update('TaskAlert', taskAlert);
    }
}

TaskAlertService.$inject = ['AppConfig', 'CrudService', 'Logger'];
