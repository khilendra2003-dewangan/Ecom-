// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    variantSchema: [
      {
        name: { type: String, required: true }, // e.g. "Color"
        options: { type: [String], required: true } // e.g. ["Red", "Blue"]
      }
    ],
  },
  { timestamps: true },
);



const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;


