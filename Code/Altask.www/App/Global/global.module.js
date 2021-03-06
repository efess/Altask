﻿import { AppConfig } from "./appConfig.service";
import { AssetService } from "./asset.service";
import { AssetAlertService } from "./assetAlert.service";
import { AssetAlertLogService } from "./assetAlertLog.service";
import { AssetGroupService } from "./assetGroup.service";
import { AssetLogService } from "./assetLog.service";
import { AssetLogTypeService } from "./assetLogType.service";
import { AssetLogTypeCategoryService } from "./assetLogTypeCategory.service";
import { AssetTypeService } from "./assetType.service";
import { authHookRunBlock } from "./requiresAuth.hook";
import { AuthService } from "./auth.service";
import { CommService } from "./comm.service";
import { CrudService } from "./crud.service";
import { DepartmentService } from "./department.service";
import { DialogService } from "./dialog.service";
import { FormServiceExt } from "./Partials/form.service";
import { Logger } from "./logger.service";
import { ManufacturerService } from "./manufacturer.service";
import { OccurrenceServiceExt } from "./Partials/occurrence.service";
import { ReportService } from "./report.service";
import { RoleService } from "./role.service";
import { ScheduleServiceExt } from "./Partials/schedule.service";
import { SignalRService } from "./signalR.service";
import { TaskAlertService } from "./taskAlert.service";
import { TaskCategoryService } from "./taskCategory.service";
import { TaskService } from "./task.service";
import { TaskTypeService } from "./taskType.service";
import { UserServiceExt } from "./Partials/user.service";
import { SettingService } from "./setting.service";
export const GLOBAL_MODULE = angular.module("global", []);

GLOBAL_MODULE.service("AppConfig", AppConfig);
GLOBAL_MODULE.service("AssetService", AssetService);
GLOBAL_MODULE.service("AssetAlertService", AssetAlertService);
GLOBAL_MODULE.service("AssetAlertLogService", AssetAlertLogService);
GLOBAL_MODULE.service("AssetGroupService", AssetGroupService);
GLOBAL_MODULE.service("AssetLogService", AssetLogService);
GLOBAL_MODULE.service("AssetLogTypeService", AssetLogTypeService);
GLOBAL_MODULE.service("AssetLogTypeCategoryService", AssetLogTypeCategoryService);
GLOBAL_MODULE.service("AssetTypeService", AssetTypeService);
GLOBAL_MODULE.service("AuthService", AuthService);
GLOBAL_MODULE.service("CommService", CommService);
GLOBAL_MODULE.service("CrudService", CrudService);
GLOBAL_MODULE.service("DepartmentService", DepartmentService);
GLOBAL_MODULE.service("DialogService", DialogService);
GLOBAL_MODULE.service("FormService", FormServiceExt);
GLOBAL_MODULE.service("Logger", Logger);
GLOBAL_MODULE.service("ManufacturerService", ManufacturerService);
GLOBAL_MODULE.service("OccurrenceService", OccurrenceServiceExt);
GLOBAL_MODULE.service("ReportService", ReportService);
GLOBAL_MODULE.service("RoleService", RoleService);
GLOBAL_MODULE.service("ScheduleService", ScheduleServiceExt);
GLOBAL_MODULE.service("SignalRService", SignalRService);
GLOBAL_MODULE.service("TaskAlertService", TaskAlertService);
GLOBAL_MODULE.service("TaskCategoryService", TaskCategoryService);
GLOBAL_MODULE.service("TaskService", TaskService);
GLOBAL_MODULE.service("TaskTypeService", TaskTypeService);
GLOBAL_MODULE.service("UserService", UserServiceExt);
GLOBAL_MODULE.service("SettingService", SettingService);
GLOBAL_MODULE.run(authHookRunBlock);
