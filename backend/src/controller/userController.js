import generateToken from "../config/genetateToken.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role, // optional (default = user)
      isApproved: role === "seller" ? false : true,
      profilePicture: "",
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profilePicture: user.profilePicture || "",
      },
      message: user.role === "seller" ? "Registered! Admin approval pending. ⏳" : "User Registered Successfully ✅",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isApproved) {
        return res.status(403).json({ message: "Account pending admin approval. ⏳" });
      }

      generateToken(res, user._id);

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          isApproved: user.isApproved,
        },
        message: "Login Successful ✅",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE
export const getUserProfile = async (req, res) => {
  console.log("SCHEMA PATHS:", Object.keys(User.schema.paths));
  console.log("Fetching Profile for User:", req.user._id, "Profile Picture Field in req.user:", req.user.profilePicture);
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    console.log("--- Profile Update Start ---");
    console.log("User ID:", req.user._id);
    console.log("Received Body Keys:", Object.keys(req.body));
    console.log("File Received:", !!req.file);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update text fields
    const fields = ["name", "email", "address", "city", "pincode", "phone"];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Handle Profile Picture Upload
    if (req.file) {
      console.log("Processing image upload to Cloudinary...");
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        user.profilePicture = result.secure_url;
        console.log("Cloudinary URL generated:", result.secure_url);
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image to cloud" });
      }
    }

    console.log("Executing user.save()...");
    console.log("Raw user object keys before save:", Object.keys(user._doc || user));
    const updatedUser = await user.save();
    console.log("Save complete. Profile Picture in saved doc:", updatedUser.profilePicture);
    console.log("Full Updated User doc:", JSON.stringify(updatedUser));

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        city: updatedUser.city,
        pincode: updatedUser.pincode,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture,
        isApproved: updatedUser.isApproved,
      },
      message: "Profile Updated Successfully ✅",
    });
    console.log("--- Profile Update End ---");
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT USER
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    expires: new Date(0),
  });

  res.json({ message: "Logged Out Successfully ✅" });
};