const getDb = require("../config/database").getDb;
const COLLECTION_NAME = "scores";

class Score {
  constructor(studentId, exerciseId, solved, score, flaws) {
    this.studentId = studentId;
    this.exerciseId = exerciseId;
    this.solved = solved;
    this.score = score;
    this.flaws = flaws;
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
        .then(scores => {
          resolve(scores);
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
        .then(score => {
          resolve(score);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static updateOne(filter, update, upsert = false) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .updateOne(filter, update, { upsert: upsert })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = Score;
