import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Skills4Life",
  description: "",
  url: site_url,
  links: {
    twitter: "",
    github: "",
  },
  ogImage: `${site_url}/`,
  mailSupport: "",

  }

export const footerLinks: SidebarNavItem[] = [];
