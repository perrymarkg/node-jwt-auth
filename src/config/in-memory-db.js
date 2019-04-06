const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const opts = { useNewUrlParser: true, useCreateIndex: true,}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 70000;
module.exports.init = async function(){
    
    mongoServer = new MongoMemoryServer();
    return await mongoServer
        .getConnectionString()
        .then((mongoUri) => mongoose.connect(mongoUri, opts))
        .then(result => result);
}

module.exports.disconnect = function(){
    mongoose.disconnect();
    mongoServer.stop();
}

module.exports.dropAll = async function(){
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.drop()
    }

    return true;
}