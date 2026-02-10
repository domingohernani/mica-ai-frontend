import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";

import SIDEBAR_ITEMS from "../constants/sidebar-items.constant";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col">
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-6">
          {SIDEBAR_ITEMS.map((group, index) => (
            <div key={index}>
              <h4 className="px-2 mb-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground/70">
                {group.label}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-9 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                      onClick={() => navigate(item.href)}
                    >
                      {item.icon}
                      {item.title}
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      
    </div>
  );
};

export default Sidebar;
