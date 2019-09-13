import FormlyProxyService, {
    FORMLY_PROXY_SERVICE
} from './formlyProxy.service';

import FormlyProxyModels, {
    FORMLY_PROXY_MODELS
} from './formlyProxy.provider';



const FORMLY_PROXY_MODULE = 'FromlyProxy';

export default angular
    .module(FORMLY_PROXY_MODULE, [])
    .service(FORMLY_PROXY_SERVICE, FormlyProxyService)
    .provider(FORMLY_PROXY_MODELS, FormlyProxyModels);