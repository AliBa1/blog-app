const { Router } = require("express");
const prisma = require("../prisma");
const router = Router();
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const { body, validationResult } = require("express-validator");

// read all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.send(users);
});

// create a user
router.post(
  "/register",
  [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First Name is required")
      .customSanitizer(
        (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
      ),
    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last Name is required")
      .customSanitizer(
        (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
      ),
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password needs to be more than 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[A-Z]/)
      .withMessage("Password must have an uppercase letter"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is required")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords don't match"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const {firstName, lastName, username, password, confirmPassword} = req.body;
    const { firstName, lastName, username, password } = req.body;

    try {
      const passwordHashed = await bcypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          username: username,
          password: passwordHashed,
        },
      });
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" },
      );
      return res
        .status(201)
        .json({
          message: "User created successfully.",
          token,
          userId: user.id,
        });
    } catch (error) {
      if (error.code == "P2002") {
        return res.status(400).json({ error: "Username already exists. " });
      } else {
        console.error("Error creating user: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  },
);

// login to user
router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });
      if (!user) {
        return res.status(401).json({ error: "User doesn't exist" });
      }

      const passwordCorrect = await bcypt.compare(password, user.password);
      if (!passwordCorrect) {
        return res.status(401).json({ error: "Password is incorrect" });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" },
      );

      res.json({ message: "Login Successful.", token, userId: user.id });
    } catch (error) {
      console.error("Error logging in user: ", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// logout user
// remove token and userId from local storage. function in frontend

// test protected routes
router.get("/protect", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
});

// authenticate
router.get("/authenticate", verifyToken, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});

// read user
router.get("/:username", verifyToken, async (req, res) => {
  const username = req.params.username;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "The user your trying to request does not exist" });
    }
    const userWithoutPassword = exclude(user, ["password"]);

    res.json(userWithoutPassword);
  } catch (error) {
    console.error(
      `Error getting user with username ${username}: `,
      error.message,
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// read user posts
router.get("/:userId/posts", verifyToken, async (req, res) => {
  const userId = Number(req.params.userId);
  try {
    if (!userId) {
      return res.status(400).send({ error: "Could not get user" });
    }
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { posts: true },
    // });
    // const userPosts = user["posts"];

    const userPosts = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    res.json(userPosts);
  } catch (error) {
    console.error("Error getting user posts: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
}
module.exports = router;
