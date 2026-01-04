import { Schema, model } from "mongoose";

const roleSchema = new Schema(
  {
    scope: {
      type: String,
      enum: {
        values: ["system", "tenant"],
        message: "Scope must be system or tenant",
      },
      required: [true, "Role scope is required"],
      index: true,
    },

    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      index: true,
      default: null,
      validate: {
        validator: function (value) {
          if (this.scope === "system") {return value === null;}
          if (this.scope === "tenant") {return !!value;}
          return false;
        },
        message:
          "tenantId must be null for system roles and required for tenant roles",
      },
    },

    name: {
      type: String,
      required: [true, "Role name is required"],
      trim: true,
      minlength: [3, "Role name must be at least 3 characters"],
      maxlength: [50, "Role name must not exceed 50 characters"],
    },

    key: {
      type: String,
      required: [true, "Role key is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-_]+$/,
        "Role key can contain only lowercase letters, numbers, hyphens and underscores",
      ],
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

    isSystemDefault: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: function (value) {
          if (this.scope === "system") {return value === null;}
          if (this.scope === "tenant") {return !!value;}
          return false;
        },
        message:
          "tenantId must be null for system roles and required for tenant roles",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

roleSchema.pre("validate", function (next) {
  if (this.scope === "system") {
    this.isSystemDefault = true;
  }

  if (this.scope === "tenant" && this.isSystemDefault === true) {
    return next(
      new Error("Tenant roles cannot be marked as system default")
    );
  }

  next();
});

roleSchema.index(
  { scope: 1, key: 1, tenantId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      scope: { $in: ["system", "tenant"] },
    },
  }
);

export default model("Role", roleSchema, "roles");
