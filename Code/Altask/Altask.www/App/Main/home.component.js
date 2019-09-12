﻿import moment from "moment";
import { getAssetName, getUserName, relativeDate, scheduleSummary } from "../Utility/utility";

// The controller for the `home` component
class HomeController {
    constructor(
        $compile,
        $scope,
        $timeout,
        $q,
        AppConfig,
        AssetAlertService,
        AssetAlertLogService,
        AssetGroupService,
        AssetLogService,
        AssetLogTypeCategoryService,
        AssetLogTypeService,
        AssetService,
        DepartmentService,
        DialogService,
        FormService,
        ManufacturerService,
        OccurrenceService,
        ScheduleService,
        SettingService,
        SignalRService,
        TaskService,
        TaskCategoryService,
        UserService
    ) {
        this.$compile = $compile;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$q = $q;
        this.AppConfig = AppConfig;
        this.AssetAlertService = AssetAlertService;
        this.AssetAlertLogService = AssetAlertLogService;
        this.AssetGroupService = AssetGroupService;
        this.AssetLogService = AssetLogService;
        this.AssetLogTypeCategoryService = AssetLogTypeCategoryService;
        this.AssetLogTypeService = AssetLogTypeService;
        this.AssetService = AssetService;
        this.DepartmentService = DepartmentService;
        this.DialogService = DialogService;
        this.FormService = FormService;
        this.ManufacturerService = ManufacturerService;
        this.OccurrenceService = OccurrenceService;
        this.ScheduleService = ScheduleService;
        this.SettingService = SettingService;
        this.SignalRService = SignalRService;
        this.TaskService = TaskService;
        this.TaskCategoryService = TaskCategoryService;
        this.UserService = UserService;
        this.init();
    }

    addAlert(alert) {
        this.$scope.$evalAsync(() => {
            alert.visible = true;
            alert.className = this.getAlertClass(alert);
            alert.AssetAlert = angular.copy(this.assetAlerts.find((elem) => { return elem.Id === alert.AssetAlertId; }));
            this.alerts.splice(0, 0, alert);
            this.settings.alerts.filters.showResolved = false;
            $("#alerts .well").fadeTo(100, 0.3, function () { $(this).fadeTo(500, 1.0, function () { $(this).fadeTo(100, 0.3, function () { $(this).fadeTo(500, 1.0) }) }); });
        });
    }

