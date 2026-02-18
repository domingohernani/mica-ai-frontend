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
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/use-store";
import { type Organization } from "@/stores/interfaces/organization.store.interface";
import OrgAvatar from "./org-avatar";

export function OrgSwitcher({ currentUserId }: { currentUserId: string }) {
  const organizations = useStore((state) => state.organizations);
  const currentOrganizationId = useStore(
    (state) => state.currentOrganizationId,
  );
  const setCurrentOrganization = useStore(
    (state) => state.setCurrentOrganization,
  );

  const [open, setOpen] = useState(false);

  const selected =
    organizations.find((o) => o.id === currentOrganizationId) ??
    organizations[0];

  const getUserRole = (org: Organization) =>
    org.members.find((m) => m.userId === currentUserId)?.role ?? "member";

  const handleSelect = (org: Organization) => {
    setCurrentOrganization(org.id);
    // onOrgChange?.(org);
    setOpen(false);
  };

  if (!selected) return null;

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
          <div className="flex items-center px-3 py-0.5">
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

            {/* Org list */}
            <CommandGroup
              heading={
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Organizations
                </span>
              }
              className="px-1.5 pt-2 pb-1"
            >
              {organizations.map((org) => {
                const isActive = org.id === selected.id;
                const role = getUserRole(org);

                return (
                  <CommandItem
                    key={org.id}
                    value={org.name}
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
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70 leading-none">
                        <Layers className="h-2.5 w-2.5" />
                        {org.members.length} member
                        {org.members.length !== 1 ? "s" : ""}
                        &nbsp;·&nbsp;{role}
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
