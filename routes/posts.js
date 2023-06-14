const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

router.get("/posts", async (req, res) => {
  const posts = await Post.find({})
  const postList = posts.map((post) => {
    return {
      "title": post.title,
      "user": post.user,
      "day": post.day,
    }
  })
  res.send({ postList });
});

router.get("/posts/:board", async (req, res) => {
  const posts = await Post.find({})
  const { board } = req.params;
  const search = posts.filter((posts) => posts.board === Number(board));
  const searchReslut = search.map((search) => {
    return {
      "title": search.title,
      "content": search.content,
      "user": search.user,
      "day": search.day
    }
  })
  res.json({ searchReslut });
});


router.post("/posts", async (req, res) => {
  const { title, content, user, password, day, board } = req.body;

  const createdpost = await Post.create({ title, content, user, password, day, board });

  res.json({ post: createdpost });
});

router.put("/posts/:board", async (req, res) => {
  const { board } = req.params;
  const { content } = req.body;

  const existPost = await Post.find({ board });
  console.log(typeof board)
  console.log(typeof existPost)
  if (existPost.indexOf(board)) {
    await Post.updateOne({ board: Number(board) }, { $set: { content } });
  }

  res.status(200).json({ success: true })
})

router.delete("/posts/:board", async (req, res) => {
  const { board } = req.params;

  const existPost = await Post.find({ board });
  if (existPost.indexOf(board)) {
    await Post.deleteOne({ board  });
  }
  res.json({ result: "success" });
})


module.exports = router;