const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./DBConfig/Config");
const AuthMiddleware = require("./Middleware/authMidddleware");
const cookieParser = require("cookie-parser");
const {feeds} = require("./Controller/userControllers");
app.use(cookieParser());
const path = require("path");
app.use(express.static(path.join(__dirname, "Public")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "View"));

const PORT = 3000;

connectDB();



app.get("/", (req, res) => {
  res.render("Login");
});

app.get("/signup", (req, res) => res.render("Signup"));

app.get("/Dashboard", AuthMiddleware.verifyToken, (req, res) => {
  res.render("Dashboard");
});

app.get("/Feeds", AuthMiddleware.verifyToken, feeds, (req, res) => {
  res.render("Feeds");
});



app.use("/", require("./Routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
