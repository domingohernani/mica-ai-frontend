import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Mail, Phone, FileText } from "lucide-react";

// Mock data - replace with your actual data fetching
const mockCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    position: "Frontend Developer",
    status: "Completed Interview",
    score: 95,
    appliedDate: "2024-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "+1 (555) 234-5678",
    position: "Frontend Developer",
    status: "Completed Interview",
    score: 92,
    appliedDate: "2024-01-18",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 (555) 345-6789",
    position: "Backend Developer",
    status: "In Review",
    score: 88,
    appliedDate: "2024-01-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    position: "Frontend Developer",
    status: "Scheduled",
    score: 85,
    appliedDate: "2024-01-22",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1 (555) 567-8901",
    position: "Full Stack Developer",
    status: "New Application",
    score: null,
    appliedDate: "2024-01-25",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
];

const positions = [
  "All Positions",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "UI/UX Designer",
];

const statuses = [
  "All Statuses",
  "New Application",
  "In Review",
  "Scheduled",
  "Completed Interview",
  "Rejected",
  "Hired",
];

const sortOptions = [
  { value: "score-desc", label: "Highest Score" },
  { value: "score-asc", label: "Lowest Score" },
  { value: "date-desc", label: "Most Recent" },
  { value: "date-asc", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    "New Application": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    "In Review": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Scheduled: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    "Completed Interview": "bg-green-100 text-green-800 hover:bg-green-100",
    Rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    Hired: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  };
  return colors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
};

const HiringCandidatesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("score-desc");

  // Filter and sort logic
  const filteredAndSortedCandidates = mockCandidates
    .filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition =
        selectedPosition === "All Positions" ||
        candidate.position === selectedPosition;
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        candidate.status === selectedStatus;
      return matchesSearch && matchesPosition && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return (b.score || 0) - (a.score || 0);
        case "score-asc":
          return (a.score || 0) - (b.score || 0);
        case "date-desc":
          return (
            new Date(b.appliedDate).getTime() -
            new Date(a.appliedDate).getTime()
          );
        case "date-asc":
          return (
            new Date(a.appliedDate).getTime() -
            new Date(b.appliedDate).getTime()
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A unified list of every applicant who has entered the system.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col flex-1 gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Position Filter */}
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedCandidates.length} of {mockCandidates.length}{" "}
        candidates
      </div>

      {/* Table Container with horizontal scroll */}
      <div
        className="overflow-x-auto border bg-card"
        style={{ minWidth: "800px" }}
      >
        <div className="min-w-[800px] ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Candidate</TableHead>
                <TableHead className="w-[200px]">Position</TableHead>
                <TableHead className="w-[180px]">Status</TableHead>
                <TableHead className="w-[100px] text-center">Score</TableHead>
                <TableHead className="w-[120px]">Applied</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCandidates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No candidates found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCandidates.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={candidate.avatar}
                            alt={candidate.name}
                          />
                          <AvatarFallback>
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {candidate.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{candidate.position}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {candidate.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(candidate.status)}
                      >
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {candidate.score !== null ? (
                        <div className="inline-flex items-center justify-center w-12 h-12 font-bold rounded-full bg-primary/10 text-primary">
                          {candidate.score}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(candidate.appliedDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HiringCandidatesPage;
