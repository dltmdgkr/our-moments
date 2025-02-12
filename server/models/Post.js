const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  key: { type: String, required: true },
  originalFileName: { type: String, required: true },
});

const PostSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true, index: true },
      name: { type: String, required: true },
      username: { type: String, required: true },
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: Object, required: true },
    images: [ImageSchema],
    likes: [{ type: mongoose.Types.ObjectId }],
    public: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
