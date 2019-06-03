const bunyan = require('bunyan')

const logger  = bunyan.createLogger({
    name: 'artistp-api-logger',
    level: 30, // info,
    src: true,
    serializers: bunyan.stdSerializers
})

module.exports = logger