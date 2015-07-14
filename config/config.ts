export function getEnvironment() :string {
    return process.env.NODE_ENV || 'development';
}

export function getMongoConnection() {
    return process.env.MONGO_URI;
}
