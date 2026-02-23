import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, updateUserProfile } from "../controller/userController.js";
import { protect } from "../middlewares/auth.js";
import { getAllCategory, getAllSubCategories, getSubCategoriesByCategory } from "../controller/adminController.js";
import upload from "../middlewares/multer.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.get("/profile", protect, getUserProfile)
userRouter.put("/updateprofile", protect, upload.single("profilePicture"), updateUserProfile)
userRouter.get("/getcategory", getAllCategory);
userRouter.get("/getSubCategorybyid/:categoryId", getSubCategoriesByCategory);
userRouter.get("/getSubCategory", getAllSubCategories);





export default userRouter;
