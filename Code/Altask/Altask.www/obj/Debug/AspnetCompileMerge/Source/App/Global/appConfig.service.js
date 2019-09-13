/**
 * This service stores and retrieves user preferences in session storage
 */
export class AppConfig {
    constructor() {
        this.user = undefined;
        this.settings = undefined;
        this.restDelay = 100;
        this.load();
    }

    load() {
        try {
            return angular.extend(this, angular.fromJson(sessionStorage.getItem("appConfig")))
        } catch (Error) { }

        return this;
    }

    resetSettings() {
        this.settings = {
            home: {
                alerts : {
                    collapsed: false,
                    filters: {
                        showResolved: true,
                    },
                    locked: false,
                },
                tabs : [
                    {
                        id: 0,
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
                        showFilter: true,
                        showLegend: true,
                        showLegendToggle: true,
                        showMonthView: true,
                        showDayView: true,
                        showDayListView: true,
                        showWeekListView: true,
                        showMonthListView: true
                    },
                    {
                        id: 1,
                        caption: "Asset Tasks",
                        calendar: {
                            view: "month",
                        },
                        filters: {
                            aModel: [],
							bModel: [],
							cModel: [],
                            showCompleted: true,
                            showStarted: true,
                            showStopped: true,
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
                    },
                ],
                selectedTab: 0,
                locked: false,
            }
        };

        if (this.user) {
            this.settings.home.tabs[0].filters.model.push({ id: this.user.id, label: this.user.FullName || this.user.UserName });
        }
    }

    loadSettings(format) {
        this.resetSettings();

        if (format) {
            this.settings = JSON.parse(format);
        }
    }

    save() {
        sessionStorage.setItem("appConfig", angular.toJson(angular.extend({}, this)));
    }
}