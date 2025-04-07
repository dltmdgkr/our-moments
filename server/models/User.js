const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    position: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    title: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessions: [
      {
        createdAt: { type: Date, required: true },
      },
    ],
    recentSearches: [
      {
        place: { type: PlaceSchema },
        searchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserSchema);
