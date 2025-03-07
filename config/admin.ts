import { AdminConfig } from "@/types";

export const adminConfig: AdminConfig = {
  sidebarNav: [
    {
      title: "Overview",
      href: "/admin",
      icon: "dashboard",
    },
    {
      title: "Questionnaires",
      href: "/admin/questionnaire",
      icon: "clipboardList",
    },
    {
      title: "Video Requests",
      href: "/admin/video-requests",
      icon: "video",
    },
    {
      title: "Questionnaire Results",
      href: "/admin/questionnaire-results",
      icon: "database",
    },
    {
      title: "Generated Videos",
      href: "/admin/generated-videos",
      icon: "video",
    },
    // ... existing menu items ...
  ],
};
