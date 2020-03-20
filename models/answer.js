const getDb = require("../config/database").getDb;
const COLLECTION_NAME = "answers";

class Answer {
  constructor(ownerEmail, exerciseId, languageUsed, fileName, score) {
    this.ownerEmail = ownerEmail;
    this.exerciseId = exerciseId;
    this.languageUsed = languageUsed;
    this.fileName = fileName;
    this.score = score;
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
}

module.exports = Answer;
