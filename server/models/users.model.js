const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      min: 6,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    profession: {
      type: String,
    },
    state_country: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profilePicture: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    followers: [],
    following: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
