const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { hash, compare } = require("bcryptjs");
const { default: mongoose } = require("mongoose");

userRouter.post("/signup", async (req, res) => {
  try {
    if (req.body.password.length < 6)
      throw new Error("비밀번호를 6자 이상으로 해주세요.");
    if (req.body.username.length < 3)
      throw new Error("닉네임을 3자 이상으로 해주세요.");

    const hashedPassword = await hash(req.body.password, 10);

    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();

    const session = user.sessions[0];

    res.json({
      message: "user signup!!",
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    const isValid = await compare(req.body.password, user.password);

    if (!isValid) throw new Error("입력하신 정보가 올바르지 않습니다.");

    user.sessions.push({ createdAt: new Date() });

    const session = user.sessions[user.sessions.length - 1];

    await user.save();

    res.json({
      message: "user validated!!",
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user) throw new Error("invalid sessionid");

    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );

    res.json({ message: "user is logged out!!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me", (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    res.json({
      message: "success!!",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    });
  } catch (err) {
    console.error(err);
  }
});

userRouter.get("/me/images", async (req, res) => {
  try {
    const { lastId } = req.query;

    if (lastId && !mongoose.isValidObjectId(lastId))
      throw new Error("invalid lastId");
    if (!req.user) throw new Error("권한이 없습니다.");

    const posts = await Post.find(
      lastId
        ? {
            "user._id": req.user.id,
            public: false,
            _id: { $lt: lastId },
          }
        : {
            "user._id": req.user.id,
            public: false,
          }
    )
      .sort({ _id: -1 })
      .limit(20);

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.post("/searches", async (req, res) => {
  if (!req.user) return;
  try {
    const { place } = req.body;

    if (
      !place ||
      !place.id ||
      !place.title ||
      !place.position ||
      !place.address
    ) {
      throw new Error("잘못된 장소 정보입니다.");
    }

    const user = await User.findById(req.user._id);

    user.recentSearches = user.recentSearches.filter(
      (search) => search.place && search.place.id !== place.id
    );

    user.recentSearches.unshift({
      place: {
        id: place.id,
        position: {
          lat: place.position.lat,
          lng: place.position.lng,
        },
        title: place.title,
        address: place.address,
      },
      searchedAt: new Date(),
    });

    if (user.recentSearches.length > 10) {
      user.recentSearches.pop();
    }

    await user.save();

    res.json({
      message: "검색어 저장 완료",
      recentSearches: user.recentSearches,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/searches", async (req, res) => {
  try {
    if (!req.user) return;

    const user = await User.findById(req.user._id).select("recentSearches");

    res.json({ recentSearches: user.recentSearches });
  } catch (err) {
    console.error(err);
  }
});

userRouter.delete("/searches", async (req, res) => {
  try {
    if (!req.user) return;

    const { place } = req.body;

    const user = await User.findById(req.user._id);

    if (place) {
      user.recentSearches = user.recentSearches.filter(
        (search) => search.place && search.place.id !== place.id
      );
    }

    await user.save();

    res.json({
      message: "검색어가 삭제되었습니다.",
      recentSearches: user.recentSearches,
    });
  } catch (err) {
    console.error(err);
  }
});

userRouter.post("/searches/merge", async (req, res) => {
  if (!req.user) return;

  try {
    const { places } = req.body;

    if (!Array.isArray(places)) {
      throw new Error("유효하지 않은 병합 데이터입니다.");
    }

    const user = await User.findById(req.user._id);

    const existingIds = new Set(
      user.recentSearches.map((search) => search.place?.id)
    );

    const newSearches = places
      .filter(
        (place) =>
          place?.id && place?.title && place?.position && place?.address
      )
      .filter((place) => !existingIds.has(place.id))
      .map((place) => ({
        place: {
          id: place.id,
          position: {
            lat: place.position.lat,
            lng: place.position.lng,
          },
          title: place.title,
          address: place.address,
        },
        searchedAt: new Date(),
      }));

    const merged = [...newSearches, ...user.recentSearches]
      .sort(
        (a, b) =>
          new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime()
      )
      .slice(0, 10);

    user.recentSearches = merged;

    await user.save();

    res.json({
      message: "guest 검색어와 병합 완료",
      recentSearches: user.recentSearches,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };
