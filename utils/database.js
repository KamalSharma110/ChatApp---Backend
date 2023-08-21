const mongodb = require("mongodb");

const { mongodb_uri } = require("../config");

let _db;
const mongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  mongoClient
    .connect(mongodb_uri)
    .then((client) => {
      _db = client.db("ChatApp");
      console.log("Connected to database!");
      cb();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (!_db) throw new Error("Database was not initialized.");
  else return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
