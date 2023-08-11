const jwt = require("jsonwebtoken");
const User = require("../models/Users");
require("dotenv").config();

//TODO: Expiration check

const protect = async (req, res, next) => {
  let token;
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // console.log("inside try");
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      req.user = await User.findById(decoded.userId);
      next();
    } catch (error) {
      res.status(401);
      console.log(error);
    }
  }

  if (!token) {
    res.status(401);
  }
};

module.exports = protect;
