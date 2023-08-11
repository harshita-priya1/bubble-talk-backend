const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  image: {
    data: Buffer, // Store the image data as Buffer
    contentType: String, // Store the content type (e.g., image/jpeg, image/png)
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Add more necessary fields here if required
});

module.exports = mongoose.model("Post", postSchema);
