const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const opts = { useNewUrlParser: true, useCreateIndex: true,}

// Set the initial timeout interval for setting up mongo
jasmine.DEFAULT_TIMEOUT_INTERVAL = 7000;
module.exports.init = async function(){
    
    mongoServer = new MongoMemoryServer();
    const server = await mongoServer
        .getConnectionString()
        .then((mongoUri) => mongoose.connect(mongoUri, opts))
        .then(result => result);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
    return server;
    
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