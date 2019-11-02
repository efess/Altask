import ControlProxyService, {
   CONTROL_PROXY_SERVICE
} from './configurationModelProxy.service';

const EDA_CONFIG_PROXY_MODULE = 'eda.config.proxy.module';

export default angular
    .module(EDA_CONFIG_PROXY_MODULE, [])
    .service(CONTROL_PROXY_SERVICE, ControlProxyService);
