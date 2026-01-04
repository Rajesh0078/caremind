import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Permission name is required"],
      trim: true,
      minlength: [3, "Permission name must be at least 3 characters"],
      maxlength: [80, "Permission name must not exceed 80 characters"],
      unique: true,
      index: true,
    },

    key: {
      type: String,
      required: [true, "Permission key is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9.:_-]+$/,
        "Permission key can contain lowercase letters, numbers, dots, colons, underscores and hyphens",
      ],
      immutable: true,
      index: true,
    },

    featureId: {
      type: Schema.Types.ObjectId,
      ref: "Feature",
      required: [true, "Feature id is required"],
      index: true,
    },

    actions: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one action must be defined",
      },
      enum: {
        values: [
          "view",
          "create",
          "update",
          "delete",
          "approve",
          "export",
          "assign",
          "manage",
        ],
        message: "Invalid permission action",
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [255, "Description must not exceed 255 characters"],
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

permissionSchema.index({ key: 1 });
permissionSchema.index({ featureId: 1 });
permissionSchema.index({ isActive: 1 });

export default model("Permission", permissionSchema, "permissions");
