// models/SubCategory.js
import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
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

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;


