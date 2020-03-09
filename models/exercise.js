const getDb = require("../config/database").getDb;
const COLLECTION_NAME = "exercises";

class Exercise {
  constructor(teacherId, subjectId, name, question, languages, testCases) {
    this.teacherId = teacherId;
    this.subjectId = subjectId;
    this.name = name;
    this.question = question;
    this.languages = languages;
    this.testCases = testCases;
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

  static find(filter, projection) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .find(filter)
        .project(projection)
        .toArray()
        .then(exercises => {
          resolve(exercises);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = Exercise;
