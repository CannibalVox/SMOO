export function getEnvironment() :string {
    return process.env.NODE_ENV || 'development';
}

import envConfig = require('./IEnvConfig');

export function createEnvConfig() :envConfig.IEnvConfig {
    var configClass = require('./'+getEnvironment());
    var configObj:envConfig.IEnvConfig = new configClass.Config();
    return configObj;
}
