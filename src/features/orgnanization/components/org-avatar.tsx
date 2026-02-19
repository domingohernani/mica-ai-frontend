import { type Organization } from "@/stores/interfaces/organization.store.interface";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-rose-500",
  "bg-cyan-500",
];

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const OrgAvatar = ({
  org,
  size = "sm",
}: {
  org: Organization;
  size?: "sm" | "md";
}) => (
  <span
    className={cn(
      "inline-flex items-center justify-center rounded-sm font-semibold text-white shrink-0",
      getAvatarColor(org.name),
      size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm",
    )}
  >
    {org.name.charAt(0).toUpperCase()}
  </span>
);

export default OrgAvatar;
