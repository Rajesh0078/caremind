import { Schema, model } from "mongoose";

const featureSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Feature name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Feature name must be at least 3 characters"],
      maxlength: [50, "Feature name must not exceed 50 characters"],
      index: true,
    },

    key: {
      type: String,
      required: [true, "Feature key is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Feature key can contain only lowercase letters, numbers and hyphens",
      ],
      immutable: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [255, "Description must not exceed 255 characters"],
    },

    category: {
      type: String,
      enum: {
        values: [
          "inventory",
          "communication",
          "forms",
          "appointments",
          "billing",
          "reports",
          "security",
          "other",
        ],
        message: "Invalid feature category",
      },
      default: "other",
      index: true,
    },

    isCore: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id (creator) is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

featureSchema.index({ name: 1 });
featureSchema.index({ key: 1 });
featureSchema.index({ category: 1 });
featureSchema.index({ isActive: 1 });
featureSchema.index({ isCore: 1 });

export default model("Feature", featureSchema, "features");
