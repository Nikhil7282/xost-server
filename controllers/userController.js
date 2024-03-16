import { compare, hash } from "../config/bcrypt.js";
import { generateToken } from "../config/generateToken.js";
import User from "../models/userSchema.js";

const getUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

const signUpUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(401).json({ message: "User already exists" });
    }
    const hashedPassword = await hash(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });
    if (newUser) {
      return res
        .status(201)
        .json({ user: newUser, token: generateToken(newUser._id) });
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

const loginUser = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }
    // console.log(user);
    const result = await compare(password, user.password);
    // console.log(result);
    if (!result) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
      return res.status(200).json({
        message: "User Login SuccessFul",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
        },
        token: generateToken(user.id),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error: error });
  }
};

export { getUser, signUpUser, loginUser };
