import { useState } from "react";
import { Check, ChevronDown, Building2, Plus, Layers } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  memberCount: number;
  avatarColor: string; // tailwind bg class
  initial: string;
}

// ─── Mock Data (replace with real store/API) ──────────────────────────────────

const ORGANIZATIONS: Organization[] = [
  {
    id: "1",
    name: "Mica AI",
    slug: "mica-ai",
    plan: "enterprise",
    memberCount: 24,
    avatarColor: "bg-violet-500",
    initial: "M",
  },
  {
    id: "2",
    name: "Docwebu",
    slug: "docwebu",
    plan: "pro",
    memberCount: 8,
    avatarColor: "bg-emerald-500",
    initial: "D",
  },
  {
    id: "3",
    name: "Atlas Corp",
    slug: "atlas-corp",
    plan: "free",
    memberCount: 3,
    avatarColor: "bg-amber-500",
    initial: "A",
  },
];

const PLAN_LABELS: Record<Organization["plan"], string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const PLAN_STYLES: Record<Organization["plan"], string> = {
  free: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  pro: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  enterprise:
    "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const OrgAvatar = ({
  org,
  size = "sm",
}: {
  org: Organization;
  size?: "sm" | "md";
}) => (
  <span
    className={cn(
      "inline-flex items-center justify-center rounded-md font-semibold text-white shrink-0",
      org.avatarColor,
      size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm",
    )}
  >
    {org.initial}
  </span>
);

interface OrgSwitcherProps {
  /** Currently active org id; defaults to first in list */
  defaultOrgId?: string;
  onOrgChange?: (org: Organization) => void;
}

export function OrgSwitcher({ defaultOrgId, onOrgChange }: OrgSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Organization>(
    () => ORGANIZATIONS.find((o) => o.id === defaultOrgId) ?? ORGANIZATIONS[0]!,
  );

  const handleSelect = (org: Organization) => {
    setSelected(org);
    onOrgChange?.(org);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Switch organization"
          className={cn(
            "group h-9 gap-2 px-2.5 text-sm font-medium",
            "border border-transparent hover:border-border hover:bg-muted/60",
            "transition-all duration-150",
            open && "border-border bg-muted/60",
          )}
        >
          <OrgAvatar org={selected} />
          <span className="max-w-[120px] truncate text-foreground">
            {selected.name}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      {/* ── Dropdown ── */}
      <PopoverContent
        className="w-72 p-0 shadow-xl shadow-black/10 dark:shadow-black/30"
        align="start"
        sideOffset={6}
      >
        <Command>
          {/* Search */}
          <div className="flex items-center px-3 py-0.5 ">
            <CommandInput
              placeholder="Find an organization..."
              className="h-9 p-0 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
            />
          </div>

          <CommandSeparator className="my-0.5" />

          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center gap-1.5 py-6 text-center">
                <Building2 className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No organizations found
                </p>
              </div>
            </CommandEmpty>

            {/* Current org section */}
            <CommandGroup
              heading={
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Organizations
                </span>
              }
              className="px-1.5 pt-2 pb-1"
            >
              {ORGANIZATIONS.map((org) => {
                const isActive = org.id === selected.id;
                return (
                  <CommandItem
                    key={org.id}
                    value={`${org.name} ${org.slug}`}
                    onSelect={() => handleSelect(org)}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-2.5 py-2.5 cursor-pointer",
                      "hover:bg-muted/70 aria-selected:bg-muted/70",
                      isActive && "bg-muted/50",
                    )}
                  >
                    {/* Org avatar */}
                    <OrgAvatar org={org} size="md" />

                    {/* Meta */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "truncate text-sm font-medium leading-none",
                            isActive
                              ? "text-foreground"
                              : "text-foreground/80 group-hover:text-foreground",
                          )}
                        >
                          {org.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-4 px-1 py-0 text-[10px] font-medium border-0",
                            PLAN_STYLES[org.plan],
                          )}
                        >
                          {PLAN_LABELS[org.plan]}
                        </Badge>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70 leading-none">
                        <Layers className="h-2.5 w-2.5" />
                        {org.memberCount} member
                        {org.memberCount !== 1 ? "s" : ""}
                        &nbsp;·&nbsp;/{org.slug}
                      </span>
                    </div>

                    {/* Active checkmark */}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0 text-primary transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator className="my-1" />

            {/* Footer actions */}
            <CommandGroup className="px-1.5 pb-2">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // navigate to /organizations or open create modal
                }}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-muted-foreground/30">
                  <Building2 className="h-3.5 w-3.5" />
                </span>
                View all organizations
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // open create org modal
                }}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-muted-foreground/30">
                  <Plus className="h-3.5 w-3.5" />
                </span>
                Create organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
