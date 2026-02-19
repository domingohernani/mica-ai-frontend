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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Users, Calendar, Plus } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import NewJobPage from "./sub/new-job.page";

// Mock data - replace with your actual data fetching
const mockJobPositions = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    department: "Engineering",
    applicants: 45,
    status: "Open",
    timeToFill: "12 days",
    assignedRecruiter: "Sarah Mitchell",
    postedDate: "2024-01-15",
  },
  {
    id: 2,
    jobTitle: "Product Designer",
    department: "Design",
    applicants: 32,
    status: "Open",
    timeToFill: "8 days",
    assignedRecruiter: "Michael Chen",
    postedDate: "2024-01-20",
  },
  {
    id: 3,
    jobTitle: "Backend Engineer",
    department: "Engineering",
    applicants: 28,
    status: "Paused",
    timeToFill: "15 days",
    assignedRecruiter: "Sarah Mitchell",
    postedDate: "2024-01-10",
  },
  {
    id: 4,
    jobTitle: "DevOps Engineer",
    department: "Engineering",
    applicants: 18,
    status: "Open",
    timeToFill: "5 days",
    assignedRecruiter: "James Wilson",
    postedDate: "2024-01-25",
  },
  {
    id: 5,
    jobTitle: "Marketing Manager",
    department: "Marketing",
    applicants: 67,
    status: "Closed",
    timeToFill: "22 days",
    assignedRecruiter: "Emily Rodriguez",
    postedDate: "2024-01-05",
  },
  {
    id: 6,
    jobTitle: "UX Researcher",
    department: "Design",
    applicants: 24,
    status: "Open",
    timeToFill: "10 days",
    assignedRecruiter: "Michael Chen",
    postedDate: "2024-01-22",
  },
  {
    id: 7,
    jobTitle: "Data Analyst",
    department: "Analytics",
    applicants: 41,
    status: "Open",
    timeToFill: "7 days",
    assignedRecruiter: "Sarah Mitchell",
    postedDate: "2024-01-18",
  },
  {
    id: 8,
    jobTitle: "Sales Representative",
    department: "Sales",
    applicants: 52,
    status: "Paused",
    timeToFill: "18 days",
    assignedRecruiter: "James Wilson",
    postedDate: "2024-01-12",
  },
];

const departments = [
  "All Departments",
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Analytics",
  "Operations",
  "Human Resources",
];

const statuses = ["All Statuses", "Open", "Paused", "Closed"];

const recruiters = [
  "All Recruiters",
  "Sarah Mitchell",
  "Michael Chen",
  "James Wilson",
  "Emily Rodriguez",
];

const sortOptions = [
  { value: "applicants-desc", label: "Most Applicants" },
  { value: "applicants-asc", label: "Least Applicants" },
  { value: "date-desc", label: "Most Recent" },
  { value: "date-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Open: "bg-green-100 text-green-800 hover:bg-green-100",
    Paused: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Closed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };
  return colors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
};

const HiringJobPostingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRecruiter, setSelectedRecruiter] = useState("All Recruiters");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  // Filter and sort logic
  const filteredAndSortedPositions = mockJobPositions
    .filter((position) => {
      const matchesSearch =
        position.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        position.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "All Statuses" || position.status === selectedStatus;
      const matchesRecruiter =
        selectedRecruiter === "All Recruiters" ||
        position.assignedRecruiter === selectedRecruiter;
      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesRecruiter
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "applicants-desc":
          return b.applicants - a.applicants;
        case "applicants-asc":
          return a.applicants - b.applicants;
        case "date-desc":
          return (
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
          );
        case "date-asc":
          return (
            new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
          );
        case "title-asc":
          return a.jobTitle.localeCompare(b.jobTitle);
        case "title-desc":
          return b.jobTitle.localeCompare(a.jobTitle);
        default:
          return 0;
      }
    });

  // Show new job form instead of list
  if (showNewJobForm) {
    return (
      <section>
        <NewJobPage onBack={() => setShowNewJobForm(false)} />
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section>
        <div className="flex items-center justify-between">
          <PageHeader
            title="Job Positions"
            subtitle="Manage all open, paused, and closed positions across your organization."
          />
          <Button onClick={() => setShowNewJobForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Position
          </Button>
        </div>
      </section>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col flex-1 gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Department Filter */}
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
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

          {/* Recruiter Filter */}
          <Select
            value={selectedRecruiter}
            onValueChange={setSelectedRecruiter}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select recruiter" />
            </SelectTrigger>
            <SelectContent>
              {recruiters.map((recruiter) => (
                <SelectItem key={recruiter} value={recruiter}>
                  {recruiter}
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
        Showing {filteredAndSortedPositions.length} of {mockJobPositions.length}{" "}
        positions
      </div>

      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto border bg-card">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Job Title</TableHead>
                <TableHead className="w-[150px]">Department</TableHead>
                <TableHead className="w-[130px] text-center">
                  Applicants
                </TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[120px]">Time to Fill</TableHead>
                <TableHead className="w-[180px]">Assigned Recruiter</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPositions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No positions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedPositions.map((position) => (
                  <TableRow
                    key={position.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="font-medium">{position.jobTitle}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Posted{" "}
                        {new Date(position.postedDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{position.department}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 font-semibold rounded-full bg-primary/10 text-primary">
                        <Users className="w-4 h-4" />
                        {position.applicants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(position.status)}
                      >
                        {position.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {position.timeToFill}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {position.assignedRecruiter}
                      </div>
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
                            <Eye className="w-4 h-4 mr-2" />
                            View Pipeline
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Edit Position
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
    </>
  );
};

export default HiringJobPostingPage;
