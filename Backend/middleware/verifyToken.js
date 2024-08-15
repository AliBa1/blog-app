const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Access denied. Token is not provided" });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = tokenDecoded;
    next();
  } catch (error) {
    console.error("Error verifying token: ", error.message);
    return res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = verifyToken;
