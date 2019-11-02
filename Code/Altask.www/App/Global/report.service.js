export class ReportService {
	constructor(AppConfig, CommService, Logger) {
		this.AppConfig = AppConfig;
		this.CommService = CommService;
		this.Logger = Logger;
	}

	runReport(reportName, parameters) {
		this.Logger.debug('ReportService.runReport');
		return this.CommService.call('/Report/RunReport', null, { reportName: reportName, parameters: parameters | [] });
	}
}

ReportService.$inject = ['AppConfig', 'CommService', 'Logger'];
