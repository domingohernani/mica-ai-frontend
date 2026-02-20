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
import { type Job } from "../interfaces/job.interface";
import NewJobPage from "./sub/new-job.page";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/stores/use-store";
import { api } from "@/utils/axios";

const statuses = ["All Statuses", "Open", "Paused", "Closed"];

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
  const currentOrganizationId = useStore(
    (state) => state.currentOrganizationId,
  );

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery<Job[]>({
    queryKey: ["jobs", currentOrganizationId],
    queryFn: async () => {
      if (!currentOrganizationId) return [];
      const { data } = await api.get(`/jobs/${currentOrganizationId}`);
      return data;
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRecruiter, setSelectedRecruiter] = useState("All Recruiters");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  // Derive unique departments and recruiters from fetched data
  const departments = [
    "All Departments",
    ...Array.from(new Set(jobs.map((job) => job.department))),
  ];

  const recruiters = [
    "All Recruiters",
    ...Array.from(new Set(jobs.map((job) => job.assignedRecruiter))),
  ];

  // Filter and sort logic
  const filteredAndSortedPositions = jobs
    .filter((job) => {
      const matchesSearch =
        job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        job.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "All Statuses" || job.status === selectedStatus;
      const matchesRecruiter =
        selectedRecruiter === "All Recruiters" ||
        job.assignedRecruiter === selectedRecruiter;
      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesRecruiter
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title-asc":
          return a.position.localeCompare(b.position);
        case "title-desc":
          return b.position.localeCompare(a.position);
        default:
          return 0;
      }
    });

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
        {isLoading
          ? "Loading positions..."
          : error
            ? "Failed to load positions."
            : `Showing ${filteredAndSortedPositions.length} of ${jobs.length} positions`}
      </div>

      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto border bg-card">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Job Title</TableHead>
                <TableHead className="w-[150px]">Department</TableHead>
                <TableHead className="w-[130px]">Location</TableHead>
                <TableHead className="w-[130px] text-center">
                  Applicants
                </TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[120px]">Experience</TableHead>
                <TableHead className="w-[180px]">Assigned Recruiter</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Loading positions...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Something went wrong. Please try again.
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedPositions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No positions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedPositions.map((job) => (
                  <TableRow
                    key={job.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="font-medium">{job.position}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Posted{" "}
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{job.department}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{job.location}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 font-semibold rounded-full bg-primary/10 text-primary">
                        <Users className="w-4 h-4" />—
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(job.status)}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.experienceLevel}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{job.assignedRecruiter}</div>
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
