const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("유효하지 않은 파일 형식 입니다."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 파일 크기 제한 (최대 5MB)
  },
});

module.exports = { upload };
