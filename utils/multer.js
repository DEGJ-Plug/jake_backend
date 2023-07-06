const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {};

const limits = 4 * 1024 * 1024;

const upload = multer({ storage, fileFilter, limits });
