const { Router } = require("express");
const postRouter = Router();
const Post = require("../models/Post");
const { upload } = require("../middleware/imageUpload");
const mongoose = require("mongoose");
const { s3, getSignedUrl } = require("../aws");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

postRouter.post("/presigned", async (req, res) => {
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

postRouter.post("/", async (req, res) => {
  try {
    if (!req.user) throw new Error("로그인 후 이용해주세요.");
    const { images, title, description, location, position, public } = req.body;

    if (!Array.isArray(images) || images.length === 0)
      throw new Error("이미지를 업로드해야 합니다.");

    const post = new Post({
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      title,
      description,
      location,
      position,
      public,
      images: images.map((image) => ({
        key: image.imageKey,
        originalFileName: image.originalname,
      })),
    });

    await post.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const { lastId, all } = req.query;

    if (lastId && !mongoose.isValidObjectId(lastId))
      throw new Error("invalid lastId");

    let query = { public: true };
    if (lastId) {
      query = { ...query, _id: { $lt: lastId } };
    }

    let postsQuery = Post.find(query).sort({ _id: -1 });

    if (!all) {
      postsQuery = postsQuery.limit(12);
    }

    const posts = await postsQuery;

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

postRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId))
      throw new Error("올바르지 않는 postId입니다.");

    const post = await Post.findOne({ _id: postId });

    if (!post) throw new Error("해당 게시글은 존재하지 않습니다.");

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

postRouter.post("/:postId", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(req.params.postId))
      throw new Error("올바르지 않은 postId입니다.");

    const { title, description, location, position, images, public } = req.body;

    const post = await Post.findById(postId);
    if (!post) throw new Error("게시글을 찾을 수 없습니다.");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
        location,
        position,
        images: images.map((image) => ({
          key: image.imageKey,
          originalFileName: image.originalname,
        })),
        public,
      },
      { new: true }
    );

    res.json({ message: "게시글이 수정되었습니다.", post: updatedPost });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

postRouter.delete("/:postId", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.postId))
      throw new Error("올바르지 않은 postId입니다.");

    const post = await Post.findOneAndDelete({ _id: req.params.postId });

    if (!post) return res.json({ message: "이미 삭제된 게시글입니다." });

    await Promise.all(
      post.images.map((image) => {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: "in-ourmoments",
          Key: `raw/${image.key}`,
        });
        return s3.send(deleteCommand);
      })
    );

    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

postRouter.patch("/:postId/like", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.postId))
      throw new Error("올바르지 않은 postId입니다.");

    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

postRouter.patch("/:postId/unlike", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.postId))
      throw new Error("올바르지 않은 postId입니다.");

    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { postRouter };
