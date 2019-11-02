import {FormService} from "../form.service";

export class FormServiceExt extends FormService {
    constructor(AppConfig, CommService, CrudService, Logger) {
        super(AppConfig, CrudService, Logger);
        this.CommService = CommService;
    }

    publish(form) {
        this.Logger.debug('FormService.publish');
        return this.CommService.call('/Form/Publish', null, form);
    }
}

FormServiceExt.$inject = ['AppConfig', 'CommService', 'CrudService', 'Logger'];
