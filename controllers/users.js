const User = require("../models/user");
const Subject = require("../models/subject");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const randstr = require("randomstring");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

exports.checkDuplicate = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user != null) {
        return res
          .status(500)
          .json({ message: "O usuário já possui uma conta." });
      }
      return next();
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar procurar usuário no servidor." });
    });
};

// req.body.email, req.body.name, req.body.password, req.body.level
//temporary
exports.createUser = (req, res, next) => {
  return bcrypt
    .hash(req.body.password, parseInt(process.env.HASH_SALT_ROUNDS))
    .then((hashedPass) => {
      const user = new User(
        req.body.name,
        req.body.email,
        hashedPass,
        3,
        randstr.generate(12)
      );
      user
        .save()
        .then(() => {
          res.locals.user = user;
          return fs.mkdir(
            path.join(__dirname, "..", "uploads", user.email),
            (err) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Erro ao tentar adicionar usuário." });
              } else {
                return next();
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erro ao tentar adicionar usuário." });
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar adicionar usuário." });
    });
};

/*
req.body.name, req.body.email, req.body.password, req.body.confPassword, req.session.user["campusId"]
*/
exports.createTeacher = (req, res) => {
  return bcrypt
    .hash(req.body.password, parseInt(process.env.HASH_SALT_ROUNDS))
    .then((hashedPass) => {
      const teacher = new User(
        req.body.name,
        req.body.email,
        hashedPass,
        2,
        req.session.user["campusId"]
      );
      teacher
        .save()
        .then(() => {
          return fs.mkdir(
            path.join(__dirname, "..", "uploads", teacher.email),
            (err) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Erro ao tentar adicionar usuário." });
              } else {
                return res.json({
                  message: "Professor adicionado com sucesso.",
                });
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erro ao tentar adicionar professor." });
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar adicionar professor." });
    });
};

// req.body.name, req.body.email, req.body.password, req.body.confPassword, req.session.user["campusId"]
exports.createStudent = (req, res) => {
  return bcrypt
    .hash(req.body.password, parseInt(process.env.HASH_SALT_ROUNDS))
    .then((hashedPass) => {
      const student = new User(
        req.body.name,
        req.body.email,
        hashedPass,
        1,
        req.session.user["campusId"]
      );
      student
        .save()
        .then(() => {
          return fs.mkdir(
            path.join(__dirname, "..", "uploads", student.email),
            (err) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Erro ao tentar adicionar usuário." });
              } else {
                return res.json({ message: "Aluno adicionado com sucesso." });
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erro ao tentar adicionar aluno." });
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar adicionar aluno." });
    });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    return res.redirect("/");
  });
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user == null) return res.redirect("/auth/login");
      return bcrypt
        .compare(req.body.password, user.password)
        .then((match) => {
          if (match == true) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            switch (user.level) {
              case 1:
                return res.redirect("/student");
              case 2:
                return res.redirect("/teacher");
              case 3:
                return res.redirect("/coordinator");
            }
          } else return res.status(401).redirect("/login");
        })
        .catch(() => {
          return res
            .status(500)
            .json({ message: "Erro ao tentar realizar login." });
        });
    })
    .catch(() => {
      return res
        .status(500)
        .json({ message: "Erro ao tentar realizar login." });
    });
};

/*
req.session.user["campusId"] 
*/
exports.getTeachersFromCampus = (req, res) => {
  User.find(
    { campusId: req.session.user["campusId"], level: 2 },
    { level: 0, password: 0 }
  )
    .then((teachers) => {
      return res.send(teachers);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar professores." });
    });
};

/*
req.session.user["campusId"]
*/
exports.getStudentsFromCampus = (req, res) => {
  User.find(
    { campusId: req.session.user["campusId"], level: 1 },
    { level: 0, password: 0 }
  )
    .then((students) => {
      return res.send(students);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar estudantes." });
    });
};

exports.getStudentsFromSubject = (req, res) => {
  Subject.findOne({ _id: ObjectID(req.params.subjectId) })
    .then((subject) => {
      var studentsIds = [];
      subject.studentIds.forEach((id) => {
        studentsIds.push(ObjectID(id));
      });
      if (req.params.mode == "in") {
        User.find(
          { _id: { $in: studentsIds } },
          { password: 0, level: 0, campusId: 0 }
        )
          .then((students) => {
            return res.send(students);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message: "Erro ao tentar listar estudantes da matéria.",
            });
          });
      } else if (req.params.mode == "nin") {
        User.find(
          { _id: { $nin: studentsIds }, level: 1 },
          { password: 0, level: 0, campusId: 0 }
        )
          .then((students) => {
            return res.send(students);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message: "Erro ao tentar listar estudantes da matéria.",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao tentar listar estudantes da matéria." });
    });
};

// /coordinator/getnonregisteredstudents/:subjectId
exports.getNonRegisteredStudents = (req, res) => {
  Subject.findOne({ _id: req.params.subjectId })
    .then((subject) => {
      User.find({ _id: { $nin: subject.studentIds } })
        .then((students) => {
          return res.send(students);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            message:
              "Erro ao tentar listar alunos não matriculados na matéria.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Erro ao tentar listar alunos não matriculados na matéria.",
      });
    });
};

//req.params.teacherId
exports.getTeacherInfo = (req, res) => {
  User.findOne({ _id: ObjectID(req.params.teacherId) })
    .then((teacher) => {
      if (teacher == null) {
        return res.status(500).json({ message: "Professor não encontrado." });
      } else {
        Subject.find({ teacherId: ObjectID(teacher._id) }, { studentIds: 0 })
          .then((subjects) => {
            return res.send({ teacher: teacher, subjects: subjects });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message:
                "Erro ao tentar listar matérias do professor selecionado.",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message:
          "Erro ao tentar retornar informações sobre o professor selecionado.",
      });
    });
};

//req.params.studentId
exports.getStudentInfo = (req, res) => {
  User.findOne({ _id: ObjectID(req.params.studentId) })
    .then((student) => {
      Subject.find(
        { studentIds: student._id },
        { campusId: 0, teacherId: 0, studentIds: 0 }
      )
        .then((subjects) => {
          return res.send({ student: student, subjects: subjects });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            message: "Erro ao tentar retornar matérias do aluno selecionado.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message:
          "Erro ao tentar retornar informações sobre o aluno selecionado.",
      });
    });
};

//req.params.studentId
exports.deleteStudent = (req, res) => {
  User.remove({ _id: ObjectID(req.params.studentId), level: 1 })
    .then((result) => {
      return res.send({ message: "Aluno excluído com sucesso." });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Erro ao tentar excluir aluno selecionado.",
      });
    });
};

//req.params.teacherId
exports.deleteTeacher = (req, res) => {
  User.remove({ _id: ObjectID(req.params.teacherId), level: 2 })
    .then((result) => {
      return res.send({ message: "Professor excluído com sucesso." });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Erro ao tentar excluir professor selecionado.",
      });
    });
};
