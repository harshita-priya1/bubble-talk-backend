const User = require("../models/Users");

exports.searchUsers = async (req, res, next) => {
  let { query } = req.query;

  query = String(query);

  try {
    // Perform case-insensitive partial matching using $regex
    const users = await User.find({
      name: { $regex: query, $options: "i" },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ error: "Failed to search users." });
  }
};
