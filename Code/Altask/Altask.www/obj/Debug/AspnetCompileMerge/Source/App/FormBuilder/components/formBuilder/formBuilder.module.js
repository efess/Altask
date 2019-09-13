/* global angular */

import FormBuilderConfig, {
    FORM_BUILDER_CONFIG_PROVIDER
} from './formBuilder.provider';
import formBuilderController, {
    FORM_BUILDER_CONTROLLER
} from './formBuilder.controller';
import formBuilder, {
    FORM_BUILDER_DIRECTIVE
} from './formBuilder.directive';
import { compileHtml} from "./compileHtml.directive";

const DRAGDROP_MODULE = 'main.module';

export default angular
.module(DRAGDROP_MODULE, [])
.provider(FORM_BUILDER_CONFIG_PROVIDER, FormBuilderConfig)
.controller( FORM_BUILDER_CONTROLLER, formBuilderController)
.directive( FORM_BUILDER_DIRECTIVE, formBuilder)
.directive("compileHtml", compileHtml);