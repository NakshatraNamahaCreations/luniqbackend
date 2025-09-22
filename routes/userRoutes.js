const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);       // Create
router.get("/", getUsers);          // Read All
router.get("/:id", getUserById);    // Read One
router.put("/:id", updateUser);     // Update
router.delete("/:id", deleteUser);  // Delete

module.exports = router;
