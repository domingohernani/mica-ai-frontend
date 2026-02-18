import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar.layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import MicaAi from "@/assets/logos/mica-ai-logo";
import { useStore } from "@/stores/use-store";
import { OrgSwitcher } from "../../features/orgnanization/components/org-switcher";

const Header = () => {
  const user = useStore((store) => store.user);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
      {/* Mobile sidebar trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <MicaAi size={30} />

      {/* ── Org Switcher ── */}
      <div className="flex items-center gap-1.5">
        {/* Breadcrumb-style divider */}
        <span className="text-muted-foreground/30 select-none text-lg font-light">
          /
        </span>
        {user && <OrgSwitcher currentUserId={user.id} />}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Global Search Mockup */}
      <Button
        variant="outline"
        className="hidden h-9 w-64 justify-between gap-2 text-sm text-muted-foreground hover:text-foreground md:flex"
      >
        <span>Search candidates...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <Bell className="h-4.5 w-4.5" />
        {/* Unread dot — remove if not needed */}
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="sr-only">Notifications</span>
      </Button>

      <ModeToggle />

      {/* User avatar */}
      <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/30">
        <AvatarImage src={user?.profileUrl} />
        <AvatarFallback className="text-xs font-semibold">
          {user?.firstName && user?.lastName
            ? `${user.firstName[0]?.toUpperCase()}${user.lastName[0]?.toUpperCase()}`
            : "U"}
        </AvatarFallback>
      </Avatar>

      <div className="hidden flex-col leading-tight md:flex">
        <span className="text-sm font-medium leading-none">
          {user?.firstName} {user?.lastName}
        </span>
      </div>
    </header>
  );
};

export default Header;
