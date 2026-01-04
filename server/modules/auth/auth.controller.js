import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config/env.js";
import Role from "../roles/Role.js";
import User from "../users/User.js";
import jwt from 'jsonwebtoken';

const registerController = async (req, res, next) => {
  try {
    const { name, email, password, roleIds } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one role must be selected",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const isSuperAdmin = req.user.roles.some(
      (role) => role.key === "super_admin"
    );

    if (!isSuperAdmin && !req.tenant) {
      return res.status(400).json({
        success: false,
        message: "Tenant context is missing",
      });
    }

    const emailQuery = isSuperAdmin
      ? { email }
      : { email, tenantId: req.tenant._id };

    const existingUser = await User.findOne(emailQuery);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const roleQuery = {
      _id: { $in: roleIds },
      isActive: true,
    };

    // tenant users → restrict role scope
    if (!isSuperAdmin) {
      roleQuery.$or = [
        { scope: "system" },
        { scope: "tenant", tenantId: req.tenant._id },
      ];
    }

    const roles = await Role.find(roleQuery);

    if (roles.length !== roleIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more roles are invalid or not allowed",
      });
    }

    const isCreatingSystemAdmin = roles.some(
      (role) => role.key === "system_admin"
    );

    if (isCreatingSystemAdmin && !isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only super admin can create system admin users",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      roleIds: roles.map((r) => r._id),
      tenantId: isSuperAdmin ? null : req.tenant._id,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: roles.map((r) => r.key),
        tenantId: user.tenantId,
      },
    });

  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user = null;

    user = await User.findOne({
      email,
      tenantId: null,
    })
      .select("+password")
      .populate("roleIds");

    if (!user && req.tenant) {
      user = await User.findOne({
        email,
        tenantId: req.tenant._id,
      })
        .select("+password")
        .populate("roleIds");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      console.error(isValid);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const roleKeys = user.roleIds.map((r) => r.key);

    const token = jwt.sign(
      {
        userId: user._id,
        roleKeys,
        tenantId: user.tenantId || null,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN || "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: roleKeys,
        tenantId: user.tenantId,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500, {
      success: false,
      message: 'Login failed'
    });
  }
};

export  { registerController, loginController };