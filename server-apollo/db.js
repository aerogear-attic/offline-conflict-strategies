const MongoClient = require('mongodb').MongoClient

async function connect (options) {
  const client = await MongoClient.connect(options.url)
  return client.db(options.database)
}

module.exports = connect
