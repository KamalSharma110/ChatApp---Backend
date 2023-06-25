const mongodb = require("mongodb");

let _db;
const mongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  mongoClient
    .connect(
      "mongodb+srv://kamal2507s:Kamalsharma1$@cluster0.t4bgmfd.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((client) => {
      _db = client.db("ChatApp");
      console.log("Connected to database!");
      cb();
    }).catch(err => next(err));
};

const getDb = () => {
  if (!_db) throw new Error("Database was not initialized.");
  else return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
