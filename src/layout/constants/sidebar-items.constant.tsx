import React from "react";
import {
  Users,
  FileText,
  Briefcase,
  Settings,
  PieChart,
  Shield,
  CreditCard,
  Plug,
  LayoutGrid,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant?: "default" | "ghost";
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const SIDEBAR_ITEMS: NavGroup[] = [
  {
    label: "Talent Acquisition",
    items: [
      {
        title: "Candidates",
        href: "/app/talent-acquisition/candidates",
        icon: <Users className="w-4 h-4" />,
      },
      {
        title: "Interview Results",
        href: "/app/talent-acquisition/results",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        title: "Job Postings",
        href: "/app/talent-acquisition/jobs",
        icon: <Briefcase className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Process",
    items: [
      {
        title: "Templates",
        href: "/interviews/templates",
        icon: <LayoutGrid className="w-4 h-4" />,
      },
      {
        title: "Config",
        href: "/interviews/settings",
        icon: <Settings className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Insights",
        href: "/insights",
        icon: <PieChart className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        title: "Team & Perms",
        href: "/admin/team",
        icon: <Shield className="w-4 h-4" />,
      },
      {
        title: "Integrations",
        href: "/admin/integrations",
        icon: <Plug className="w-4 h-4" />,
      },
      {
        title: "Billing",
        href: "/admin/billing",
        icon: <CreditCard className="w-4 h-4" />,
      },
    ],
  },
];

export default SIDEBAR_ITEMS;
