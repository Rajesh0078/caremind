import mongoose from "mongoose";
import TenantDomain from "../tenantDomains/TenantDomain.js";
import Tenant from "./Tenant.js";
import axios from "axios";
import { DOMAIN_URI, VERCEL_API_TOKEN, VERCEL_DOMAIN } from "../../config/env.js";

const RESERVED_SUBDOMAINS = [
  "www",
  "api",
  "admin",
  "app",
  "auth",
  "dashboard",
  "super",
];

const createSubDomain = async (slug) => {
  try {
    const response = await axios.post(
      `https://api.vercel.com/v9/projects/${VERCEL_DOMAIN}/domains`,
      { "name": `${slug}.${DOMAIN_URI}` },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const newTenantController = async(req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { name, slug, subdomain } = req.body;

    if (!name || !slug || !subdomain) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and subdomain are required",
      });
    }

    const cleanSubdomain = subdomain.toLowerCase().trim();

    if (RESERVED_SUBDOMAINS.includes(cleanSubdomain)) {
      return res.status(400).json({
        success: false,
        message: "This subdomain is reserved",
      });
    }

    const existingTenant = await Tenant.findOne(
      { $or: [{ slug }, { name }] },
      null,
      { session }
    );

    if (existingTenant) {
      return res.status(409).json({
        success: false,
        message: "Tenant with same name or slug already exists",
      });
    }

    const existingDomain = await TenantDomain.findOne(
      { subdomain: cleanSubdomain },
      null,
      { session }
    );

    if (existingDomain) {
      return res.status(409).json({
        success: false,
        message: "Subdomain already in use",
      });
    }

    const tenant = await Tenant.create(
      [
        {
          name,
          slug,
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    const fullDomain = `${cleanSubdomain}.${process.env.DOMAIN_URI}`;

    const tenantDomain = await TenantDomain.create(
      [
        {
          tenantId: tenant[0]._id,
          subdomain: cleanSubdomain,
          fullDomain,
          status: "active",
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    try {
      await createSubDomain(cleanSubdomain);

      await TenantDomain.updateOne(
        { _id: tenantDomain[0]._id },
        { status: "active" }
      );
    } catch (dnsError) {
      await TenantDomain.updateOne(
        { _id: tenantDomain[0]._id },
        { status: "dns_failed" }
      );

      console.error("Cloudflare DNS error:", dnsError.message);
    }

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: {
        id: tenant[0]._id,
        name: tenant[0].name,
        slug: tenant[0].slug,
        domain: fullDomain,
      },
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getTenantsController = async (req, res, next) => {
  try {
    const tenants = await Tenant.find()
      .populate({
        path: "createdBy",
        select: "-roleIds",
        populate: {
          path: "roleIds",
          select: "key name scope isActive",
        },
      });
    return res.send({
      success: false,
      message: "Tenants retrieved successfully",
      data: tenants
    });
  } catch (error) {
    next(error);
  }
};

export { newTenantController, getTenantsController };