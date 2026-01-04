import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, 'Tenant is required'],
      index: true,
    },

    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [3, "User name must be at least 3 characters"],
      maxlength: [50, "User name must not exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    roleIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "blocked"],
        message: "Status must be active, inactive, or blocked",
      },
      default: "active",
      index: true,
    },

    lastLoginAt: Date,

    passwordChangedAt: Date,

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Creating user is required']
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
userSchema.index({ roleId: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {return;}

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangeAt = new Date();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model("User", userSchema, "users");
