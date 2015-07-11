import config = require('IEnvConfig')

export class Config implements config.IEnvConfig {
    constructor() {}
    getMongoConnection() :string {
        return "mongodb://localhost:27017/smoo"
    }
    getUrl():string {
        return "http://localhost:3000/";
    }
}
