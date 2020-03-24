const Exercise = require("../models/exercise");
const User = require("../models/user");
const Subject = require("../models/subject");
const ObjectID = require("mongodb").ObjectID;
const upload = require("../utils/upload");
const { spawn } = require("child_process");

function exerciseInfoFactory(exercise) {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: ObjectID(exercise.teacherId) })
      .then(teacher => {
        Subject.findOne({ _id: ObjectID(exercise.subjectId) })
          .then(subject => {
            resolve({
              name: exercise.name,
              teacher: teacher.name,
              subject: subject.name,
              question: exercise.question,
              languages: exercise.languages
            });
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.addNewExercise = (req, res) => {
  const testInputs = req.body.inputs.split("@");
  const testOutputs = req.body.outputs.split("@");
  const newEx = new Exercise(
    req.session.user["_id"],
    ObjectID(req.body.subject),
    req.body.name,
    req.body.question,
    ["python3"],
    {
      inputs: testInputs,
      outputs: testOutputs
    }
  );
  newEx
    .save()
    .then(() => {
      return res.json({ message: "Exercício adicionado com sucesso." });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar adicionar exercício." });
    });
};

exports.getSubjectExercises = (req, res) => {
  Exercise.find(
    {
      subjectId: ObjectID(req.params.subjectId)
    },
    { subjectId: 0, teacherId: 0, testCases: 0 }
  )
    .then(exercises => {
      return res.send(exercises);
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar retornar exercícios da matéria." });
    });
};

exports.getExerciseToSolve = (req, res) => {
  Exercise.findOne({ _id: ObjectID(req.params.exerciseId) })
    .then(exercise => {
      exerciseInfoFactory(exercise)
        .then(ex => {
          return res.send(ex);
        })
        .catch(err => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erro ao tentar retornar exercício." });
        });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar retornar exercício." });
    });
};

exports.solveExercise = (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao tentar submeter exercício." });
    }

    //Cria o processo.
    const codeProcess = spawn(`python3`, [
      `uploads/${req.session.user["email"]}/${req.files["input_file"][0].originalname}`
    ]);

    codeProcess.on("error", err => {
      console.log(err);
    });

    codeProcess.stdout
      .on("data", data => {
        console.log(data);
      })
      .setEncoding("utf-8");

    codeProcess.stderr.on("data", data => {
      //Aqui teriamos que ir guardando as linhas
      //para, no final, comparar os outputs com
      //as respostas corretas.
      console.log(data);
    });

    codeProcess.stdin.setDefaultEncoding("utf-8");

    //Aqui seriam os test cases do db.
    codeProcess.stdin.write("input1\n");
    codeProcess.stdin.write("input2\n");
    codeProcess.stdin.write("input3\n");
    codeProcess.stdin.write("input4\n");
    codeProcess.stdin.end();
  });
};
