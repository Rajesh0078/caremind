import Role from "../roles/Role.js";
import Tenant from "../tenants/Tenant.js";
import User from "./User.js";


const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("roleId", "name key scope")
      .populate("tenantId", "name slug status");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.roleId,
        tenant: user.tenantId,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

const createNewUser = async(req, res, next) => {
  try {
    const { tenantId, name, email, password, roles, phone } = req.body;

    if (!tenantId || !name || !email || !password || roles) {
      return res.status(400).json({
        success: false,
        message: "Please provide required data"
      });
    }

    const tenant = await Tenant.findOne({ id: tenantId, status: 'active' });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant details not found"
      });
    }

    const isSystemAdmin = req.user.roles.some(
      role => role.key === "super_admin" && role.isActive
    );

    if (!isSystemAdmin) {
      if (
        !req.user.tenantId ||
        req.user.tenantId.toString() !== tenantId
      ) {
        return res.status(403).json({
          success: false,
          message: "Cross-tenant user creation denied",
        });
      }
    }

    const existingUser = await User.findOne({
      email,
      tenantId,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const validRoles = await Role.find({
      _id: { $in: roles },
      isActive: true,
      tenantId,
    });

    if (validRoles.length !== roles.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid roles provided",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      tenantId,
      roles: validRoles.map(r => r._id),
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });

  } catch (error) {
    next(error);
  }
};

export  { getUserProfile, createNewUser };
