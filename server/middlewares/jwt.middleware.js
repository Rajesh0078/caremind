import jwt from "jsonwebtoken";
import User from "../modules/users/User.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" , succes: false });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).populate("roleIds");

    if (!user) {
      return res.status(401).json({ message: "User not found", succes: false });
    }

    req.user = {
      _id: user._id,
      tenantId: user.tenantId,
      roles: user.roleIds,
    };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token", succes: false });
  }
};
