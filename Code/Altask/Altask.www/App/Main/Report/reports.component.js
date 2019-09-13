import { relativeDate } from "../../Utility/utility";

// The controller for the `asset groups` component
class ReportsController {
	constructor(AppConfig, DialogService, ReportService, $scope, $compile) {
		this.AppConfig = AppConfig;
		this.DialogService = DialogService;
		this.ReportService = ReportService;
		this.$scope = $scope;
		this.$compile = $compile;
		this.dirty = false;
		this.init();
	}

	init() {
		this.working = "";
		this.errors = [];
		this.modalErrors = [];
		this.reports = [
			{ name: "ReportComplaints", description: "Complaints", parameters: [] },
			{ name: "ReportNotes", description: "Notes", parameters: [] },
			{ name: "ReportLastNTaskCompletions", description: "Completed Tasks (Last 5)", parameters: [] },
			{ name: "ReportFormChanges", description: "Form Changes", parameters: [] },
		];
		this.selected = this.reports[0].name;
		this.showResults = false;
	}

	isModalValid() {
		return this.modalErrors.length === 0;
	}

	isValid() {
		return this.errors.length === 0;
	}

	markDirty() {
		this.$scope.$evalAsync(() => { this.dirty = true; });
	}

	runReport() {
		this.showResults = false;

		if (this.table) {
			this.table.destroy();
			this.table = null;
			$("#results").html("");
		}

		var report = this.reports.find((elem) => {
			return elem.name === this.selected;
		});

		this.working = "Running Report...";
		this.ReportService.runReport(report.name, report.parameters)
			.then((response) => {
				var columns = [];
				var data = [];

				response.data.columns.forEach((column) => {
					columns.push({
						title: column,
						data: column
					});
				});

				this.table = $("#results").DataTable({
					columns: columns,
					data: response.data.records,
					destroy: true
				});
				this.showResults = true;
			})
			.catch((error) => {
				this.DialogService.error(error);
			})
			.finally(() => {
				this.working = "";
			});
	}
}

ReportsController.$inject = ["AppConfig", "DialogService", "ReportService", "$scope", "$compile"];

export const reports = {
	controller: ReportsController,
	templateUrl: "Views/Report/reports.html",
};
