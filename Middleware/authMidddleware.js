module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  const jwtSecret = "thisIsMe!";

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
      
    });
  }
};

const jwt = require("jsonwebtoken");
