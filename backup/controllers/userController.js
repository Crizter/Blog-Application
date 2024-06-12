import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../../models/user.models.js";
import { JWT_SECRET } from "../index.js";

// User registration
const register = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10); // Hash the password before saving
    const newUser = new User(req.body);
    await newUser.save();
    newUser.password = undefined; // Do not return the password hash
    return res.json(newUser);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Wrong password." });
    }
    const payload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ message: "Login successful", token });
  } catch (error) {
    return res.status(400).json({ message: err.message });
  }
};

const profile = async (req, res) => {
  if (req.user) {
    res.render("user/profile", { user: req.user });
  } else {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const logout = async (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
    console.log({ message: "Logged out successfully" });
  });
};

export { register, login, profile, logout };
