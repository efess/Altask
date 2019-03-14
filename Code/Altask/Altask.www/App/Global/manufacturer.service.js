//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

export class ManufacturerService {
	constructor(AppConfig, CrudService, Logger) {
        this.AppConfig = AppConfig;
        this.CrudService = CrudService;
        this.Logger = Logger
    }

	create(manufacturer) {
		this.Logger.debug('ManufacturerService.create');
		return this.CrudService.create('Manufacturer', manufacturer);
    }

	list(filter) {
		this.Logger.debug('ManufacturerService.list');
        return this.CrudService.list('Manufacturer', filter);
    }

	update(manufacturer) {
		this.Logger.debug('ManufacturerService.update');
        return this.CrudService.update('Manufacturer', manufacturer);
    }
}

ManufacturerService.$inject = ['AppConfig', 'CrudService', 'Logger'];