const { Router } = require("express");
const prisma = require("../prisma");
const router = Router();
const verifyToken = require("../middleware/verifyToken");
const { body, param, validationResult } = require("express-validator");

// create post
router.post(
  "/",
  verifyToken,
  [
    body("title").trim().notEmpty().withMessage("A title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("published").isBoolean(),
    body("authorId")
      .trim()
      .notEmpty()
      .withMessage("Author ID is missing")
      .toInt()
      .isInt()
      .withMessage("Author ID should be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, published, authorId } = req.body;
    try {
      const existingTitle = await prisma.post.findFirst({
        where: { title: title },
      });
      if (existingTitle) {
        return res.status(400).json({ error: "Title must be unique" });
      }

      const existingContent = await prisma.post.findFirst({
        where: { content: content },
      });
      if (existingContent) {
        return res.status(400).json({ error: "Content must be unique" });
      }

      const post = await prisma.post.create({
        data: {
          title: title,
          content: content,
          published: published,
          authorId: authorId,
        },
      });
      res
        .status(201)
        .json({ message: "Post created successfully.", post: post });
    } catch (error) {
      console.error("Error creating post: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// read post
router.get(
  "/:postId",
  [
    param("postId")
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

    const postId = Number(req.params.postId);
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
      if (!post) {
        return res.status(400).json({ error: "This post does not exist" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error getting post: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// read all posts
router.get("/", async (req, res) => {
  try {
    // const posts = await prisma.post.findMany();
    console.log("1 works");

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        comments: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("2 works");

    res.json(posts);

    console.log("3 works");
  } catch (error) {
    console.error("Error getting posts: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// read post comments
router.get(
  "/:postId/comments",
  [
    param("postId")
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

    const postId = Number(req.params.postId);
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                },
              },
            },
          },
        },
      });
      if (!post) {
        return res.status(400).json({ error: "This post does not exist" });
      }
      const postComments = post["comments"];
      res.json(postComments);
    } catch (error) {
      console.error("Error getting post comments: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// update post
router.put(
  "/:postId",
  verifyToken,
  [
    param("postId")
      .trim()
      .notEmpty()
      .withMessage("A post ID is required")
      .toInt()
      .isInt()
      .withMessage("Post ID should be a number"),
    body("title").trim().notEmpty().withMessage("A title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("published")
      .isBoolean()
      .notEmpty()
      .withMessage("Published is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postId = Number(req.params.postId);
    const { title, content, published } = req.body;
    try {
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          title: title,
          content: content,
          published: published,
        },
      });
      if (!updatedPost) {
        return res.status(400).json({ error: "This post does not exist" });
      }
      res
        .status(200)
        .json({ message: "Successfully updated post", post: updatedPost });
    } catch (error) {
      console.error("Error updating post: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// delete post
router.delete(
  "/:postId",
  verifyToken,
  [
    param("postId")
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

    const postId = Number(req.params.postId);
    try {
      const deletedPost = await prisma.post.delete({
        where: { id: postId },
      });
      if (!deletedPost) {
        return res.status(400).json({ error: "This post does not exist" });
      }
      res
        .status(200)
        .json({ message: "Successfully deleted post", post: deletedPost });
    } catch (error) {
      console.error("Error deleting post: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

module.exports = router;
