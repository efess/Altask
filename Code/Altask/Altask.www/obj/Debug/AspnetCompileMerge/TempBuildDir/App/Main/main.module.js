import {app} from "./app.component";
import {assetGroups} from "./Asset/assetGroups.component";
import {assetLogTypeCategories} from "./Asset/assetLogTypeCategories.component";
import {assetLogTypes} from "./Asset/assetLogTypes.component";
import {assets} from "./Asset/assets.component";
import {assetTypes} from "./Asset/assetTypes.component";
import {datepicker} from "./Directives/datepicker.directive";
import {departments} from "./System/departments.component";
import {forms} from "./Form/forms.component";
import {home} from "./home.component";
import {login} from "./Account/login.component";
import {manufacturers} from "./System/manufacturers.component";
import {pageLoading} from "./Directives/pageLoading.directive";
import {reqData} from "./Directives/reqData.directive";
import {resizable} from "./Directives/resizable.directive";
import {schedule} from "./Directives/schedule.directive";
import {servicesPanel} from "./System/servicesPanel.component";
import {taskCategories} from "./Task/taskCategories.component";
import {tasks} from "./Task/tasks.component";
import {unqName} from "./Directives/unqName.directive";
import {users} from "./User/users.component";
import {settings} from "./System/settings.component";

import {
    appState,
    assetGroupsState,
    assetLogTypeCategoriesState,
    assetLogTypesState,
    assetsState,
    assetTypesState,
    departmentsState,
    formsState,
    homeState,
    loginState,
    manufacturersState,
    servicesPanelState,
    taskCategoriesState,
    tasksState,
    usersState,
    settingsState
} from "./app.states";

export const MAIN_MODULE = angular.module("main", []);

MAIN_MODULE.config(["$uiRouterProvider", function($uiRouter, formlyConfig) {
    // Enable tracing of each TRANSITION... (check the javascript console)
    // This syntax `$trace.enable(1)` is an alternative to `$trace.enable("TRANSITION")`.
    // Besides "TRANSITION", you can also enable tracing for : "RESOLVE", "HOOK", "INVOKE", "UIVIEW", "VIEWCONFIG"
    $uiRouter.trace.enable(1);

    // If the user enters a URL that doesn"t match any known URL (state), send them to `/home`
    const $urlService = $uiRouter.urlService;
    $urlService.rules.otherwise({ state: "login" });

    const $stateRegistry = $uiRouter.stateRegistry;
    $stateRegistry.register(appState);
    $stateRegistry.register(assetGroupsState);
    $stateRegistry.register(assetLogTypeCategoriesState);
    $stateRegistry.register(assetLogTypesState);
    $stateRegistry.register(assetsState);
    $stateRegistry.register(assetTypesState);
    $stateRegistry.register(departmentsState);
    $stateRegistry.register(formsState);
    $stateRegistry.register(homeState);
    $stateRegistry.register(loginState);
    $stateRegistry.register(manufacturersState);
    $stateRegistry.register(servicesPanelState);
    $stateRegistry.register(taskCategoriesState);
    $stateRegistry.register(tasksState);
    $stateRegistry.register(usersState);
    $stateRegistry.register(settingsState);
}]);

MAIN_MODULE.component("app", app);
MAIN_MODULE.component("assetGroups", assetGroups);
MAIN_MODULE.component("assetLogTypeCategories", assetLogTypeCategories);
MAIN_MODULE.component("assetLogTypes", assetLogTypes);
MAIN_MODULE.component("assets", assets);
MAIN_MODULE.component("assetTypes", assetTypes);
MAIN_MODULE.component("departments", departments);
MAIN_MODULE.component("forms", forms);
MAIN_MODULE.component("home", home);
MAIN_MODULE.component("login", login);
MAIN_MODULE.component("manufacturers", manufacturers);
MAIN_MODULE.component("servicesPanel", servicesPanel);
MAIN_MODULE.component("taskCategories", taskCategories);
MAIN_MODULE.component("tasks", tasks);
MAIN_MODULE.component("users", users);
MAIN_MODULE.component("settings", settings);

MAIN_MODULE.directive("datepicker", datepicker);
MAIN_MODULE.directive("pageLoading", pageLoading);
MAIN_MODULE.directive("reqData", reqData);
MAIN_MODULE.directive("resizable", resizable);
MAIN_MODULE.directive("schedule", schedule);
MAIN_MODULE.directive("unqName", unqName);