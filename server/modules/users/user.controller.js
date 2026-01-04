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

export  { getUserProfile };
