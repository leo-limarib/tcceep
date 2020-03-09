const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();

let _db;

const mongoConnect = callback => {
  MongoClient.connect(process.env.HOST + process.env.DATABASE_NAME)
    .then(client => {
      console.log("Connected to the database!");
      _db = client.db(process.env.DATABASE_NAME);
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "No database connection!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
