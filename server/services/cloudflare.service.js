import axios from "axios";
import { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID, DOMAIN_URI } from "../config/env.js";

const CF_API = "https://api.cloudflare.com/client/v4";

export const createSubdomainDNS = async (subdomain) => {
  const response = await axios.post(
    `${CF_API}/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
    {
      type: "CNAME",
      content: DOMAIN_URI,
      name: subdomain,
      ttl: 1,
      proxied: true,
    },
    {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  if (!response.data.success) {
    throw new Error("Cloudflare DNS creation failed");
  }

  console.log(response);

  return response.data.result;
};
