import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Dashboard",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/questionnaire",
        icon: "questionnaire",
        title: "Questionnaire",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/story-generator",
        icon: "messages",
        title: "Story Generator",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/video-generator",
        icon: "generate",
        title: "Video Generator",
        authorizeOnly: UserRole.USER,
      },
     
      {
        href: "/admin/questionnaire-results",
        icon: "database",
        title: "Questionnaire Results",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/video-requests",
        
        title: "Video Requests",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin",
        icon: "laptop",
        title: "Generated Videos",
        authorizeOnly: UserRole.ADMIN,
      },
      
    ],
  },
  {
    title: "OPTIONS",
    items: [

          {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },

    ],
  },
];