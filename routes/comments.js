const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

//db의 댓글 전체 목록 불러오기//
router.get("/posts/:title/comments", async (req, res) => {
    const comments = await Comment.find({})
    //db의 댓글 데이터 중 표출 데이터 선정//
    const commentList = comments.map((comment) => {
        //db의 오브젝트 아이디를 문자열로 변환//
        commentId = String(comment._id)
        return {
            "commentId": commentId,
            "user": comment.user,
            "content": comment.content,
            "day": comment.day,
        }
    })
    res.send({ commentList });
});

//댓글 형성//
router.post("/posts/:title/comments", async (req, res) => {
    //body에서 데이터 받음//
    const { title } = req.params;
    const { content, user, password } = req.body;
    //작성 시간 설정//
    const day = new Date();
    //중복 아이디 확인 있다면 else로 없다면 if 구문//
    const existsUser = await Comment.find({ user });
    if (existsUser.length === 0) {
        //데이터를 작성했는지 확인//
        if (user) {
            //데이터를 작성했는지 확인//
            if (content) {
                //데이터를 작성했는지 확인//
                if (password) {
                    //데이터를 작성했는지 확인//
                    await Comment.create({ content, user, password, day, title });
                    res.json({ message: "댓글을 생성하였습니다." })
                } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
            } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
        } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
    } else { return res.status(400).json({ message: "이미 존재하는 user입니다." }) }
}
);

//댓글 데이터 수정//
router.put("/posts/:title/comments/:id", async (req, res) => {
    id = req.params.id;
    //body에서 데이터 받음//
    const { content, password } = req.body;
    //url의 title이 있는지 확인//
    const [existsComment] = await Comment.find({ _id: Object(id) });

    if (existsComment) {
        //데이터를 작성했는지 확인//
        if (content) {
            //비밀번호를 제대로 작성했는지 확인//
            if (existsComment.password != password) {
                return res.status(400).json({ message: "데이터형식을 확인해주세요" })
            } else {
                await Comment.updateOne({ _id: Object(id) }, { $set: { content } })
            }
        } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
    } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
    res.json({ message: "게시글을 수정하였습니다." })

})

//게시글 삭제//
router.delete("/posts/:title/comments/:id", async (req, res) => {
    id = req.params.id;
    //body에서 데이터 받음//
    const { password } = req.body;
    //url의 title이 있는지 확인//
    const [existsComment] = await Comment.find({ _id: Object(id) });

    //url의 title이 없다면 else로 있다면 if구문//
    if (existsComment) {
        //비밀번호를 제대로 작성했는지 확인//
        if (existsComment.password != password) {
            return res.status(400).json({ message: "데이터형식을 확인해주세요" })
        } else { await Comment.deleteOne({ _id: Object(id) }) }
    } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
    res.json({ message: "게시글을 삭제해였습니다." });
});

module.exports = router;