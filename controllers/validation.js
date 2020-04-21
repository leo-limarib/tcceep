const ObjectID = require("mongodb").ObjectID;

exports.validatePassword = (password, confPassword) => {
  return (req, res, next) => {
    if (req.body[password].length > 0 && req.body[password].length < 32) {
      if (req.body[password] == req.body[confPassword]) {
        return next();
      } else {
        return res.status(500).json({ message: "As senhas não são iguais." });
      }
    } else {
      return res.status(500).json({ message: "Senha inválida." });
    }
  };
};

exports.validateId = (id) => {
  return (req, res, next) => {
    if (ObjectID.isValid(req.body[id]) || ObjectID.isValid(req.params[id])) {
      return next();
    } else {
      return res
        .status(500)
        .json({ message: "Preencha os campos obrigatórios, por favor." });
    }
  };
};

exports.validateEmail = (email) => {
  return (req, res, next) => {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (req.body[email].match(mailFormat)) {
      return next();
    } else {
      return res.status(500).json({ message: "Email inválido." });
    }
  };
};

exports.validateName = (name) => {
  return (req, res, next) => {
    if (req.body[name].length > 0 && req.body[name].length < 32) {
      return next();
    } else {
      return res.status(500).json({ message: "Nome inválido." });
    }
  };
};
