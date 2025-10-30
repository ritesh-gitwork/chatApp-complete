import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Enter all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be 6 character long" });
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User exits already" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(201).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxage: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profilePic = req.body;

    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "profile pic required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log("error in update profile controller : ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
