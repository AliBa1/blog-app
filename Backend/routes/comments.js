const { Router } = require("express");
const prisma = require("../prisma");
const router = Router();
const verifyToken = require("../middleware/verifyToken");
const { body, param, validationResult } = require("express-validator");

// read all comments
router.get("/", async (req, res) => {
  const comments = await prisma.comment.findMany();
  return res.send(comments);
});

// create comment
router.post(
  "/",
  verifyToken,
  [
    body("comment").trim().notEmpty().withMessage("A comment is required"),
    body("userId")
      .trim()
      .notEmpty()
      .withMessage("A user ID is required")
      .toInt()
      .isInt()
      .withMessage("User ID should be a number"),
    body("postId")
      .trim()
      .notEmpty()
      .withMessage("A post ID is required")
      .toInt()
      .isInt()
      .withMessage("Post ID should be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { comment, userId, postId } = req.body;
      const createdComment = await prisma.comment.create({
        data: {
          comment: comment,
          userId: userId,
          postId: postId,
        },
      });
      return res.status(201).json({
        message: "Comment created successfully.",
        comment: createdComment,
      });
    } catch (error) {
      console.error("Error creating comment: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// read comment
router.get(
  "/:commentId",
  [
    param("commentId")
      .trim()
      .notEmpty()
      .withMessage("A comment ID is required")
      .toInt()
      .isInt()
      .withMessage("Comment ID should be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const commentId = Number(req.params.commentId);
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
        },
      });
      if (!comment) {
        return res.status(404).json({ error: "The commment does not exist" });
      }
      res.json(comment);
    } catch (error) {
      console.error("Error reading comment: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// delete comment
router.delete(
  "/:commentId",
  verifyToken,
  [
    param("commentId")
      .trim()
      .notEmpty()
      .withMessage("A comment ID is required")
      .toInt()
      .isInt()
      .withMessage("Comment ID should be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const commentId = Number(req.params.commentId);
    try {
      const deletedComment = await prisma.comment.delete({
        where: { id: commentId },
      });
      if (!deletedComment) {
        return res.status(400).json({ error: "This comment does not exist" });
      }
      res.status(200).json({
        message: "Successfully deleted comment",
        comment: deletedComment,
      });
    } catch (error) {
      console.error("Error deleting comment: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

module.exports = router;
