import { Schema, model } from "mongoose";

const rolePermissionSchema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },

    permissionId: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
      index: true,
    },

    granted: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

rolePermissionSchema.index(
  { roleId: 1, permissionId: 1 },
  { unique: true }
);

export default model(
  "RolePermission",
  rolePermissionSchema,
  "role_permissions"
);