    addView(e, tab) {
        e.stopPropagation();
        $(e.currentTarget).parents(".dropdown-menu").toggle();
        let id = 0;

        this.settings.tabs.forEach((tab) => {
            if (tab.id >= id) {
                id = tab.id + 1;
            }
        });

        let userTab = {
            id: id,
            caption: "My Tasks",
            calendar: {
                view: "month",
            },
            filters: {
                model: [],
                showCompleted: true,
                showStarted: true,
                showStopped: true,
            },
            locked: false,
            type: "user",
            multiUser: false,
            showFilter: false,
            showLegend: true,
            filterC: {
                customText: {
                    buttonDefaultText: 'Status',
                },
                data: [{ id: 2, label: "Past Due" }, { id: 3, label: "Due Today" }, { id: 4, label: "Complete" }, { id: 5, label: "In Progress" }],
                events: {
                    onSelectionChanged: () => {
                        this.settings.activeTab().filters.cModel = this.assetTab.filterC.model;
                        this.saveSettings();
                        (this.calendar()).fullCalendar('refetchEvents');
                    }
                },
                model: [],
                settings: {
                    clearSearchOnClose: true,
                    enableSearch: true,
                    searchField: "label",
                    idProperty: "id",
                    smartButtonMaxItems: 5,
                    scrollable: true,
                },
            },
            showLegendToggle: true,
            showMonthView: true,
            showDayView: true,
            showDayListView: true,
            showWeekListView: true,
            showMonthListView: true
        };

        let assetTab = {
            id: this.settings.tabs.length,
            caption: "Asset Tasks",
            calendar: {
                view: "month",
            },
            filters: {
                aModel: [],
                bModel: [],
                showCompleted: true,
                showStarted: true,
                showStopped: true
            },
            locked: false,
            showFilter: true,
            showLegend: true,
            showLegendToggle: true,
            showMonthView: true,
            showDayView: true,
            showDayListView: true,
            showWeekListView: true,
            showMonthListView: true,
            type: "asset",
        };

        this.modalErrors = [];
        let scope = this.$scope.$new();
        this.tabOptions = {
            type: "user",
            name: "",
        }

        let body = this.$compile(`<form class="form-horizontal">
                <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                    <h4 class="alert-heading">Errors</h4>
                    <p>The following errors must be addressed before the new view can be added!</p>
                    <hr>
                    <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
                </div>
                <div class="form-group has-feedback has-error">
                <label class="col-sm-3 control-label">Name:</label>
                <div class="col-sm-9">
                    <input id="new_view_name" ng-model="$ctrl.tabOptions.name" class="form-control" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Type:</label>
                <div class="col-sm-9">
                    <select class="form-control" ng-model="$ctrl.tabOptions.type">
                        <option value="user">User</option>
                        <option value="asset">Asset</option>
                    </select>
                </div>
            </div>
        </form>`)(scope);

        this.modalErrors.push({ control: $("#new_view_name", body)[0], error: "Name is required." });
        this.DialogService.dialog("New View", body, null, () => {
            if (this.modalErrors.length > 0) {
                return false;
            } else {
                let newTab = this.tabOptions.type === "user" ? userTab : assetTab;
                newTab.caption = this.tabOptions.name;
                this.settings.tabs.push(angular.copy(newTab));
                this.saveSettings();
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    alertFromTask(instance) {
        let alert = this.alerts.find((elem) => { return elem.AssetLog.Resolutions.length > 0 && elem.AssetLog.Resolutions[0].OccurrenceId === (instance.OccurrenceId || instance.Id); })

        if (alert) {
            this.$scope.$evalAsync(() => {
                let occurrence = alert.AssetLog.Resolutions[0].Occurrence;
                occurrence.Started = instance.Started;
                occurrence.StartedBy = instance.StartedBy;
                occurrence.StartedOn = instance.StartedOn;
                occurrence.StoppedBy = instance.StoppedBy;
                occurrence.StoppedOn = instance.StoppedOn;
                occurrence.ResumedBy = instance.ResumedBy;
                occurrence.ResumedOn = instance.ResumedOn;
                occurrence.Completed = instance.Completed;
                occurrence.CompletedBy = instance.CompletedBy;
                occurrence.CompletedOn = instance.CompletedOn;
                alert.className = this.getAlertClass(alert);
            });
        }
    }

    canResolveAlert(alert) {
        let log = alert.AssetLog;
        return log.Type.CanResolve && log.Resolutions.length === 0;
    }

    closeActions(e, tabIndex, eventId) {
        $(".tooltip").hide();
        let target = $(e.currentTarget);
        let elem = target.parent();
        let btn = target.parent().parent().children(".evt-toggle-actions").children("span");
        elem.addClass("evt-hide");
        btn.removeClass("evt-toggle-actions-icon-right");
        btn.addClass("evt-toggle-actions-icon-left");
    }

    toggleLegend() {
        this.settings.activeTab().showLegend = !this.settings.activeTab().showLegend;
        this.saveSettings();
        setTimeout(() => $(window).trigger("resize"), 1)
    }

    calendar() {
        let index = this.settings.selectedTab;
        let entry = this.calendars.find((elem) => { return elem.id === index; });
        let calendar = null;

        if (entry) {
            calendar = entry.calendar;
        } else {
            let left = "";
            let tab = this.settings.activeTab();

            if (tab.showLegendToggle) {
                left = left.concat("showLegend ");
            }

            if (tab.showMonthView) {
                left = left.concat("month,");
            }

            if (tab.showDayView) {
                left = left.concat("agendaDay,");
            }

            if (tab.showDayListView) {
                left = left.concat("listDay,");
            }

            if (tab.showWeekListView) {
                left = left.concat("listWeek,");
            }

            if (tab.showMonthListView) {
                left = left.concat("listMonth,");
            }

            calendar = $("#calendar_" + index).fullCalendar({
                buttonText: {
                    month: "Month",
                    agendaDay: "Day",
                    listDay: "Day List",
                    listWeek: "Week List",
                    listMonth: "Month List",
                    today: "Today"
                },
                //customButtons: {
                //    showLegend: {
                //        text: "Toggle Legend",
                //        click: () => {
                //            this.settings.activeTab().showLegend = !this.settings.activeTab().showLegend;
                //            this.saveSettings();
                //            setTimeout(() => $(window).trigger("resize"), 1)
                            
                //        }
                //    }
                //},
                eventOrder: (a, b) => {
                    let aDate = moment(a.miscProps.task.Date);
                    let bDate = moment(b.miscProps.task.Date);

                    if (aDate.isSame(bDate)) {
                        return a.miscProps.task.Name.localeCompare(b.miscProps.task.Name) || a.miscProps.assetName.localeCompare(b.miscProps.assetName);
                    } else {
                        return aDate.isAfter(bDate) ? 1 : -1;
                    }
                },
                header: {
                    left: left,
                    center: 'title',
                    right: 'prev,next'
                },
                defaultView: this.settings.activeTab().calendar.view,
                slotEventOverlap: false,
                hiddenDays: [0, 6],
                themeSystem: "bootstrap3",
                timezone: "local",
                eventRender: (event, elem) => {
                    let actionStart = `<span uib-tooltip="Start Task..." tooltip-append-to-body="true" class="evt-action-btn" ng-click="$ctrl.doTask($event, ` + index + `, '` + event.id + `')">
                    <i class="fa fa-play-circle" aria-hidden="true"></i>
                </span>`;

                    let actionResume = `<span uib-tooltip="Start Task..." tooltip-append-to-body="true" class="evt-action-btn" ng-click="$ctrl.resumeTask($event, ` + index + `, '` + event.id + `')">
                    <i class="fa fa-retweet" aria-hidden="true"></i>
                </span>`;

                    let actionLog = `<span uib-tooltip="Log a note or record an issue against this Asset and Task..." tooltip-append-to-body="true" class="evt-action-btn" ng-click="$ctrl.log($event, ` + index + `, '` + event.id + `')">
                    <i class="fa fa-commenting-o" aria-hidden="true"></i>
                </span>`;

                    let actionDetail = `<span uib-tooltip="View and override Task details..." tooltip-append-to-body="true" class="evt-action-btn" ng-click="$ctrl.viewTask($event, ` + index + `, '` + event.id + `')">
                    <i class="fa fa-list-alt" aria-hidden="true"></i>
                </span>`;

                    let actions = `<div class="evt-actions-popover evt-hide">` +
                        (event.canStart ? actionStart : ``) +
                        (event.canResume ? actionResume : ``) +
                        actionLog +
                        (this.AppConfig.user.roles.find((elem) => { return elem.name === "Administrator"; }) !== undefined ? actionDetail : ``) +
                        `</div>`;

                    let showActions = `<span uib-tooltip="Show/Hide Task Actions..." tooltip-append-to-body="true" tooltip-placement="auto right-top" class="evt-toggle-actions" >
                    <span class="evt-toggle-actions-icon-left"></span>
                </span>` + actions;

                    let html = `<span class="evt-container event" ng-click="$ctrl.toggleActions($event, ` + index + `, '` + event.id + `')">
                    <table class="evt-table">
                        <tr>
                            <td class="evt-data">
                                <table class="evt-table-data">
                                    <tr>
                                        <td>` + event.title + `</td>
                                    </tr>` + (event.assetName ? `<tr>
                                        <td><small>Asset: </small>` + event.assetName + `</td>
                                    </tr>` : ``) + (event.userName ? `<tr>
                                        <td><small>User: </small>` + event.userName + `</td>
                                    </tr>` : ``) +
                        `</table>
                            </td>
                        </tr>
                    </table>` +
                        showActions +
                        `</span>`;

                    elem.empty();
                    elem.append(this.$compile(html)(this.$scope));
                },
                eventAfterRender: (event, elem, view) => {
                    var className = "";

                    if (event.wasRun) {
                        className = "event-complete";
                    } else if (event.inProgress) {
                        className = "event-in-progress";
                    } else if (!event.wasRun) {
                        if (event.inPast) {
                            className = "event-past-due";
                            //} else if (event.within15){
                            //    className = "event-within-15";
                            //} else if (event.within30){
                            //    className = "event-within-30";
                            //} else if (event.withinHour) {
                            //    className = "event-within-hour";
                        } else if (event.today) {
                            className = "event-due-today";
                        }
                    }

                    $(".event", $(elem)).addClass(className);
                    event.task.className = className;
                },
                events: (start, end, timezone, callback) => {
                    this.working = "Loading...";
                    this.hidePage = true;
                    this.loadTasks(start, end)
                        .then((response) => {
                            if (response && response.length > 0) {
                                callback(response);
                            } else {
                                this.working = "";
                                this.hidePage = false;
                            }

                            $(window).trigger("resize")
                        })
                        .catch((error) => {
                            this.working = "";
                            this.hidePage = false;
                            this.DialogService.error(error);
                        });
                },
                eventAfterAllRender: (view) => {
                    this.working = "";
                    this.hidePage = false;
                    if (this.settings.selectedTab != this.AppConfig.settings.home.selectedTab ||
                        this.AppConfig.settings.home.tabs[this.settings.selectedTab].calendar.view != view.name) {
                        this.settings.activeTab().calendar.view = view.name;
                        this.saveSettings();
                    }
                    // Joe - WO1 - hack the toolbar
                    const toolbars = $('.fc-toolbar.fc-header-toolbar')
                    $.each(toolbars, (idx, dom) => {
                        const toolbar = $(dom)
                        const right = $('.fc-right', toolbar)
                        const left = $('.fc-left', toolbar)
                        const center = $('.fc-center', toolbar)
                        $('.fc-clear', toolbar).remove()

                        toolbar.append(left)
                        toolbar.append(center)
                        toolbar.append(right)
                    })

                    // Joe - end toolbar hack
                }
            });

            this.calendars.push({ id: index, calendar: calendar });
        }

        return calendar;
    }

    createUniqueId(task) {
        return task.TaskId + "." + task.ScheduleId + (task.AssetId ? "." + task.AssetId : "") + (task.UserId ? "." + task.UserId : "") + "." + moment(task.Date).format("YYYY.MM.DD.HH.mm")
    }

    completeTask() {
        $('#do_task_modal').modal('hide');
        this.working = "Saving Results...";
        let savedModel = JSON.parse(this.task.FormModel);
        savedModel.dataModel = angular.copy(this.formModel.dataModel);
        this.OccurrenceService.complete(this.task.OccurrenceId, this.AppConfig.user.id, JSON.stringify(savedModel))
            .then((response) => {
                this.DialogService.success("Task Complete!", "Your results have been saved and the task marked complete.")
                this.setTaskProperties(response.data.instance);
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    destroyCalendar() {

    }

    doTask(e, tabIndex, eventId) {
        e.stopPropagation();
        this.closeActions(e, tabIndex, eventId);
        this.working = "Starting Task...";
        this.task = (this.calendar()).fullCalendar('clientEvents', eventId)[0].task;
        this.tabIndex = tabIndex;
        this.formModel = {};

        this.OccurrenceService.addAndStart(this.task.ScheduleId, this.task.AssetId, this.task.UserId, this.task.Date, this.AppConfig.user.id)
            .then((response) => {
                this.setTaskProperties(response.data.instance);

                if (this.task.IdleTimeout && this.task.IdleTimeout > 0) {
                    this.idleTime = 0;

                    $("#do_task_modal").on("mousemove keydown", () => {
                        this.idleTime = 0;
                    });

                    this.idleTimer = this.$timeout(() => {
                        this.idleTime++;

                        if (this.idleTime >= this.task.IdleTimeout) {
                            this.$timeout.cancel(this.idleTimer);
                            $("#do_task_modal").off("mousemove keydown");
                            this.stopTask();
                            this.DialogService.confirm("Task Stopped!", "The task " + this.task.Name + " has automatically been stopped due to user inactivity.  Would you like to resume the task?", (result) => {
                                if (result) {
                                    this.resumeTask(e, tabIndex, eventId);
                                }
                            }, null, "alert-info");
                        }
                    }, 30000);

                    this.$scope.$on('$destroy', () => this.$timeout.cancel(this.idleTimer));
                }

                $('#do_task_modal').modal('show');
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    eventFromTask(event, task) {
        let date = moment(task.Date);
        let endsOn = moment(task.Date);
        var asEarlyAs = task.AsEarlyAsDate ? moment(task.AsEarlyAsDate) : moment(task.Date);
        let canStart = asEarlyAs <= moment() && !task.Started && (!task.User || task.User.Id === this.AppConfig.user.id);
        let canResume = asEarlyAs <= moment() && task.Started && task.StoppedBy && !task.ResumedBy && !task.Completed && (!task.User || task.User.Id === this.AppConfig.user.id);
        let allDay = task.AnyTime;
        event.title = "<span class=\"fc-title-time\">" + (allDay ? "(Any Time)" : date.format("h:mma")) + ": </span><span class=\"fc-title-name\">" + task.Name + "</span>";
        event.start = date;
        event.asEarlyAs = asEarlyAs.format("MM/DD/YYYY HH:mm:ss");
        event.allDay = allDay;
        event.assetName = getAssetName(task.Asset);
        event.userName = getUserName(task.User);
        event.canStart = canStart;
        event.canResume = canResume;
        event.inProgress = task.Started && (!task.StoppedBy || task.ResumedBy) && !task.Completed;
        event.wasRun = task.Completed;
        event.within15 = allDay ? false : moment().isBetween(moment(date).subtract(15, "minutes"), date);
        event.within30 = allDay ? false : moment().isBetween(moment(date).subtract(30, "minutes"), date);
        event.withinHour = allDay ? false : moment().isBetween(moment(date).subtract(1, "hours"), date);
        event.today = date.isSame(moment(), "day");
        event.inPast = date.isBefore(moment());
        event.inFuture = date.isAfter(moment(), "day");
        event.task = task;
        return event;
    }

    filterAlerts() {
        this.$scope.$evalAsync(() => {
            this.alerts.forEach((elem) => { elem.visible = this.showAlert(elem); });
        });
    }

    filterLogType() {
        return (logType) => {
            return logType.AssetLogTypeCategoryId === this.newLog.AssetLogTypeCategoryId &&
                (logType.Assets.length > 0 ? logType.Assets.find((elem) => { return elem.AssetId === this.newLog.AssetId; }) !== undefined : true);
        };
    }

    filterTasks(tasks) {
        let deferred = this.$q.defer();
        this.working = "Rendering Tasks...";
        this.events = [];

        angular.forEach(tasks, (task) => {
            if (this.showEvent(task)) {
                this.events.push(this.eventFromTask({ id: this.createUniqueId(task) }, task));
            }
        });

        deferred.resolve(this.events);
        return deferred.promise;
    }


    init() {
        this.working = "Loading...";
        this.hidePage = true;
        this.calendars = [];
        this.errors = [];
        this.modalErrors = [];
        this.hidePage = true;
        this.settings = angular.copy(this.AppConfig.settings.home);
        this.settings.activeTab = () => {
            return this.settings.tabs[this.settings.selectedTab];
        };

        this.formOptions = {
            formState: {
                horizontalLabelClass: 'col-sm-2',
                horizontalFieldClass: 'col-sm-10',
                readOnly: true
            }
        };

        this.assetTab = {
            filterA: {
                customText: {
                    buttonDefaultText: 'Departments and Groups',
                },
                data: [],
                events: {
                    onSelectionChanged: () => {
                        this.populateAssetFilter();
                        this.settings.activeTab().filters.aModel = this.assetTab.filterA.model;
                        this.settings.activeTab().filters.bModel = this.assetTab.filterB.model;
                        this.saveSettings();

                        if (this.assetTab.filterB.data.length > 0) {
                            (this.calendar()).fullCalendar('refetchEvents');
                        } else {
                            this.DialogService.info("Information", "No assets match the specified filter criteria.  Please specify different filter criteria.");
                        }
                    }
                },
                model: [],
                settings: {
                    clearSearchOnClose: true,
                    enableSearch: true,
                    searchField: "label",
                    groupByTextProvider: (groupId) => {
                        switch (groupId) {
                            case 0: return "Departments";
                            case 1: return "Groups";
                            default: return "Not Specified";
                        }
                    },
                    groupBy: "groupId",
                    idProperty: "id",
                    smartButtonMaxItems: 5,
                    scrollable: true,
                },
            },
            filterB: {
                customText: {
                    buttonDefaultText: 'Assets',
                },
                data: [],
                events: {
                    onSelectionChanged: () => {
                        this.settings.activeTab().filters.bModel = this.assetTab.filterB.model;
                        this.saveSettings();
                        (this.calendar()).fullCalendar('refetchEvents');
                    }
                },
                model: [],
                settings: {
                    clearSearchOnClose: true,
                    enableSearch: true,
                    searchField: "label",
                    idProperty: "id",
                    smartButtonMaxItems: 5,
                    scrollable: true,
                },
            },
            showLegendToggle: true,
            showMonthView: true,
            showDayView: true,
            showDayListView: true,
            showWeekListView: true,
            showMonthListView: true
        };

        this.userTab = {
            filter: {
                customText: {
                    buttonDefaultText: 'Users',
                },
                data: [],
                events: {
                    onSelectionChanged: () => {
                        this.settings.activeTab().filters.model = this.userTab.filters.model;
                        this.saveSettings();
                        (this.calendar()).fullCalendar('refetchEvents');
                    }
                },
                model: [],
                settings: {
                    clearSearchOnClose: true,
                    enableSearch: true,
                    searchField: "label",
                    idProperty: "id",
                    smartButtonMaxItems: 5,
                    scrollable: true,
                },
            },
            showLegendToggle: true,
            showMonthView: true,
            showDayView: true,
            showDayListView: true,
            showWeekListView: true,
            showMonthListView: true
        }

        this.$scope.$on('ui.layout.toggle', (e, container) => {
            if (container.id === "alerts") {
                this.saveSettings();
            }
        });

        $(document).ready(() => {
            $("span.dropdown-toggle").on("click", (e) => {
                e.stopPropagation();
                let $elem = $(e.currentTarget);
                let $dropdown = $elem.next();
                $dropdown.toggle();
            });

            $('#do_task_modal').modal({
                show: false,
                backdrop: false,
                keyboard: false
            })

            $('#do_task_modal').on('hidden.bs.modal', () => {
                if (this.idleTimer) {
                    this.$timeout.cancel(this.idleTimer);
                }
            });

            $('#view_task_modal').modal({
                show: false,
                backdrop: "static",
                keyboard: true
            })

            $('#view_task_modal').on('show.bs.modal', () => {
                //$('#view_task_modal').find('*').attr("disabled", true);
            });

            $('#task_form').on("submit", () => { this.completeTask() });

            $(window).on("beforeunload", (e) => {
                if (this.task && this.task.Started && !this.task.Completed) {
                    let stoppedOn = this.task.StoppedOn ? moment(this.task.StoppedOn) : null;
                    let resumedOn = this.task.ResumedOn ? moment(this.task.ResumedOn) : null;

                    if (!stoppedOn || (resumedOn && resumedOn > stoppedOn)) {
                        this.stopTask();
                    }
                }
            });

            $(window).on("resize", () => {
                const $calTabs = $("#cal_tabs")
                const containerHeight = $calTabs.height()
                const tabsHeight = $(".nav.nav-tabs", $calTabs).outerHeight(true)
                const $activeTab = $(".tab-pane.active")
                var offset = 0;
                const calendar = this.calendar()
                const children = $activeTab.children()

                for (var i = 0; i < children.length; i++) {
                    if (children[i] !== calendar.get(0)) {
                        offset += $(children[i]).outerHeight(true)
                    }
                }
                //if (tab.showFilter && tab.showLegend) {
                //    offset = 150;
                //} else if (tab.showFilter && !tab.showLegend || !tab.showFilter && tab.showLegend) {
                //    offset = 96;
                //} else {
                //    offset = 46;
                //}

                //calendar.fullCalendar('option', 'height', containerHeight - tabsHeight - offset);
                //$('.alert-list').height($('.alert-list').parent().height() - 85);
            });

            $(document).on("mouseleave", ".evt-container, .alert-container", function () {
                let container = $(this);
                let actions = $('.evt-actions-popover', container);
                let btn = $(".evt-toggle-actions", container).children("span");
                actions.addClass("evt-hide");
                btn.removeClass("evt-toggle-actions-icon-right");
                btn.addClass("evt-toggle-actions-icon-left");
            });

            $(document).on("mouseleave", ".uib-tab.nav-item, .uib-tab.nav-item .dropdown-menu", function () {
                $(".dropdown-menu", this).hide();
            });
        });

        this.working = "Loading Settings...";
        this.SettingService.list()
            .then((response) => {
                this.systemSettings = response.data.settings;

                this.defaults = {
                    resolution: {
                        name: this.systemSettings.find((elem) => { return elem.Area === "AlertResolution" && elem.Classification === "Default" && elem.Name === "Name"; }).Value,
                        taskCategory: this.systemSettings.find((elem) => { return elem.Area === "AlertResolution" && elem.Classification === "Default" && elem.Name === "TaskCategory"; }).Value,
                        form: this.systemSettings.find((elem) => { return elem.Area === "AlertResolution" && elem.Classification === "Default" && elem.Name === "Form"; }).Value,
                        idleTimeout: this.systemSettings.find((elem) => { return elem.Area === "AlertResolution" && elem.Classification === "Default" && elem.Name === "IdleTimeout"; }).Value,
                        description: this.systemSettings.find((elem) => { return elem.Area === "AlertResolution" && elem.Classification === "Default" && elem.Name === "Description"; }).Value,
                        asEarlyAsN: this.systemSettings.find((elem) => { return elem.Area === "AlertResolution" && elem.Classification === "Default" && elem.Name === "AsEarlyAsN"; }).Value,
                        asEarlyAsFrequency: this.systemSettings.find((elem) => { return elem.Area === "AlertResolution" && elem.Classification === "Default" && elem.Name === "AsEarlyAsFrequency"; }).Value,
                    }
                };

                this.working = "Loading Departments...";
                return this.DepartmentService.list({ Active: true })
            })
            .then((response) => {
                this.departments = response.data.departments;
                this.departments.sort((a, b) => { return a.Name.localeCompare(b.Name); });
                this.departments.splice(0, 0, { Name: "All", Id: "" });
                this.working = "Loading Manufacturers...";
                return this.ManufacturerService.list({ Active: true });
            })
            .then((response) => {
                this.manufacturers = response.data.manufacturers;
                this.manufacturers.sort((a, b) => { return a.Name.localeCompare(b.Name); });
                this.working = "Loading Assets...";
                return this.AssetService.list({ Active: true });
            })
            .then((response) => {
                this.assets = response.data.assets;
                this.assetAlerts = [];
                this.assets.forEach((asset) => {
                    asset.DisplayName = getAssetName(asset);
                    asset.Alerts.forEach((alert) => {
                        this.assetAlerts.push(angular.copy(alert));
                    });
                });

                this.assets.sort((a, b) => { return a.Name.localeCompare(b.Name) || a.CustomId.localeCompare(b.CustomId); });
                this.working = "Loading Users...";
                return this.UserService.list({ Active: true });
            })
            .then((response) => {
                this.users = response.data.users;
                this.users.sort((a, b) => { return (a.FullName || a.UserName).localeCompare(b.FullName || b.UserName); });
                this.working = "Loading Asset Groups...";
                return this.AssetGroupService.list({ Active: true });
            })
            .then((response) => {
                this.assetGroups = response.data.assetGroups;
                this.assetGroups.sort((a, b) => { return a.Name.localeCompare(b.Name); });
                this.working = "Loading Assets Log Type Categories...";
                return this.AssetLogTypeCategoryService.list({ Active: true });
            })
            .then((response) => {
                this.logCategories = response.data.assetLogTypeCategories;
                this.logCategories.sort((a, b) => { return a.Name.localeCompare(b.Name); });
                this.working = "Loading Assets Log Types...";
                return this.AssetLogTypeService.list({ Active: true });
            })
            .then((response) => {
                this.logTypes = response.data.assetLogTypes;
                this.logTypes.sort((a, b) => { return a.Name.localeCompare(b.Name); });
                this.working = "Loading Task Categories...";
                return this.TaskCategoryService.list({ Active: true });
            })
            .then((response) => {
                this.taskCategories = response.data.taskCategories;
                this.taskCategories.sort((a, b) => { return a.Name.localeCompare(b.Name); });
                this.working = "Loading Forms...";
                return this.FormService.list({ Active: true });
            })
            .then((response) => {
                this.forms = response.data.forms;
                this.forms.sort((a, b) => { return a.Name.localeCompare(b.Name); });
                this.working = "Loading Alerts...";
                return this.AssetAlertLogService.list({ Type: "System", UserIds: [this.AppConfig.user.id] });
            })
            .then((response) => {
                this.alerts = response.data.assetAlertLogs;
                this.alerts.forEach((elem) => { elem.className = this.getAlertClass(elem); });
                this.filterAlerts();
                this.from = moment().startOf("month");
                this.to = moment().endOf("month");
                this.initialized = true;
                this.selectTab(null, this.settings.selectedTab, true);
            })
            .then((response) => {
                return this.SignalRService.subscribe("Occurrence", (data) => {
                    var occurrence = data.instance || data.occurrence;

                    if (this.showEvent(occurrence)) {
                        this.updateTask(occurrence);
                    }
                    else {
                        this.removeTask(occurrence);
                    }

                    this.alertFromTask(occurrence);
                }, (data) => {
                    var occurrence = data.instance || data.occurrence;

                    if (this.showEvent(occurrence)) {
                        this.updateTask(occurrence);
                    }
                    else {
                        this.removeTask(occurrence);
                    }

                    this.alertFromTask(occurrence);
                });
            })
            .then((response) => {
                return this.SignalRService.subscribe("AssetAlertLog", (data) => {
                    if (this.showAlert(data.assetAlertLog)) {
                        this.addAlert(data.assetAlertLog);
                    }
                    else {
                        this.removeAlert(data.assetAlertLog);
                    }
                }, (data) => {
                    if (this.showAlert(data.assetAlertLog)) {
                        this.updateAlert(data.assetAlertLog);
                    }
                    else {
                        this.removeAlert(data.assetAlertLog);
                    }
                });
            })
            .then((response) => {
                return this.SignalRService.subscribe("AssetLogResolution", (data) => {
                    let alert = this.alerts.find((elem) => { return elem.AssetLog.Id === data.assetLogResolution.AssetLogId; });

                    if (alert) {
                        alert.AssetLog.Resolutions.push(data.assetLogResolution);
                    }
                });
            })
            .catch((error) => {
                this.working = "";
                this.hidePage = false;
                this.DialogService.error(error);
            });
    }

    isResolutionValid() {
        let errorIndex = this.modalErrors.findIndex((elem) => { return elem.error == "Please specify a category."; });

        if (!this.alertResolution.taskCategoryId) {
            if (errorIndex == -1) {
                this.modalErrors.push({ control: null, error: "Please specify a category." });
            }
        } else {
            if (errorIndex > -1) {
                this.modalErrors.splice(errorIndex, 1);
            }
        }

        errorIndex = this.modalErrors.findIndex((elem) => { return elem.error == "Please specify a form."; });

        if (!this.alertResolution.formId) {
            if (errorIndex == -1) {
                this.modalErrors.push({ control: null, error: "Please specify a form." });
            }
        } else {
            if (errorIndex > -1) {
                this.modalErrors.splice(errorIndex, 1);
            }
        }

        errorIndex = this.modalErrors.findIndex((elem) => { return elem.error == "Please specify a user."; });

        if (!this.alertResolution.userId) {
            if (errorIndex == -1) {
                this.modalErrors.push({ control: null, error: "Please specify a user." });
            }
        } else {
            if (errorIndex > -1) {
                this.modalErrors.splice(errorIndex, 1);
            }
        }
    }

    getAlertClass(alert) {
        let log = alert.AssetLog;
        let className = "alert-no-action";

        if (log.Type.CanResolve) {
            if (log.Resolutions.length === 0) {
                className = "alert-pending";
            } else {
                let occurrence = log.Resolutions[0].Occurrence;

                if (!occurrence.Started) {
                    className = "alert-assigned";
                } else if ((!occurrence.StoppedBy || occurrence.ResumedBy) && !occurrence.Completed) {
                    className = "alert-in-progress";
                } else if (!occurrence.Completed) {
                    className = "alert-not-complete";
                } else if (occurrence.Completed) {
                    className = "alert-completed";
                }
            }
        }

        return className;
    }

    loadTasks(from, to) {
        let deferred = this.$q.defer();
        this.working = "Loading Tasks...";
        let userIds = "";
        let assetIds = "";

        if (this.settings.activeTab().type === "user") {
            if (this.settings.activeTab().multiUser) {
                if (this.userTab.filter.model.length === 0) {
                    this.userTab.filter.data.forEach((elem) => { userIds = userIds.concat(elem.id).concat(","); });
                } else {
                    this.userTab.filter.model.forEach((elem) => { userIds = userIds.concat(elem.id).concat(","); });
                }
            } else {
                userIds = this.AppConfig.user.id.toString().concat(",");
            }
        } else {
            if (this.assetTab.filterB.model.length === 0) {
                this.assetTab.filterB.data.forEach((elem) => { assetIds = assetIds.concat(elem.id).concat(","); });
            } else {
                this.assetTab.filterB.model.forEach((elem) => { assetIds = assetIds.concat(elem.id).concat(","); });
            }
        }

        if (userIds || assetIds) {
            this.ScheduleService.projectTo(from, to, userIds.slice(0, -1), assetIds.slice(0, -1))
                .then((response) => {
                    return this.filterTasks(response.data.tasks);
                })
                .then((response) => {
                    deferred.resolve(response);
                })
                .catch((error) => {
                    deferred.reject(error);
                })
        } else {
            this.working = "";
            deferred.resolve([]);
        }

        return deferred.promise;
    }

    log(e, tabIndex, eventId) {
        e.stopPropagation();
        this.closeActions(e, tabIndex, eventId);
        this.task = (this.calendar()).fullCalendar('clientEvents', eventId)[0].task;
        this.modalErrors = [];
        let categoryId = this.logCategories.find((elem) => { return elem.Name === "Note"; }).Id;
        let logType = this.logTypes.find((elem) => { return elem.AssetLogTypeCategoryId === categoryId; });
        this.newLog = {
            AssetId: this.task.AssetId,
            AssetLogTypeId: logType.Id,
            AssetLogTypeCategoryId: categoryId,
            Comment: "",
            Description: "",
        };

        let func = () => {
            let scope = this.$scope.$new();

            let body = this.$compile(`<form class="form-horizontal">
                <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                    <h4 class="alert-heading">Errors</h4>
                    <p>The following errors must be addressed before the asset log can be created!</p>
                    <hr>
                    <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-3">Log Category:</label>
                    <div class="col-sm-9">
                        <select class="form-control" ng-change="$ctrl.selectLogCategory()" ng-model="$ctrl.newLog.AssetLogTypeCategoryId" ng-options="x.Id as x.Name for x in $ctrl.logCategories"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-3">Log Type:</label>
                    <div class="col-sm-9">
                        <select class="form-control" ng-model="$ctrl.newLog.AssetLogTypeId" ng-options="x.Id as x.Name for x in $ctrl.logTypes | filter:$ctrl.filterLogType()"></select>
                    </div>
                </div>` + (logType.CanComment ? `
                <div class="form-group">
                    <label class="control-label col-sm-3">Comments:</label>
                    <div class="col-sm-9">
                        <textarea class="form-control" ng-model="$ctrl.newLog.Comment"></textarea>
                    </div>
                </div>` : ``) +
                `</form>`)(scope);

            this.DialogService.dialog("Log Asset Information", body, null, () => {
                if (this.modalErrors.length > 0) {
                    return false;
                } else {
                    this.working = "Saving Asset Log...";
                    this.AssetLogService.create(this.newLog)
                        .then((response) => {
                            this.DialogService.success("Log Asset Info", "Your log has been successfully submitted.");
                        })
                        .catch((error) => { this.DialogService.error(error); })
                        .finally(() => { this.working = ""; scope.$destroy(); });
                }

                return true;
            }, () => { this.modalErrors = []; scope.$destroy(); });
        };

        if (!this.task.OccurrenceId) {
            this.OccurrenceService.add(this.task.ScheduleId, this.task.AssetId, this.task.UserId, this.task.Date, this.AppConfig.user.id)
                .then((response) => {
                    this.setTaskProperties(response.data.instance);
                    this.newLog.OccurrenceId = response.data.instance.OccurrenceId;
                    func();
                })
                .catch((error) => {
                    this.DialogService.error(error);
                })
                .finally(() => this.working = "");
        } else {
            this.newLog.OccurrenceId = this.task.OccurrenceId;
            func();
        }
    }

    moveTab(e, tab, direction) {
        e.stopPropagation();
        $(e.currentTarget).parents(".dropdown-menu").toggle();

        let index = this.settings.tabs.findIndex((elem) => { return elem.id === tab.id; });

        if (direction === 'left' && index > 0) {
            this.settings.tabs.splice(index - 1, 0, this.settings.tabs.splice(index, 1)[0]);
        }

        if (direction === 'right' && index < this.settings.tabs.length - 1) {
            this.settings.tabs.splice(index + 1, 0, this.settings.tabs.splice(index, 1)[0]);
        }

        this.saveSettings();
    }

    populateAssetFilter() {
        let data = angular.copy(this.assets);
        let departments = [];
        let groups = [];

        this.assetTab.filterA.model.forEach((selection) => {
            switch (selection.groupId) {
                case 0:
                    departments.push(selection.id);
                    break;

                case 1:
                    groups.push(selection.id);
                    break;
            }
        });

        for (let index = data.length - 1; index >= 0; index--) {
            let asset = data[index];

            if (departments.length > 0 && departments.find((id) => { return id === asset.DepartmentId; }) === undefined) {
                data.splice(index, 1);
            } else {
                let missingGroup = false;

                groups.forEach((id) => {
                    if (asset.Groups.find((group) => { return id === group.AssetGroupId; }) === undefined) {
                        missingGroup = true;
                    }
                });

                if (missingGroup) {
                    data.splice(index, 1);
                }
            }
        }

        this.assetTab.filterB.model = [];
        this.assetTab.filterB.data = [];
        data.sort((a, b) => { return a.Name.localeCompare(b.Name) || a.CustomId.localeCompare(b.CustomId); });
        data.forEach((elem) => { this.assetTab.filterB.data.push({ id: elem.Id, label: elem.DisplayName }); });
        return this.assetTab.filterB.data.length > 0;
    }

    removeAlert(alert) {
        let index = this.alerts.findIndex((elem) => { return elem.Id === alert.Id; });

        if (index > -1) {
            this.alerts[index].visible = false;
        }
    }

    removeTask(task) {
        let event = (this.calendar()).fullCalendar('clientEvents', eventId)[0];

        if (event) {
            this.$scope.$evalAsync(() => {
                this.task = event.task;

                if (!this.task.Name && this.task.Task) {
                    this.task.Name = this.task.Task.Name;
                }

                this.task.id = this.createUniqueId(this.task);
                this.formModel = angular.copy(JSON.parse(this.task.FormModel));
                (this.calendar()).fullCalendar('removeEvents', this.task.id);
            });
        }
    }

    removeTab(e, tab) {
        e.stopPropagation();
        $(e.currentTarget).parents(".dropdown-menu").toggle();

        if (this.settings.tabs.length === 1) {
            this.DialogService.info("Remove Tab", "You must have at least one view visible.");
        } else {
            this.DialogService.confirm("Remove Tab", "Are you sure you want to remove this view; this cannot be undone?", (result) => {
                if (result) {
                    let index = this.settings.tabs.findIndex((elem) => { return elem.id === tab.id; });
                    this.selectTab(e, index === 0 ? 1 : index - 1);
                    this.settings.tabs.splice(this.settings.tabs.findIndex((elem) => { return elem.id === tab.id; }), 1);
                    this.saveSettings();
                }
            });
        }
    }

    renameTab(e, tab) {
        e.stopPropagation();
        $(e.currentTarget).parents(".dropdown-menu").toggle();

        this.modalErrors = [];
        let scope = this.$scope.$new();
        this.tabOptions = {
            name: tab.caption,
        };

        let body = this.$compile(`<form class="form-horizontal">
                <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                    <h4 class="alert-heading">Errors</h4>
                    <p>The following errors must be addressed before the new view can be added!</p>
                    <hr>
                    <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
                </div>
                <div class="form-group has-feedback has-error">
                <label class="col-sm-3 control-label">Name:</label>
                <div class="col-sm-9">
                    <input id="new_view_name" ng-model="$ctrl.tabOptions.name" class="form-control" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
        </form>`)(scope);

        this.DialogService.dialog("Rename Tab", body, null, () => {
            if (this.modalErrors.length > 0) {
                return false;
            }

            tab.caption = this.tabOptions.name;
            this.saveSettings();
            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    resolveAlert(alert) {
        this.modalErrors = [];
        let taskCategoryId = this.taskCategories[0].Id.toString();

        if (this.defaults.resolution.taskCategory) {
            let index = this.taskCategories.findIndex((elem) => { return elem.Name === this.defaults.resolution.taskCategory; });

            if (index > -1) {
                taskCategoryId = this.taskCategories[index].Id.toString();
            }
        }

        let formId = this.forms[0].Id.toString();

        if (this.defaults.resolution.form) {
            let index = this.forms.findIndex((elem) => { return elem.Name === this.defaults.resolution.form; });

            if (index > -1) {
                formId = this.forms[index].Id.toString();
            }
        }

        this.alertResolution = {
            name: this.defaults.resolution.name || "",
            description: this.defaults.resolution.description || "",
            idleTimeout: parseInt(this.defaults.resolution.idleTimeout || "5"),
            date: new Date(),
            asEarlyAsN: parseInt(this.defaults.resolution.asEarlyAsN || "1"),
            asEarlyAsFrequency: this.defaults.resolution.asEarlyAsFrequency || "Hour(s)",
            taskCategoryId: taskCategoryId,
            formId: formId,
            userId: ""
        }

        let scope = this.$scope.$new();

        let body = this.$compile(`<form class="form-horizontal">
            <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the alert resolution task can be created!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group has-feedback` + (!this.alertResolution.name ? ` has-error` : ``) + `">
                <label class="col-sm-3 control-label">Name:</label>
                <div class="col-sm-9">
                    <input id="new_alert_resolution_name" ng-model="$ctrl.alertResolution.name" class="form-control" req-data="Name" rd-errors="$ctrl.modalErrors" />
                    <span class="form-control-feedback glyphicon glyphicon-remove"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label" style="margin-top: 7px;">Date:</label>
                <div class="col-sm-4">
                    <datepicker model="$ctrl.alertResolution.date" format="MM/dd/yyyy" style="margin-top: 7px;"></datepicker>
                </div>
                <div class="col-sm-4">
                    <div uib-timepicker ng-model="$ctrl.alertResolution.date" hour-step="1" minute-step="1" show-meridian="true" style="margin-top: -15px;"></div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">As Early as:</label>
                <div class="col-sm-4">
                     <input type="number" class="form-control" width="100" min="1" max="12" ng-model="$ctrl.alertResolution.asEarlyAsN" />
                </div>
                <div class="col-sm-4" style="padding-left: 0px; padding-right: 30px;">
                    <select id="frequency" ng-model="$ctrl.alertResolution.asEarlyAsFrequency" class="form-control">
                        <option value="">Not Specified</option>
                        <option value="Minute(s)">Minute(s)</option>
                        <option value="Hour(s)">Hour(s)</option>
                        <option value="Day(s)">Day(s)</option>
                        <option value="Week(s)">Week(s)</option>
                        <option value="Month(s)">Month(s)</option>
                    </select>
                </div>
                <div class="col-sm-1" style="padding-top: 6px; padding-left: 0px; margin-left: -16px;">
                    Before
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Task Category:</label>
                 <div class="col-sm-9">
                    <select class="form-control" ng-change="$ctrl.isResolutionValid()" ng-model="$ctrl.alertResolution.taskCategoryId">
                        <option ng-repeat="x in ::$ctrl.taskCategories" value="{{x.Id}}">{{x.Name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Form:</label>
                 <div class="col-sm-9">
                    <select class="form-control" ng-change="$ctrl.isResolutionValid()" ng-model="$ctrl.alertResolution.formId" >
                        <option ng-repeat="x in ::$ctrl.forms" value="{{x.Id}}">{{x.Name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Assigned To:</label>
                 <div class="col-sm-9">
                    <select class="form-control" ng-change="$ctrl.isResolutionValid()" ng-model="$ctrl.alertResolution.userId">
                        <option selected disabled value="">Choose a User...</option>
                        <option ng-repeat="x in ::$ctrl.users" value="{{x.Id}}">{{x.FullName || x.UserName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">Idle Timeout:</label>
                <div class="col-sm-4">
                     <input type="number" class="form-control" width="100" min="1" max="60" ng-model="$ctrl.alertResolution.idleTimeout" />
                </div>
                <div class="col-sm-1" style="padding-top: 6px; padding-left: 8px; margin-left: -16px;">
                    minute(s)
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <div class="col-sm-9">
                    <textarea ng-model="$ctrl.alertResolution.description" class="form-control"></textarea>
                </div>
            </div>
        </form>`)(scope);

        if (!this.alertResolution.name) {
            this.modalErrors.push({ control: $("#new_alert_resolution_name", body)[0], error: "Name is required." });
        }

        this.DialogService.dialog("Create Alert Resolution Task", body, null, () => {
            if (this.modalErrors.length > 0) {
                return false;
            } else {
                this.working = "Saving Task...";
                this.OccurrenceService.addAlertResolution(alert.AssetLog.Id, this.alertResolution.name, this.alertResolution.taskCategoryId, this.alertResolution.formId, alert.AssetLog.AssetId, this.alertResolution.userId, this.alertResolution.date, this.alertResolution.asEarlyAsN, this.alertResolution.asEarlyAsFrequency, this.alertResolution.description, this.alertResolution.idleTimeout)
                    .then((response) => {
                        this.DialogService.success("Create Alert Resolution Task", "Your alert resolution task has been successfully created.");
                        this.$scope.$evalAsync(() => {
                            alert.AssetLog.Resolutions.push(angular.copy(response.data.assetLogResolution));
                            alert.className = this.getAlertClass(alert);
                            this.alerts[this.alerts.findIndex((elem) => { return elem.Id === alert.Id; })] = alert;
                        });


                    })
                    .catch((error) => { this.DialogService.error(error); })
                    .finally(() => { this.working = ""; scope.$destroy(); });
            }

            return true;
        }, () => { this.modalErrors = []; scope.$destroy(); });
    }

    resumeTask(e, tabIndex, eventId) {
        e.stopPropagation();
        this.closeActions(e, tabIndex, eventId);
        this.working = "Resuming Task...";
        this.task = (this.calendar()).fullCalendar('clientEvents', eventId)[0].task;
        this.tabIndex = tabIndex;
        this.formModel = {};

        this.OccurrenceService.resume(this.task.OccurrenceId, this.AppConfig.user.id)
            .then((response) => {
                this.setTaskProperties(response.data.instance);


                if (this.task.IdleTimeout && this.task.IdleTimeout > 0) {
                    this.idleTime = 0;

                    $('#do_task_modal').on("mousemove keydown", () => {
                        this.idleTime = 0;
                    });

                    this.idleTimer = this.$timeout(() => {
                        this.idleTime++;

                        if (this.idleTime >= this.task.IdleTimeout) {
                            this.$timeout.cancel(this.idleTimer);
                            $('#do_task_modal').off("mousemove keydown");
                            this.stopTask();
                            this.DialogService.confirm("Task Stopped!", "The task " + this.task.Name + " has automatically been stopped due to user inactivity.  Would you like to resume the task?", (result) => {
                                if (result) {
                                    this.resumeTask(e, tabIndex, eventId);
                                }
                            }, null, "alert-info");
                        }
                    }, 30000);

                    this.$scope.$on('$destroy', () => this.$timeout.cancel(this.idleTimer));
                }

                $('#do_task_modal').modal('show');
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    saveSettings() {
        let timer = this.$timeout(() => {
            this.AppConfig.settings.home = angular.copy(this.settings);
            this.AppConfig.save();
            this.UserService.updateSettings(this.AppConfig.user.id, JSON.stringify(this.AppConfig.settings));
        }, 20);

        this.$scope.$on('$destroy', () => this.$timeout.cancel(timer));
    }

    selectLogCategory() {
        this.newLog.AssetLogTypeId = this.logTypes.length > 0 ? this.logTypes.find((elem) => {
            return elem.AssetLogTypeCategoryId === this.newLog.AssetLogTypeCategoryId &&
                (elem.Assets.length > 0 ? elem.Assets.find((asset) => { return asset.AssetId === this.newLog.AssetId; }) !== undefined : true);
        }).Id : "";
    }

    selectTab(e, index, force) {
        if (this.initialized && (!e || $(e.currentTarget).offsetParent().index() !== this.settings.selectedTab || force)) {
            // Uib-TabSet does not update it's selectedTab index until after this event.
            // We cannot rely on the activeTab property in this case.
            this.settings.selectedTab = index;
            let tab = this.settings.tabs[index];

            if (tab.type === "asset") {
                this.assetTab.filterA.data = [];
                this.assetTab.filterB.data = [];
                this.departments.forEach((elem) => { this.assetTab.filterA.data.push({ id: elem.Id, label: elem.Name, groupId: 0 }); });
                this.assetGroups.forEach((elem) => { this.assetTab.filterA.data.push({ id: elem.Id, label: elem.Name, groupId: 1 }); });
                this.assetTab.filterA.model = tab.filters.aModel;
                this.populateAssetFilter();
                this.assetTab.filterB.model = tab.filters.bModel;
                this.assetTab.showLegendToggle = tab.showLegendToggle;
                this.assetTab.showMonthView = tab.showMonthView;
                this.assetTab.showDayView = tab.showDayView;
                this.assetTab.showDayListView = tab.showDayListView;
                this.assetTab.showWeekListView = tab.showWeekListView;
                this.assetTab.showMonthListView = tab.showMonthListView;
            } else {
                this.userTab.filter.data = [];

                if (tab.multiUser) {
                    this.users.forEach((elem) => { this.userTab.filter.data.push({ id: elem.Id, label: getUserName(elem) }); });
                    this.userTab.filter.model = tab.filters.model;
                } else {
                    this.userTab.filter.data.push({ id: this.AppConfig.user.id, label: getUserName(this.AppConfig.user) });
                    this.userTab.filter.model.push({ id: this.AppConfig.user.id, label: getUserName(this.AppConfig.user) });
                }

                this.userTab.showLegendToggle = tab.showLegendToggle;
                this.userTab.showMonthView = tab.showMonthView;
                this.userTab.showDayView = tab.showDayView;
                this.userTab.showDayListView = tab.showDayListView;
                this.userTab.showWeekListView = tab.showWeekListView;
                this.userTab.showMonthListView = tab.showMonthListView;
            }

            this.calendar();
            $(window).trigger("resize")
        }
    }

    setAlertFilters() {
        this.saveSettings();
        this.filterAlerts();
    }

    setFilters() {
        this.saveSettings();
        (this.calendar()).fullCalendar('refetchEvents');
    }

    setTaskProperties(task) {
        this.$scope.$evalAsync(() => {
            this.task = task;
            this.formModel = angular.copy(JSON.parse(this.task.FormModel));

            // We could be receiving an Occurrence object or an TaskInstance object.
            // If we receive the later we need to mimic the fields of our TaskInstance
            // object.
            if (this.task) {
                this.task.Name = this.task.Name;
                this.task.IdleTimeout = this.task.IdleTimeout;
            }

            if (!this.task.OccurrenceId) {
                this.task.OccurrenceId = this.task.Id;
            }

            this.task.id = this.createUniqueId(this.task);


            this.settings.tabs.forEach((tab) => {
                let userIds = [];
                let assetIds = [];
                let show = true;

                if (tab.type === "user") {
                    if (tab.multiUser) {
                        if (this.userTab.filter.model.length === 0) {
                            this.userTab.filter.data.forEach((elem) => { userIds.push(elem.id); });
                        } else {
                            this.userTab.filter.model.forEach((elem) => { userIds.push(elem.id); });
                        }
                    } else {
                        userIds.push(this.AppConfig.user.id);
                    }

                    if (userIds.find((id) => id === this.task.UserId) === undefined) {
                        show = false;
                    }
                } else {
                    if (this.assetTab.filterB.model.length === 0) {
                        this.assetTab.filterB.data.forEach((elem) => { assetIds.push(elem.id); });
                    } else {
                        this.assetTab.filterB.model.forEach((elem) => { assetIds.push(elem.id); });
                    }

                    if (assetIds.find((id) => id === this.task.AssetId) === undefined) {
                        show = false;
                    }

                    if (this.assetTab.filterC.model.length > 0) {
                        if (!this.statusMatches(this.assetTab.filterC.model[0].id, this.task)) {
                            show = false;
                        }
                    }
                }

                if (show && this.showEvent(this.task, tab)) {
                    let tabIndex = this.settings.tabs.findIndex((elem) => { return elem === tab; });
                    let entry = this.calendars.find((elem) => { return elem.id === tabIndex; });
                    let calendar = entry ? entry.calendar : null;

                    if (calendar) {
                        let clientEvent = (calendar).fullCalendar('clientEvents', this.task.id)[0];

                        if (!clientEvent) {
                            let event = this.eventFromTask({ id: this.task.id }, this.task);
                            this.events.push(event);
                            (calendar).fullCalendar('addEventSource', [event]);
                        } else {
                            (calendar).fullCalendar('updateEvent', this.eventFromTask(clientEvent, this.task));
                        }
                    }
                }
            });
        });
    }

    statusMatches(status, task) {
        let date = moment(task.Date);
        let now = moment();
        let today = date.month() === now.month() && date.day() === now.day();
        let inPast = date.isBefore(moment());

        if (!task.Completed) {
            if (inPast && status == 2) {
                return true;
            }
            else if (today && status == 3) {
                return true;
            }
            else if (task.Started && status == 5) {
                return true;
            }
        }
        else if (status == 4) {
            return true;
        }

        return false;
    }

    showAlert(alert) {
        let showAlert = true;

        if (alert.UserId !== this.AppConfig.user.id) {
            showAlert = false;
        }

        if (!this.settings.alerts.filters.showResolved && alert.AssetLog.Resolutions.length > 0
            && alert.AssetLog.Resolutions[0].Occurrence.Completed) {
            showAlert = false;
        }

        return showAlert;
    }

    showEvent(task, tab) {
        let showEvent = true;
        let filters = tab ? tab.filters : this.settings.activeTab().filters;


        if (!filters.showCompleted && task.Completed) {
            showEvent = false;
        }

        if (!filters.showStarted && (task.Started && !task.StoppedOn && !task.Completed)) {
            showEvent = false;
        }

        if (!filters.showStopped && (task.Started && (task.StoppedOn && task.StoppedBy !== this.AppConfig.user.userName) && !task.ResumedOn && !task.Completed)) {
            showEvent = false;
        }

        if (this.assetTab.filterC && this.assetTab.filterC.model.length > 0) {
            if (!this.statusMatches(this.assetTab.filterC.model[0].id, task)) {
                showEvent = false;
            }
        }

        return showEvent;
    }

    stopTask() {
        $('#do_task_modal').modal('hide');
        this.working = "Saving Results...";
        let savedModel = JSON.parse(this.task.FormModel);
        savedModel.dataModel = angular.copy(this.formModel.dataModel);
        this.OccurrenceService.stop(this.task.OccurrenceId, this.AppConfig.user.id, JSON.stringify(savedModel))
            .then((response) => {
                this.setTaskProperties(response.data.instance);
            })
            .catch((error) => {
                this.DialogService.error(error);
            })
            .finally(() => this.working = "");
    }

    toggleActions(e, tabIndex, eventId) {
        e.stopPropagation();
        $(".tooltip").prop("tooltip-is-open", false);
        let target = $(e.currentTarget);
        let elem = target.children(".evt-actions-popover");
        let btn = target.children(".evt-toggle-actions").children("span");

        if (elem.hasClass("evt-hide")) {
            elem.removeClass("evt-hide");
            btn.removeClass("evt-toggle-actions-icon-left");
            btn.addClass("evt-toggle-actions-icon-right");
        } else {
            elem.addClass("evt-hide");
            btn.removeClass("evt-toggle-actions-icon-right");
            btn.addClass("evt-toggle-actions-icon-left");
        }
    }

    updateAlert(alert) {
        this.$scope.$evalAsync(() => {
            alert.visible = true;
            alert.AssetAlert = angular.copy(this.assetAlerts.find((elem) => { return elem.Id === alert.AssetAlertId; }));
            this.alerts[this.alerts.findIndex((elem) => { return elem.Id === alert.Id; })] = alert;
        });
    }

    updateTask(task) {
        this.$scope.$evalAsync(() => {
            task.id = this.createUniqueId(task);

            // We could be receiving an Occurrence object or an TaskInstance object.
            // If we receive the later we need to mimic the fields of our TaskInstance
            // object.
            if (task.Task) {
                task.Name = task.Task.Name;
                task.IdleTimeout = task.Task.IdleTimeout;
            }

            if (!task.OccurrenceId) {
                task.OccurrenceId = task.Id;
            }

            task.id = this.createUniqueId(task);


            this.settings.tabs.forEach((tab) => {
                let userIds = [];
                let assetIds = [];
                let show = true;

                if (tab.type === "user") {
                    if (tab.multiUser) {
                        if (this.userTab.filter.model.length === 0) {
                            this.userTab.filter.data.forEach((elem) => { userIds.push(elem.id); });
                        } else {
                            this.userTab.filter.model.forEach((elem) => { userIds.push(elem.id); });
                        }
                    } else {
                        userIds.push(this.AppConfig.user.id);
                    }

                    if (userIds.find((id) => id === task.UserId) === undefined) {
                        show = false;
                    }
                } else {
                    if (this.assetTab.filterB.model.length === 0) {
                        this.assetTab.filterB.data.forEach((elem) => { assetIds.push(elem.id); });
                    } else {
                        this.assetTab.filterB.model.forEach((elem) => { assetIds.push(elem.id); });
                    }

                    if (assetIds.find((id) => id === task.AssetId) === undefined) {
                        show = false;
                    }

                    if (this.assetTab.filterC.model.length > 0) {
                        if (!this.statusMatches(this.assetTab.filterC.model[0].id, this.task)) {
                            show = false;
                        }
                    }
                }

                if (show && this.showEvent(task, tab)) {
                    let tabIndex = this.settings.tabs.findIndex((elem) => { return elem === tab; });
                    let entry = this.calendars.find((elem) => { return elem.id === tabIndex; });
                    let calendar = entry ? entry.calendar : null;

                    if (calendar) {
                        let clientEvent = (calendar).fullCalendar('clientEvents', task.id)[0];

                        if (!clientEvent) {
                            let event = this.eventFromTask({ id: task.id }, task);
                            this.events.push(event);
                            (calendar).fullCalendar('addEventSource', [event]);
                        } else {
                            (calendar).fullCalendar('updateEvent', this.eventFromTask(clientEvent, task));
                        }
                    }
                }
            });
        });
    }

    viewAlert(alert) {
        let asset = this.assets.find((elem) => { return elem.Id === alert.AssetLog.AssetId; });
        let resolution = alert.AssetLog.Resolutions.length > 0 ? alert.AssetLog.Resolutions[0].Occurrence : null;
        this.modalErrors = [];
        this.alertDetails = {
            Date: moment(alert.AlertDate).format("MM/DD/YYYY h:mm A"),
            User: getUserName(alert.User),
            Asset: getAssetName(asset),
            Department: asset.Department.Name,
            Category: alert.AssetLog.Type.Category.Name,
            Type: alert.AssetLog.Type.Name,
            Comment: alert.Comment,
            AssignedTo: resolution && resolution.User ? getUserName(resolution.User) : "n/a",
            StartedBy: resolution && resolution.StartedBy ? resolution.StartedBy : "Not Started!",
            StartedOn: resolution && resolution.StartedOn ? moment(resolution.StartedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            StoppedBy: resolution && resolution.StoppedBy ? resolution.StoppedBy : "n/a",
            StoppedOn: resolution && resolution.StoppedOn ? moment(resolution.StoppedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            ResumedBy: resolution && resolution.ResumedBy ? resolution.ResumedBy : "n/a",
            ResumedOn: resolution && resolution.ResumedOn ? moment(resolution.ResumedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            CompletedBy: resolution && resolution.CompletedBy ? resolution.CompletedBy : "n/a",
            CompletedOn: resolution && resolution.CompletedOn ? moment(resolution.CompletedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            TimeSpent: resolution && resolution.TimeSpent ? moment.duration(resolution.TimeSpent, "seconds").humanize() : "none",
        };

        let scope = this.$scope.$new();

        let body = this.$compile(`<form class="form-horizontal home-alert-details-view ` + alert.className + `">
            <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the task can be updated!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Recorded On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.Date" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Recorded By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.User" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Category:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.Category" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Type:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.Type" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Asset:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.Asset" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Department:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.Department" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Comment:</label>
                <div class="col-sm-9">
                    <textarea disabled class="form-control" ng-model="$ctrl.alertDetails.Comment"></textarea>
                </div>
            </div>` + (alert.AssetLog.Type.CanResolve ? `<hr/>
            <div class="form-group">
                <label class="control-label col-sm-3">Assigned To:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.AssignedTo" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Started By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.StartedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Started On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.StartedOn" />
                </div>
            </div>` + (this.alertDetails.StoppedBy !== "n/a" ? `
            <div class="form-group">
                <label class="control-label col-sm-3">Stopped By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.StoppedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Stopped On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.StoppedOn" />
                </div>
            </div>` : ``) + (this.alertDetails.ResumedBy !== "n/a" ? `
            <div class="form-group">
                <label class="control-label col-sm-3">Resumed By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.ResumedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Resumed On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.ResumedOn" />
                </div>
            </div>` : ``) + (this.alertDetails.CompletedBy !== "n/a" ? `
            <div class="form-group">
                <label class="control-label col-sm-3">Completed By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.CompletedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Completed On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.CompletedOn" />
                </div>
            </div>` : ``) +
                `<div class="form-group">
                <label class="control-label col-sm-3">Time Spent:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.alertDetails.TimeSpent" />
                </div>
            </div>` : ``) +
            `</form>`)(scope);

        this.DialogService.dialog(alert.AssetLog.Type.Name + "; recorded on: " + moment(alert.AlertDate).format("MM/DD/YYYY h:mm A"), body,
            {
                cancel: {
                    label: "Close",
                    className: 'btn-default',
                    callback: () => { this.modalErrors = []; scope.$destroy(); }
                }
            }
        );
    }

    viewTask(e, tabIndex, eventId) {
        this.task = (this.calendar()).fullCalendar('clientEvents', eventId)[0].task;
        this.modalErrors = [];
        this.taskDetails = {
            StartedBy: this.task.StartedBy || "Not started!",
            StartedOn: this.task.StartedOn ? moment(this.task.StartedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            StoppedBy: this.task.StoppedBy || "n/a",
            StoppedOn: this.task.StoppedOn ? moment(this.task.StoppedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            ResumedBy: this.task.ResumedBy || "n/a",
            ResumedOn: this.task.ResumedOn ? moment(this.task.ResumedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            CompletedBy: this.task.CompletedBy || "n/a",
            CompletedOn: this.task.CompletedOn ? moment(this.task.CompletedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
            TimeSpent: this.task.TimeSpent ? moment.duration(this.task.TimeSpent, "seconds").humanize() : "none",
        }

        let scope = this.$scope.$new();

        let body = this.$compile(`<form class="form-horizontal home-task-details-view ` + this.task.className + `">
            <div class="alert alert-danger" role="alert" ng-show="$ctrl.modalErrors.length > 0">
                <h4 class="alert-heading">Errors</h4>
                <p>The following errors must be addressed before the task can be updated!</p>
                <hr>
                <p class="mb-0" ng-repeat="x in $ctrl.modalErrors">&bull; {{x.error}}</p>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Started By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.StartedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Started On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.StartedOn" />
                </div>
            </div>` + (this.taskDetails.StoppedBy !== "n/a" ? `
            <div class="form-group">
                <label class="control-label col-sm-3">Stopped By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.StoppedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Stopped On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.StoppedOn" />
                </div>
            </div>` : ``) + (this.taskDetails.ResumedBy !== "n/a" ? `
            <div class="form-group">
                <label class="control-label col-sm-3">Resumed By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.ResumedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Resumed On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.ResumedOn" />
                </div>
            </div>` : ``) + (this.taskDetails.CompletedBy !== "n/a" ? `
            <div class="form-group">
                <label class="control-label col-sm-3">Completed By:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.CompletedBy" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Completed On:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.CompletedOn" />
                </div>
            </div>` : ``) +
            `<div class="form-group">
                <label class="control-label col-sm-3">Time Spent:</label>
                <div class="col-sm-9">
                    <input disabled class="form-control" ng-model="$ctrl.taskDetails.TimeSpent" />
                </div>
            </div>
        </form>`)(scope);

        var isAdmin = this.AppConfig.user != null && this.AppConfig.user.roles.find((elem) => { return elem.name === "Administrator"; }) != null;
        var buttons = {
            cancel: {
                label: "Close",
                className: 'btn-default',
                callback: () => { scope.$destroy(); }
            },
            viewResults: {
                label: "View Results",
                className: 'btn-primary',
                callback: () => { this.viewTaskResults(); return false; }
            }
        };

        if (isAdmin) {
            let stoppedOn = this.task.StoppedOn ? moment(this.task.StoppedOn) : null;
            let resumedOn = this.task.ResumedOn ? moment(this.task.ResumedOn) : null;

            if (this.task.StartedBy && !this.task.Completed && (!stoppedOn || (resumedOn && resumedOn > stoppedOn))) {
                buttons.stop = {
                    label: "Stop",
                    className: 'btn-success',
                    callback: () => {
                        this.working = "Stopping Task...";
                        let savedModel = JSON.parse(this.task.FormModel);
                        savedModel.dataModel = angular.copy(this.formModel.dataModel);
                        this.OccurrenceService.stop(this.task.OccurrenceId, this.AppConfig.user.id, JSON.stringify(savedModel))
                            .then((response) => {
                                this.setTaskProperties(response.data.instance);
                                this.taskDetails = {
                                    StoppedBy: this.task.StoppedBy || "n/a",
                                    StoppedOn: this.task.StoppedOn ? moment(this.task.StoppedOn).format("MM/DD/YYYY hh:mm A") : "n/a",
                                    TimeSpent: this.task.TimeSpent ? moment.duration(this.task.TimeSpent, "seconds").humanize() : "none",
                                }
                            })
                            .catch((error) => {
                                this.DialogService.error(error);
                            })
                            .finally(() => this.working = "");
                        scope.$destroy();
                        return true;
                    }
                };
            }
        }

        this.DialogService.dialog(this.task.Name + "; due on: " + moment(this.task.Date).format("MM/DD/YYYY h:mm A"), body, buttons);
    }

    viewTaskResults() {
        this.setTaskProperties(this.task);
        $('#view_task_modal').modal('show');
    }
}

HomeController.$inject = [
    "$compile",
    "$scope",
    "$timeout",
    "$q",
    "AppConfig",
    "AssetAlertService",
    "AssetAlertLogService",
    "AssetGroupService",
    "AssetLogService",
    "AssetLogTypeCategoryService",
    "AssetLogTypeService",
    "AssetService",
    "DepartmentService",
    "DialogService",
    "FormService",
    "ManufacturerService",
    "OccurrenceService",
    "ScheduleService",
    "SettingService",
    "SignalRService",
    "TaskService",
    "TaskCategoryService",
    "UserService"
];

// This is a home component for authenticated users.
// It shows navigation options and an overview UI based on the user"s AD group.
export const home = {
    controller: HomeController,
    templateUrl: "Views/App/home.html",
};
