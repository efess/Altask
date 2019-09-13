/** Some utility functions used by the application */
import moment from "moment";

export const setProp = (obj, key, val) => { obj[key] = val; return obj; };
export const pushToArr = (array, item) => { array.push(item); return array; };
export const uniqReduce = (arr, item) => arr.indexOf(item) !== -1 ? arr : pushToArr(arr, item);
export const flattenReduce = (arr, item) => arr.concat(item);
export const isNullOrWhiteSpace = (val) => { return (!val || val.length === 0 || /^\s*$/.test(val)); };
let guidChar = (c) => c !== "x" && c !== "y" ? "-" : Math.floor(Math.random()*16).toString(16).toUpperCase();
export const guid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("").map(guidChar).join("");

export const getUserName = (user) => {
    if (!user) {
        return "";
    }

    let name = user.UserName;

    if (user.FullName) {
        name = user.FullName;
    }

    return name;
}

export const getAssetName = (asset) => {
    if (!asset) {
        return "";
    }

    let name = asset.Name;

    if (asset.CustomId) {
        name = asset.CustomId.concat(" - ").concat(name);
    }

    return name;
}
export const relativeDate = (date) => {
    return moment(date).calendar(null, {
        sameDay : function(now) {
            if (this.hour() === 0 && this.minute() === 0) {
                return "[Today]";
            } else {
                return "[Today at] LT";
            }
        },
        nextDay: function(now) {
            if (this.hour() === 0 && this.minute() === 0) {
                return "[Tomorrow]";
            } else {
                return "[Tomorrow at] LT";
            }
        },
        nextWeek: function(now) {
            if (this.hour() === 0 && this.minute() === 0) {
                return "[Next] dddd";
            } else {
                return "[Next] dddd [at] LT";
            }
        },
        lastDay: function(now) {
            if (this.hour() === 0 && this.minute() === 0) {
                return "[Yesterday]";
            } else {
                return "[Yesterday at] LT";
            }
        },
        lastWeek: function(now) {
            if (this.hour() === 0 && this.minute() === 0) {
                return "[Last] dddd";
            } else {
                return "[Last] dddd [at] LT";
            }
        },
        sameElse: function(now) {
            if (this.hour() === 0 && this.minute() === 0) {
                return "M/D/YYYY";
            } else {
                return "M/D/YYYY h:m A";
            }
        }
    });
};

export const assetAlertSummary = (assetAlert) => {
    let summary = "Alert ";

    if (assetAlert.Users.length === 1) {
        let user = assetAlert.Users[0].User;
        summary = summary.concat(getUserName(user)).concat(" ");
    } else {
        angular.forEach(assetAlert.Users, (taskAlertUser) => {
            let user = taskAlertUser.User;
            summary = summary.concat(getUserName(user));
            summary = summary.concat(", ");
        });

        summary = summary.slice(0, -2).concat(" ");
        let index = summary.lastIndexOf(",");
        summary = summary.slice(0, index) + " and" + summary.slice(index + 1);    
    }

    summary = summary.concat(" when \"").concat(assetAlert.LogType.Name).concat("\" is reported.");
    return summary;
}

