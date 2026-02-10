import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Sidebar from "./sidebar.layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import MicaAi from "@/assets/logos/mica-ai-logo";

const Header = () => {
  return (
    <header className="flex items-center justify-between h-16 p-5 bg-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 ">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg">
            <MicaAi size={50} />
          </div>
          <div className="pl-4 border-l">
            <div className="flex items-center gap-2 px-3 py-1 border rounded-md bg-card">
              <Avatar className="border-2 h-9 w-9 border-background">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">
                  Jane Recruiter
                </span>
                <span className="text-xs truncate text-muted-foreground">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        {/* Global Search Mockup */}
        <div className="items-center hidden w-64 gap-2 px-3 text-sm transition-colors border rounded-md md:flex h-9 bg-background text-muted-foreground hover:border-primary/50 cursor-text">
          <Search className="w-4 h-4" />
          <span>Search candidates...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute w-2 h-2 bg-red-500 border-2 rounded-full top-2 right-2 border-background"></span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
