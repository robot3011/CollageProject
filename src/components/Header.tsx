import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useVisitorAnalytics } from "@/hooks/useVisitorAnalytics";
import { ScrollArea } from "./ui/scroll-area";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalVisitors, recentVisits, isLoading, fetchAnalytics } = useVisitorAnalytics();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchAnalytics();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="text-sm font-medium text-muted-foreground">
        Created by Team of Six
      </div>

      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Visit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-background">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Visitor Analytics</h3>
            <div className="text-2xl font-bold mb-4">
              {isLoading ? "..." : totalVisitors} Total Visitors
            </div>
            
            <div className="mb-2 text-sm font-medium text-muted-foreground">
              Recent Visits
            </div>
            <ScrollArea className="h-64">
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : recentVisits.length === 0 ? (
                <div className="text-sm text-muted-foreground">No visits recorded</div>
              ) : (
                <div className="space-y-2">
                  {recentVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="text-xs p-2 rounded bg-muted/50"
                    >
                      <div className="font-medium">
                        {new Date(visit.visited_at).toLocaleString()}
                      </div>
                      {visit.session_id && (
                        <div className="text-muted-foreground truncate">
                          Session: {visit.session_id.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
