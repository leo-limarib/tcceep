const Exercise = require("../models/exercise");
const User = require("../models/user");
const Subject = require("../models/subject");
const ObjectID = require("mongodb").ObjectID;
const upload = require("../utils/upload");
const { spawn } = require("child_process");
const Score = require("../models/score");

function exerciseInfoFactory(exercise) {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: ObjectID(exercise.teacherId) })
      .then((teacher) => {
        Subject.findOne({ _id: ObjectID(exercise.subjectId) })
          .then((subject) => {
            resolve({
              name: exercise.name,
              teacher: teacher.name,
              subject: subject.name,
              question: exercise.question,
              languages: exercise.languages,
            });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getExercisesScore(exercises, studentEmail) {
  return new Promise((resolve, reject) => {
    var exs = [];
    exercises.forEach((ex) => {
      Score.findOne({ exerciseId: ObjectID(ex._id), ownerEmail: studentEmail })
        .then((score) => {
          if (score != null) {
            exs.push({
              _id: ex._id,
              name: ex.name,
              question: ex.question,
              languages: ex.languages,
              solved: score.solved,
              score: score.score,
              flaws: score.flaws,
            });
          } else {
            exs.push({
              _id: ex._id,
              name: ex.name,
              question: ex.question,
              languages: ex.languages,
            });
          }
          if (exs.length == exercises.length) {
            resolve(exs);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

//FIX
//Por enquanto estamos fixando o problema para ser
//1 input e 1 output por teste.
exports.addNewExercise = (req, res) => {
  //req.body.name
  //req.body.subjectId
  //req.body.question
  //const testInputs = req.body.inputs.split("@");
  //const testOutputs = req.body.outputs.split("@");
  const newEx = new Exercise(
    req.session.user["_id"],
    ObjectID(req.body.subjectId),
    req.body.name,
    req.body.question,
    ["python3"],
    1,
    1,
    {
      inputs: req.body.inputs,
      outputs: req.body.outputs,
    }
  );
  newEx
    .save()
    .then(() => {
      return res.json({ message: "Exercício adicionado com sucesso." });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar adicionar exercício." });
    });
};

exports.getSubjectExercises = (req, res) => {
  Exercise.find(
    {
      subjectId: ObjectID(req.params.subjectId),
    },
    { subjectId: 0, teacherId: 0, testCases: 0 }
  )
    .then((exercises) => {
      if (exercises.length > 0) {
        getExercisesScore(exercises, req.session.user["email"])
          .then((exs) => {
            return res.send(exs);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message: "Erro ao tentar retornar exercícios da matéria.",
            });
          });
      } else {
        return res.send([]);
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar retornar exercícios da matéria." });
    });
};

exports.getExerciseToSolve = (req, res) => {
  Exercise.findOne({ _id: ObjectID(req.params.exerciseId) })
    .then((exercise) => {
      exerciseInfoFactory(exercise)
        .then((ex) => {
          return res.send(ex);
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erro ao tentar retornar exercício." });
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar retornar exercício." });
    });
};

//req.params.exerciseId
exports.solveExercise = (req, res, next) => {
  console.log(req.body);
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao tentar submeter exercício." });
    }
    Exercise.findOne({ _id: ObjectID(req.params.exerciseId) })
      .then((exercise) => {
        if (exercise == null) {
          console.log("Exercicio nao encontrado");
          return res.status(500).json({ message: "Exercicio nao encontrado" });
        }
        var score = 0;
        var flaws = [];
        for (var i = 0; i < exercise.testCases.inputs.length; i++) {
          let index = i;

          //Creates the code process
          const codeProcess = spawn(`python`, [
            `uploads/${req.session.user["email"]}/${req.files["input_file"][0].originalname}`,
          ]);

          //Error listener
          codeProcess.on("error", (err) => {
            console.log(err);
          });

          //Stderr listener
          codeProcess.stderr.on("data", (data) => {
            console.log(data);
            return res.status(500).json({ message: data });
          });

          codeProcess.stdout
            .on("data", (data) => {
              if (data.trim() == exercise.testCases.outputs[index]) {
                score += 1;
              } else {
                flaws.push(index);
              }
              if (score + flaws.length == exercise.testCases.outputs.length) {
                //Aqui devemos adicionar o score do aluno ou modificá-lo
                //se ele já existe.
                res.locals.newScore = {
                  exerciseId: ObjectID(req.params.exerciseId),
                  solved: score == exercise.testCases.outputs.length,
                  score: (score / exercise.testCases.outputs.length) * 100,
                  flaws: flaws,
                };
                return next();
              }
            })
            .setEncoding("utf-8");

          codeProcess.stdin.write(exercise.testCases.inputs[i]);
          codeProcess.stdin.end();
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Erro ao tentar resolver exercício." });
      });
  });
};

exports.getTeacherExercises = (req, res) => {
  Exercise.find({ teacherId: ObjectID(req.session.user["_id"]) })
    .then((exercises) => {
      return res.send(exercises);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar exercícios do professor." });
    });
};

exports.getExercise = (req, res) => {
  Exercise.findOne({ _id: ObjectID(req.params.exerciseId) })
    .then((ex) => {
      return res.send(ex);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar retornar exercício." });
    });
};

exports.removeExercise = (req, res, next) => {
  // req.params.exerciseId
  Exercise.remove({ _id: ObjectID(req.params.exerciseId) })
    .then((result) => {
      return next(result);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar excluir exercício." });
    });
};
