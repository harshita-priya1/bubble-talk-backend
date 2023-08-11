const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const Post = require("../../models/postSchema.js");
const upload = multer();
require("dotenv").config();
const User = require("../../models/Users");
// Route to handle image uploads and create a new post
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    const { description, userID } = req.body;
    // console.log(req.body);
    let imageBuffer = null;
    let newPost = new Post();
    if (req.file != undefined || null) {
      imageBuffer = await sharp(req.file.buffer)
        .resize(500, 500) // Optional: Resize the image to a specific size
        .toBuffer();

      newPost = new Post({
        image: {
          data: imageBuffer,
          contentType: req.file.mimetype,
        },
        description,
        creator: req.user,
      });
    }
    newPost.description = description;
    await User.findOne({ _id: userID })
      .then((user) => {
        newPost.creator = user;
        newPost.creatorName = user.name;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(newPost);
    await newPost.save();

    res.send("Post created successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating post.", error: err });
  }
});

// Route to fetch all posts
router.get("/fetchPosts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // If not provided, default to page 1
    const pageSize = 10; // Number of posts per page
    const totalPosts = await Post.countDocuments();

    const totalPages = Math.ceil(totalPosts / pageSize);
    const skipPosts = (page - 1) * pageSize;
    // console.log(page, pageSize, totalPosts, totalPages, skipPosts);
    const posts = await Post.find()
      .sort({ date: -1 }) // Sort posts by descending order of date
      .skip(skipPosts)
      .limit(pageSize);
    // console.log(posts);
    res.json({
      posts,
      currentPage: page,
      totalPages,
      pageSize,
      totalPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const userID = req.body.userID;
    const postID = req.body.postID;
    // console.log(userID, postID);
    const post = await Post.findById(postID);
    creatorID = post.creator;
    if (userID === post.creator._id.toString()) {
      const deletedPost = await Post.findByIdAndDelete(postID);
      res.status(200).json({
        message: "Post Deleted Successfully",
        data: deletedPost,
        status: 200,
      });
    } else {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", data: error });
  }
});

router.get("/fetchUserPosts", async (req, res) => {
  try {
    const userID = req.query.userID;
    const page = parseInt(req.query.page) || 1; // If not provided, default to page 1
    const pageSize = 10; // Number of posts per page
    const totalPosts = await Post.countDocuments({ creator: userID });

    const totalPages = Math.ceil(totalPosts / pageSize);
    const skipPosts = (page - 1) * pageSize;
    // console.log(page, pageSize, totalPosts, totalPages, skipPosts);
    const posts = await Post.find({ creator: userID })
      .sort({ date: -1 }) // Sort posts by descending order of date
      .skip(skipPosts)
      .limit(pageSize);
    // console.log(posts);
    res.json({
      posts,
      currentPage: page,
      totalPages,
      pageSize,
      totalPosts,
    });
    // const posts = await Post.find({ creator: userID });
    // res
    //   .status(200)
    //   .json({ message: "Posts fetched successfully", data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", data: error });
  }
});

module.exports = router;
