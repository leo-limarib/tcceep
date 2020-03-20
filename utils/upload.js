const multer = require("multer");
const path = require("path");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/${req.session.user["email"]}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).fields([{ name: "input_file", maxCount: 1 }]);

module.exports = upload;
