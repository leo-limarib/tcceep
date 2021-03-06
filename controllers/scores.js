const Score = require("../models/score");
const ObjectID = require("mongodb").ObjectID;

exports.getStudentScores = (req, res) => {
  Score.find({ ownerEmail: req.session.user["email"] })
    .then((scores) => {
      return res.send(scores);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar exercícios resolvidos." });
    });
};

exports.updateScore = (req, res) => {
  Score.findOne({
    ownerEmail: req.session.user["email"],
    exerciseId: ObjectID(res.locals.newScore.exerciseId),
  })
    .then((score) => {
      if (score == null) {
        Score.updateOne(
          {
            ownerEmail: req.session.user["email"],
            exerciseId: ObjectID(res.locals.newScore.exerciseId),
          },
          {
            $set: {
              solved: res.locals.newScore.solved,
              score: res.locals.newScore.score,
              flaws: res.locals.newScore.flaws,
            },
          },
          true
        )
          .then((result) => {
            return res.json(res.locals.newScore);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message: "Erro ao tentar registrar pontuação do código.",
            });
          });
      } else if (score.score < res.locals.newScore.score) {
        Score.updateOne(
          {
            ownerEmail: req.session.user["email"],
            exerciseId: ObjectID(res.locals.newScore.exerciseId),
          },
          {
            $set: {
              solved: res.locals.newScore.solved,
              score: res.locals.newScore.score,
              flaws: res.locals.newScore.flaws,
            },
          },
          true
        )
          .then((result) => {
            return res.json(res.locals.newScore);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message: "Erro ao tentar registrar pontuação do código.",
            });
          });
      } else {
        return res.json({
          message: "Sua pontuação foi menor do que a anterior.",
        });
      }
    })
    .catch();
};

exports.getExerciseScores = (req, res) => {
  Score.find({ exerciseId: ObjectID(req.params.exerciseId) })
    .then((exercises) => {
      return res.send(exercises);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar pontuações do exercício." });
    });
};

exports.deleteExerciseScores = (req, res) => {
  Score.remove({ exerciseId: ObjectID(req.params.exerciseId) })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar excluir pontuações do exercício." });
    });
};

//req.params.exerciseId
//req.params.ownerEmail
exports.getStudentExerciseScore = (req, res) => {
  Score.findOne({
    exerciseId: ObjectID(req.params.exerciseId),
    ownerEmail: req.session.user["email"],
  })
    .then((score) => {
      if (score == null) {
        return res.send({ score: "Você ainda não resolveu esse exercício." });
      } else {
        return res.send(score);
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar retornar pontuação do aluno." });
    });
};
