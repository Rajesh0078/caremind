import { model, Schema } from "mongoose";

const RESERVED_SUBDOMAINS = [
  "www",
  "api",
  "admin",
  "auth",
  "mail",
  "support",
  "dashboard",
  "root",
  "static",
  "cdn",
];

const tenantDomainSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant id is required"],
      unique: true,
      index: true,
    },

    subdomain: {
      type: String,
      required: [true, "Subdomain is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Subdomain must be at least 3 characters"],
      maxlength: [63, "Subdomain must not exceed 63 characters"],
      match: [
        /^[a-z0-9-]+$/,
        "Subdomain can contain only lowercase letters, numbers, and hyphens",
      ],
      index: true,
    },

    fullDomain: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "blocked"],
        message: "Status must be active, inactive, or blocked",
      },
      default: "active",
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


tenantDomainSchema.pre("validate", function (next) {
  if (this.subdomain) {
    const sub = this.subdomain.toLowerCase();

    if (RESERVED_SUBDOMAINS.includes(sub)) {
      return next(
        new Error(`Subdomain '${sub}' is reserved and cannot be used`)
      );
    }
  }

  next();
});

tenantDomainSchema.pre("save", function (next) {
  if (!this.subdomain) {
    return next(new Error("Subdomain is required to generate full domain"));
  }

  if (!process.env.DOMAIN_URI) {
    return next(new Error("DOMAIN_URI is not configured"));
  }

  if (this.isModified("subdomain") || !this.fullDomain) {
    const domain = process.env.DOMAIN_URI.replace(/^https?:\/\//, "");
    this.fullDomain = `${this.subdomain}.${domain}`.toLowerCase();
  }

  next();
});

tenantDomainSchema.index({ tenantId: 1 });
tenantDomainSchema.index({ subdomain: 1 });
tenantDomainSchema.index({ fullDomain: 1 });

export default model("TenantDomain", tenantDomainSchema, "tenant_domains");
