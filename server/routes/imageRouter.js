const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const { s3, getSignedUrl } = require("../aws");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

// const fileUnlink = promisify(fs.unlink);

imageRouter.post("/presigned", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    const { contentTypes } = req.body;

    if (!Array.isArray(contentTypes)) throw new Error("invalid contentTypes");

    const presignedData = await Promise.all(
      contentTypes.map(async (contentType) => {
        const imageKey = `${uuid()}.${mime.extension(contentType)}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl({ key });
        return { imageKey, presigned };
      })
    );

    res.json(presignedData);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.post("/", upload.array("image", 5), async (req, res) => {
  try {
    if (!req.user) throw new Error("로그인 후 이용해주세요.");
    const { images, public } = req.body;

    const imageDocs = await Promise.all(
      images.map((image) =>
        new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public,
          key: image.imageKey,
          originalFileName: image.originalname,
        }).save()
      )
    );

    res.json(imageDocs);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: res.message });
  }
});

// imageRouter.post("/", upload.array("image", 5), async (req, res) => {
//   try {
//     if (!req.user) throw new Error("로그인 후 이용해주세요.");
//     const images = await Promise.all(
//       req.files.map(async (file) => {
//         const image = await new Image({
//           user: {
//             _id: req.user.id,
//             name: req.user.name,
//             username: req.user.username,
//           },
//           public: req.body.public,
//           key: file.key.replace("raw/", ""),
//           originalFileName: file.originalname,
//         }).save();

//         return image;
//       })
//     );

//     res.json(images);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: res.message });
//   }
// });

imageRouter.get("/", async (req, res) => {
  try {
    const { lastId } = req.query;

    if (lastId && !mongoose.isValidObjectId(lastId))
      throw new Error("invalid lastId");

    const images = await Image.find(
      lastId ? { public: true, _id: { $lt: lastId } } : { public: true }
    )
      .sort({ _id: -1 })
      .limit(20);

    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!mongoose.isValidObjectId(imageId))
      throw new Error("올바르지 않는 imageId입니다.");

    const image = await Image.findOne({ _id: imageId });

    if (!image) throw new Error("해당 이미지는 존재하지 않습니다.");

    // if (!image.public && (!req.user || req.user.id !== image.user.id))
    //   throw new Error("권한이 없습니다.");

    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 imageId입니다.");

    const image = await Image.findOneAndDelete({
      _id: req.params.imageId,
    });

    if (!image) return res.json({ message: "이미 삭제된 이미지 입니다." });

    // await fileUnlink(`./uploads/${image.key}`);
    const deleteCommand = new DeleteObjectCommand({
      Bucket: "in-ourmoments",
      Key: `raw/${image.key}`,
    });

    await s3.send(deleteCommand);

    res.json({ message: "요청하신 이미지가 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: res.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 imageId입니다.");

    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );

    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: res.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 imageId입니다.");

    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );

    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: res.message });
  }
});

module.exports = { imageRouter };
