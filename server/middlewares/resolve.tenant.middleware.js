import TenantDomain from "../modules/tenantDomains/TenantDomain.js";


export const resolveTenant = async (req, res, next) => {
  try {
    const host = req.hostname;
    const parts = host.split(".");

    if (parts.length < 3) {
      req.tenant = null;
      return next();
    }

    const subdomain = parts[0];

    const tenantDomain = await TenantDomain.findOne({
      subdomain,
      status: "active",
    }).populate("tenantId");

    if (!tenantDomain) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    req.tenant = tenantDomain.tenantId;
    next();
  } catch (error) {
    console.error("Resolve Tenant Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resolve tenant",
    });
  }
};
