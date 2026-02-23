const User = require("../Model/userSchema");
const Post = require("../Model/postSchema");
const jwt = require("jsonwebtoken");
const jwtSecret = "thisIsMe!";

module.exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password, "$$$$$$$");
    const newUser = new User({
      name,
      email,
      password,
    });
    const savedUser = await newUser.save();

    res.status(201).redirect("/");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect("/");
    }

    if (password !== user.password) {
      return res.redirect("/");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //
    return res.redirect("/Feeds");
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
};

module.exports.userLogout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

module.exports.postBlog = async (req, res, next) => {
  try {
    console.log(req.body, "This is post blog controller");
    console.log(req.files, "This is file from post blog controller");

    const { caption } = req.body;
   const postUrls = req.files.map(file => file.filename);
    const userId = req.user.userId;
    // console.log(caption,userId,postUrl, "$$$$$$$");

    const newPost = new Post({
      postUrl:postUrls,
      caption,
      userId,
    });
    const savedPost = await newPost.save();

    res.redirect("/Dashboard");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports.feeds = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const skip = (page - 1) * limit;
  console.log(req.user.userId, "This is user from feeds controller");
  const totalPosts = await Post.countDocuments();

  const posts = await Post.find().sort({ date: -1 }).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalPosts / limit);

  res.render("Feeds", {
    posts,
    currentPage: page,
    totalPages,
    loggedInUserId: req.user.userId,
  });
};

module.exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const loggedInUserId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.redirect("/Feeds");
    }

    await Post.findByIdAndDelete(postId);

    res.redirect("/Feeds");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


module.exports.postUpdate= async (req,res)=>{
  try {
    const postId = req.params.id;
    const { caption } = req.body;

    const post = await Post.findById(postId);

    post.caption = caption;
    await post.save();

    res.redirect("/Feeds");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};