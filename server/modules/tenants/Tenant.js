import { Schema, model } from "mongoose";

const tenantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
      minlength: [3, "Tenant name must be at least 3 characters"],
      maxlength: [100, "Tenant name must not exceed 100 characters"],
    },

    slug: {
      type: String,
      required: [true, "Tenant slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can contain only lowercase letters, numbers, and hyphens",
      ],
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "suspended"],
        message: "Status must be active, inactive, or suspended",
      },
      default: "active",
      index: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // super_admin
      required: [true, "Creator user id is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default model("Tenant", tenantSchema, "tenants");
