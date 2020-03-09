const getDb = require("../config/database").getDb;
const COLLECTION_NAME = "users";

class User {
  constructor(name, email, password, level, campusId) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.level = level;
    this.campusId = campusId;
  }

  save() {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .insertOne(this)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static findOne(filter) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .findOne(filter)
        .then(user => {
          resolve(user);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static find(filter, projection = {}) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .find(filter)
        .project(projection)
        .toArray()
        .then(users => {
          resolve(users);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = User;
