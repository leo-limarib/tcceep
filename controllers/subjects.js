const Subject = require("../models/subject");
const User = require("../models/user");
const ObjectID = require("mongodb").ObjectID;

function subjectInfoFactory(
  name,
  teacher,
  registeredStudents,
  nonRegisteredStudents
) {
  return {
    name: name,
    teacher: teacher,
    registeredStudents: registeredStudents,
    nonRegisteredStudents: nonRegisteredStudents
  };
}

/* 
addSubject()
req.body.name
req.body.teacherId
req.session.user["campusId"]
*/
exports.addSubject = (req, res) => {
  const teacherId = new ObjectID(req.body.teacherId);
  const subject = new Subject(
    req.body.name,
    req.session.user["campusId"],
    teacherId
  );
  subject
    .save()
    .then(result => {
      return res.json({ message: "Matéria adicionada com sucesso!" });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar adicionar matéria." });
    });
};

/*
req.session.user["campusId"]
*/
function getSubjectsTeachers(subjects) {
  return new Promise((resolve, reject) => {
    var newSubjects = [];
    for (const sub of subjects) {
      User.findOne({ _id: ObjectID(sub.teacherId) })
        .then(t => {
          newSubjects.push({
            _id: sub._id,
            name: sub.name,
            teacherName: t.name
          });
          if (newSubjects.length == subjects.length) {
            resolve(newSubjects);
          }
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

exports.getSubjectsFromCampus = (req, res) => {
  Subject.find(
    {
      campusId: req.session.user["campusId"]
    },
    {
      campusId: 0,
      studentIds: 0
    }
  )
    .then(subs => {
      getSubjectsTeachers(subs)
        .then(subjects => {
          return res.send(subjects);
        })
        .catch(err => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erro ao tentar listar matérias do campus." });
        });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar matérias do campus." });
    });
};

/*
req.query.subjectId
req.session.user["campusId"]
*/
exports.getSubjectInfo = (req, res) => {
  const subjectId = new ObjectID(req.query.subjectId);
  Subject.findOne({ _id: subjectId })
    .then(sub => {
      User.findOne({ _id: sub.teacherId })
        .then(teacher => {
          //get all students registered in the subject
          User.find({ _id: { $in: sub.studentIds } })
            .then(registeredStudents => {
              //get all students non registered in the subject
              User.find({
                _id: { $nin: sub.studentIds },
                campusId: req.session.user["campusId"],
                level: 1
              })
                .then(nonRegisteredStudents => {
                  return res.send(
                    subjectInfoFactory(
                      sub.name,
                      teacher.name,
                      registeredStudents,
                      nonRegisteredStudents
                    )
                  );
                })
                .catch(err => {});
            })
            .catch(err => {});
        })
        .catch(err => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erro ao tentar buscar matéria." });
        });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar buscar matéria." });
    });
};

/*
req.body.studentId
*/
exports.addStudent = (req, res) => {
  Subject.updateOne(
    {
      _id: ObjectID(req.params.subjectId)
    },
    {
      $push: {
        studentIds: ObjectID(req.body.studentId)
      }
    }
  )
    .then(() => {
      return res.json({ message: "Estudande matriculado com sucesso!" });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar matricular estudante na matéria." });
    });
};

exports.getTeacherSubjects = (req, res) => {
  Subject.find(
    {
      teacherId: ObjectID(req.session.user["_id"])
    },
    { campusId: 0 }
  )
    .then(subjects => {
      return res.send(subjects);
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar matérias do professor." });
    });
};

exports.getStudentSubjects = (req, res) => {
  Subject.find({ studentIds: ObjectID(req.session.user["_id"]) })
    .then(subjects => {
      return res.send(subjects);
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar matérias do estudante." });
    });
};
