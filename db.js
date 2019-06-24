const MongoClient = require('mongodb').MongoClient

const password = 'sWXgMcsbvYPjgj4C';
const DEV_URI = `mongodb+srv://api-service-account:${password}@listening-room-ial18.mongodb.net/listening-room?retryWrites=true&w=majority`;

function connect(url) {
    return MongoClient.connect(url).then(client => client.db())
}

module.exports = async function() {
    let databases = await Promise.all([connect(DEV_URI)])
    return {
        development: databases[0],
    }
}