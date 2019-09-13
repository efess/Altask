import {OccurrenceService} from "../occurrence.service";

export class OccurrenceServiceExt extends OccurrenceService {
    constructor(AppConfig, CommService, CrudService, Logger) {
        super(AppConfig, CrudService, Logger);
        this.CommService = CommService;
    }

    add(scheduleId, assetId, userId, date) {
        this.Logger.debug('OccurrenceService.add');
        return this.CommService.call('/Occurrence/Add', null, { scheduleId: scheduleId, assetId: assetId, userId: userId, date: date });
    }

    addAndStart(scheduleId, assetId, userId, date, startedByUserId) {
        this.Logger.debug('OccurrenceService.addAndStart');
        return this.CommService.call('/Occurrence/AddAndStart', null, { scheduleId: scheduleId, assetId: assetId, userId: userId, date: date, startedByUserId: startedByUserId });
    }

    addAlertResolution(assetLogId, name, taskCategoryId, formId, assetId, userId, date, asEarlyAsN, asEarlyAsFrequency, description, idleTimeout) {
        this.Logger.debug('OccurrenceService.addAlertResolution');
        return this.CommService.call('/Occurrence/AddAlertResolution', null, { model: {
            AsEarlyAsN: asEarlyAsN,
            AsEarlyAsFrequency: asEarlyAsFrequency,
            AssetLogId: assetLogId,
            Name: name,
            TaskCategoryId: taskCategoryId,
            FormId: formId,
            AssetId: assetId,
            UserId: userId,
            Date: date,
            Description: description,
            IdleTimeout: idleTimeout,
        }});
    }

    addOneTime(name, taskCategoryId, formId, assetIds, userIds, date, asEarlyAsN, asEarlyAsFrequency, description, idleTimeout) {
        this.Logger.debug('OccurrenceService.addOneTime');
        return this.CommService.call('/Occurrence/AddOneTime', null, { model: {
            AsEarlyAsN: asEarlyAsN,
            AsEarlyAsFrequency: asEarlyAsFrequency,
            Name: name,
            TaskCategoryId: taskCategoryId,
            FormId: formId,
            AssetIds: assetIds,
            UserIds: userIds,
            Date: date,
            Description: description,
            IdleTimeout: idleTimeout,
        }});
    }

    complete(occurrenceId, userId, formModel) {
        this.Logger.debug('OccurrenceService.complete');
        return this.CommService.call('/Occurrence/Complete', null, { occurrenceId: occurrenceId, userId: userId, formModel: formModel });
    }

    dismiss(occurrenceId, userId) {
        this.Logger.debug('OccurrenceService.dismiss');
        return this.CommService.call('/Occurrence/Dismiss', null, { occurrenceId: occurrenceId, userId: userId });
    }

    findByDate(scheduleId, date) {
        this.Logger.debug('OccurrenceService.findByDate');
        return this.CommService.call('/Occurrence/FindByDate', null, { scheduleId: scheduleId, date: date });
    }

    listForSchedule(scheduleId) {
        this.Logger.debug('OccurrenceService.listForSchedule');
        return this.CommService.call('/Occurrence/ListForSchedule', null, { scheduleId: scheduleId });
    }

    resume(occurrenceId, userId) {
        this.Logger.debug('OccurrenceService.resume');
        return this.CommService.call('/Occurrence/Resume', null, { occurrenceId: occurrenceId, userId: userId });
    }

    start(occurrenceId, userId) {
        this.Logger.debug('OccurrenceService.start');
        return this.CommService.call('/Occurrence/Start', null, { occurrenceId: occurrenceId, userId: userId });
    }

    stop(occurrenceId, userId, formModel) {
        this.Logger.debug('OccurrenceService.stop');
        return this.CommService.call('/Occurrence/Stop', null, { occurrenceId: occurrenceId, userId: userId, formModel: formModel });
    }
}

OccurrenceServiceExt.$inject = ['AppConfig', 'CommService', 'CrudService', 'Logger'];
