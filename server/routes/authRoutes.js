import express from "express";
const router = express.Router();
import cors from "cors";

const {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/authController.js");

router.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: "http://localhost:3000",
  })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.get("/logout", logoutUser);

export default router;
