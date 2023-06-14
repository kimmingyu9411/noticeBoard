const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  board:{
    type:Number,
    required: true,
    unique: true
  },
  user: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type:   Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Post", postSchema);