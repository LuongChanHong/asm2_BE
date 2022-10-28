const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      "mongodb+srv://mongodb_admin:mongodb_admin@cluster0.e6b0l5j.mongodb.net/hotel?retryWrites=true&w=majority"
    )
    .then((result) => {
      console.log("CONNECTED::MONGO_DB");
      _db = result.db();
      callback();
    })
    .catch((err) => console.log("::ERROR:", err));
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "NO DATABASE FOUND";
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
