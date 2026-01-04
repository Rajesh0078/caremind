import { model, Schema } from "mongoose";

const tenantTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant type name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Tenant type name must be at least 3 characters"],
      maxlength: [50, "Tenant type name must not exceed 50 characters"],
      index: true,
    },

    key: {
      type: String,
      required: [true, "Tenant type key is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Tenant type key can contain only lowercase letters, numbers, and hyphens",
      ],
      index: true,
      immutable: true,
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

/* =====================
   Indexes
===================== */
tenantTypeSchema.index({ name: 1 });
tenantTypeSchema.index({ key: 1 });
tenantTypeSchema.index({ isActive: 1 });

export default model("TenantType", tenantTypeSchema, "tenant_types");