export const taskAlertSummary = (taskAlert) => {
    let summary = "Alert ";

    if (taskAlert.Users.length === 1) {
        let user = taskAlert.Users[0].User;
        summary = summary.concat(getUserName(user)).concat(" ");
    } else {
        angular.forEach(taskAlert.Users, (taskAlertUser) => {
            let user = taskAlertUser.User;
            summary = summary.concat(getUserName(user));
            summary = summary.concat(", ");
        });

        summary = summary.slice(0, -2).concat(" ");
        let index = summary.lastIndexOf(",");
        summary = summary.slice(0, index) + " and" + summary.slice(index + 1);   
    }

    if (taskAlert.TimeN > 0) {
        summary = summary.concat(taskAlert.TimeN, " ");

        switch(taskAlert.TimeUnit) {
            case "Minute(s)" : summary = summary.concat(taskAlert.TimeN > 1 ? "minutes " : "minute "); break;
            case "Hour(s)" : summary = summary.concat(taskAlert.TimeN > 1 ? "hours " : "hour "); break;
            case "Day(s)" : summary = summary.concat(taskAlert.TimeN > 1 ? "days " : "day "); break;
            case "Week(s)" : summary = summary.concat(taskAlert.TimeN > 1 ? "weeks " : "week "); break;
        }

        switch(taskAlert.When) {
            case "BeforeDueDate" : summary = summary.concat("before due date "); break;
            case "AfterDueDate" : summary = summary.concat("after due date "); break;
        }
    } else {
        summary = summary.concat("on due date ");
    }

    if (taskAlert.IfNot) {
        summary = summary.concat("if not ");
    } else {
        summary = summary.concat("if ");
    }

    switch(taskAlert.IfStatus) {
        case "Dismissed" : summary = summary.concat("dismissed."); break;
        case "Started" : summary = summary.concat("started."); break;
        case "Stopped" : summary = summary.concat("stopped."); break;
        case "Resumed" : summary = summary.concat("resumed."); break;
        case "Completed" : summary = summary.concat("completed."); break;
    }

    return summary;
}

export const scheduleSummary = (schedule) => {
    let summary = "Every ";

    if (schedule.EveryN > 1) {
        summary = summary.concat(schedule.EveryN, " ");

        switch (schedule.Frequency) {
            default: summary = summary.concat("days "); break;
            case "Weekly": summary = summary.concat("weeks "); break;
			case "Monthly": summary = summary.concat("months"); break;
			case "Quarterly": summary = summary.concat("quarters "); break;
			case "Yearly": summary = summary.concat("years "); break;
        }
    } else {
        switch (schedule.Frequency) {
            default: summary = summary.concat("day "); break;
            case "Weekly": summary = summary.concat("week "); break;
			case "Monthly": summary = summary.concat("month"); break;
			case "Quarterly": summary = summary.concat("quarter "); break;
			case "Yearly": summary = summary.concat("year "); break;
        }
    }

    if (schedule.Frequency === "Monthly") {
        if (schedule.OnWeek == 5) {
            summary = summary.concat(", last week of the month, ");
        } else {
            summary = summary.concat(", on week ", schedule.OnWeek, ", ");
        }
    }

    if (schedule.Frequency === "Weekly" || schedule.Frequency === "Monthly") {
        summary = summary.concat(" on ");
        var moreThanOneDay = false;
        var moreThanTwoDays = false;
        var dayOfWeekSummary = "";
        var daysOfWeek = [];
        daysOfWeek.push({ day: "Sun", on: schedule.OnSunday || false });
        daysOfWeek.push({ day: "Mon", on: schedule.OnMonday || false });
        daysOfWeek.push({ day: "Tue", on: schedule.OnTuesday || false });
        daysOfWeek.push({ day: "Wed", on: schedule.OnWednesday || false });
        daysOfWeek.push({ day: "Thu", on: schedule.OnThursday || false });
        daysOfWeek.push({ day: "Fri", on: schedule.OnFriday || false });
        daysOfWeek.push({ day: "Sat", on: schedule.OnSaturday || false });

        for (var index = 6; index >= 0; index--) {
            if (daysOfWeek[index].on) {
                if (moreThanOneDay) {
                    if (!moreThanTwoDays) {
                        dayOfWeekSummary = " and " + dayOfWeekSummary;
                        moreThanTwoDays = true;
                    } else {
                        dayOfWeekSummary = ", " + dayOfWeekSummary;
                    }
                }

                dayOfWeekSummary = daysOfWeek[index].day + dayOfWeekSummary;
                moreThanOneDay = true;
            }
        }

        summary = summary.concat(dayOfWeekSummary);
    }

    if (!schedule.AnyTime){
        summary = summary.concat(" by " + moment(schedule.StartsOn).format("h:mm A") + " ")
    }

    if (schedule.EndsAfter || schedule.EndsOn) {
        summary = summary.concat(" ending ");

        if (schedule.EndsAfter) {
            summary = summary.concat("after ", schedule.EndsAfter, " occurrence(s)");
        } else {
            summary = summary.concat("on ", moment(schedule.EndsOn).format("MMM Do YYYY"));
        }
    }

    return summary;
};
