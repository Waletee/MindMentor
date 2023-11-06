const {
  register,
  login,
  getAllUsers,
  getUser,
  accountSettings,
  accountDelete,
  followUser,
  unFollowUser,
} = require("../controllers/users.controller");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads", "profile-pictures"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:userId", getAllUsers);
router.get("/user/:id", getUser);
router.put(
  "/accountsettings/:userId",
  upload.single("profilePicture"),
  accountSettings
);
router.delete("/accountdelete/:userId", accountDelete);
router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unFollowUser);

module.exports = router;
