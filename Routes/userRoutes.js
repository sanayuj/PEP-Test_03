const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../Middleware/authMidddleware");
const multer = require("../Middleware/Multer");
const {
  signup,
  login,
  postBlog,
  userLogout,
  feeds,
  deletePost,
  postUpdate
} = require("../Controller/userControllers");

router.post("/signup", signup);
router.post("/login", login);
router.post(
  "/postBlog",
  AuthMiddleware.verifyToken,
  multer.array("image", 6),
  postBlog,
);
router.get("/logout", userLogout);
router.get("/Feeds", AuthMiddleware.verifyToken, feeds);
router.post("/deletePost/:id", AuthMiddleware.verifyToken,deletePost);
router.post("/updatePost/:id", AuthMiddleware.verifyToken,postUpdate);

module.exports = router;
