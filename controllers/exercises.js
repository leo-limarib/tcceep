const Exercise = require("../models/exercise");
const ObjectID = require("mongodb").ObjectID;

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
