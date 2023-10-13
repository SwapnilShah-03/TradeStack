import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
const test = (req, res) => {
  res.json("Test is working!");
};

const registerUser = async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const {
      username,
      email,
      password,
      age,
      gender,
      nationality,
      address,
      phone,
    } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ message: "Username is already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ message: "Email is already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      age,
      gender,
      nationality,
      address,
      phone,
    });
    delete newUser.password;
    const portfolio = await Portfolio.create({
      userName: username,
      stocks: [],
      investment: 0,
      balance: 200000,
    });

    const transactions = await Transaction.create({
      userName: username,
      trades: [],
    });
    return res.json({ status: true, newUser });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const isMatching = await bcrypt.compare(password, user.password);
      if (isMatching) {
        jwt.sign(
          { id: user._id, username: user.username, email: user.email },
          process.env.JWT_SECRET,
          {},
          (err, token) => {
            if (err) throw err;
            res
              .cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
              })
              .json({ status: true, user });
          }
        );
      } else {
        return res.json({
          message: "Username or password is incorrect",
          status: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  console.log("Cookie deleted");
  res.json({ message: "Logged out", status: true });
};
export { test, registerUser, loginUser, getProfile, logoutUser };
