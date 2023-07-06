const multer = require("multer");

const storage = multer.diskStorage({});

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type"));
//   }
// };

// const limits = {
//   fileSize: 1 * 1024 * 1024,
// };

const upload = multer({ storage });

module.exports = upload;
