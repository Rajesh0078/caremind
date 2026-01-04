import LandingPage from "../LandingPage";
import TenantApp from "../TenantApp";

export function meta({}) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


export async function loader({ request }) {
  const url = new URL(request.url);
  const tenant = getTenantFromHost(url.hostname);

  return { tenant };
}

export default function Home({ loaderData }) {
  const { tenant } = loaderData;

  if (!tenant) {
    // Root domain → landing page
    return <LandingPage />;
  }

  // Subdomain → tenant app
  return <TenantApp tenant={tenant} />;
}


export function getTenantFromHost(hostname) {
  const ROOT_DOMAIN = "caremind.in";
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    return parts.length > 1 ? parts[0] : null;
  }

  if (hostname === ROOT_DOMAIN) {
    return null;
  }

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return hostname.replace(`.${ROOT_DOMAIN}`, "");
  }

  return null;
}
