const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

router.get("/posts", async (req, res) => {
  const posts = await Post.find({})
  const postList = posts.map((post) => {
    postId = String(post._id)
    return {
      "postId": postId,
      "title": post.title,
      "user": post.user,
      "day": post.day,
    }
  })
  res.send({ postList });
});

router.get("/posts/:title", async (req, res) => {
  const posts = await Post.find({});
  const { title } = req.params;
  const search = posts.filter((posts) => posts.title === String(title));
  if (search.length) {
    const searchReslut = search.map((search) => {
      return {
        "title": search.title,
        "content": search.content,
        "user": search.user,
        "day": search.day
      }
    })
    res.json({ searchReslut });
  } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
});


router.post("/posts", async (req, res) => {
  const { title, content, user, password } = req.body;
  const day = new Date();
  const existsUser = await Post.find({ user });
  if (existsUser.length === 0) {
    if (title) {
      if (content) {
        if (user) {
          if (password) {
            await Post.create({ title, content, user, password, day });
            res.json({ message: "게시판을 생성하였습니다." })
          } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
        } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
      } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
    } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
  }else{ return res.status(400).json({ message: "이미 존재하는 user입니다." })}
}
);

router.put("/posts/:title", async (req, res) => {
  const { title } = req.params;
  const { content, password } = req.body;

  const [existsPost] = await Post.find({ title: String(title) });

  if (existsPost) {
    if (content) {
      if (existsPost.password != password) {
        return res.status(400).json({ message: "데이터형식을 확인해주세요" })
      } else {
        await Post.updateOne({ title: String(title) }, { $set: { content } })
      }
    } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
  } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
  res.json({ message: "게시글을 수정하였습니다." })
})

router.delete("/posts/:title", async (req, res) => {
  const { title } = req.params;
  const { password } = req.body;

  const [existsPost] = await Post.find({ title: String(title) });

  if (existsPost) {
    if (existsPost.password != password) {
      return res.status(400).json({ message: "데이터형식을 확인해주세요" })
    } else { await Post.deleteOne({ title }) }
  } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
  res.json({ message: "게시글을 삭제해였습니다." });
})


module.exports = router;