import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

export const register = asyncHandler(async (req, res) => {
  const { email, phone, password, role } = req.body;
  
  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, "Email already registered");
    }
  }

  if (phone) {
    const phoneExists = await User.findOne({ phone });
    
    if (phoneExists) {
      throw new ApiError(400, "Phone number already registered");
    }
  }

  // Create user
  const user = await User.create({
    email: email || null,
    phone: phone || null,
    password,
    role,
  });

  const token = generateToken(user._id);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      "User registered successfully"
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body;

  let query = {};

  // Detect whether emailOrPhone is email or phone
  if (emailOrPhone.includes("@")) {
    // Email login
    query.email = emailOrPhone.toLowerCase();
  } else {
    // Phone login (normalize digits only)
    query.phone = emailOrPhone.replace(/\D/g, "");
  }

  const user = await User.findOne(query);

  if (!user) {
    throw new ApiError(401, "Invalid email/phone or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email/phone or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      "Login successful"
    )
  );
});


export const user = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.json(
    new ApiResponse(
      200,
      { user },
      "User fetched successfully"
    )
  );
});

