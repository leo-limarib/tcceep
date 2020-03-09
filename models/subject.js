const getDb = require("../config/database").getDb;
const COLLECTION_NAME = "subjects";

class Subject {
  constructor(name, campusId, teacherId) {
    this.name = name;
    this.campusId = campusId;
    this.teacherId = teacherId;
    this.studentIds = [];
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

  static find(filter, projection = {}) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .find(filter)
        .project(projection)
        .toArray()
        .then(subjects => {
          resolve(subjects);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static findOne(filter, projection = {}) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .findOne(filter, projection)
        .then(sub => {
          resolve(sub);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static updateOne(filter, update) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .updateOne(filter, update)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = Subject;
