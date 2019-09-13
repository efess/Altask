import {ScheduleService} from "../schedule.service";

export class ScheduleServiceExt extends ScheduleService {
    constructor(AppConfig, CommService, CrudService, Logger) {
        super(AppConfig, CrudService, Logger);
        this.CommService = CommService;
    }

    getRunDates(schedule, from, to) {
        this.Logger.debug('ScheduleService.getRunDates');
        return this.CommService.call('/Schedule/GetRunDates', null, { schedule: schedule, from: from, to: to });
    }

    projectTo(from, to, userIds, assetIds, taskTypeIds, taskCategoryIds) {
        this.Logger.debug('ScheduleService.projectTo');
        return this.CommService.call('/Schedule/ProjectTo', null, { UserIds: userIds, AssetIds: assetIds, CategoryIds: taskCategoryIds, TypeIds: taskTypeIds, FromDate: from, ToDate: to });
    }
}

ScheduleServiceExt.$inject = ['AppConfig', 'CommService', 'CrudService', 'Logger'];
