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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MoreVertical, Mail, Phone, FileText } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/stores/use-store";
import { api } from "@/utils/axios";
import type { Application } from "../interfaces/application.interface";
import APPLICATION_STATUS from "../constants/application-status.constant";
import { formatDate } from "@/utils/date";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SIDEBAR_ITEMS from "@/layout/constants/sidebar-items.constant";
import { getScoreStyle } from "@/utils/scoreStyle";
import Gemini from "@/assets/logos/gemini";

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

const CandidateRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 rounded-full w-36" />
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="w-12 h-12 mx-auto rounded-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="w-24 h-4" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="w-8 h-8 ml-auto" />
    </TableCell>
  </TableRow>
);

const HiringCandidatesPage = () => {
  const currentOrganizationId = useStore(
    (state) => state.currentOrganizationId,
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("score-desc");

  const fetchApplicants = async () => {
    if (!currentOrganizationId) return [];
    const { data } = await api.get(
      `/organizations/${currentOrganizationId}/applications`,
    );
    if (Array.isArray(data)) {
      const position = data.map((item) => item.job.position);
      setPositions(position)
    }

    return data;
  };

  const {
    data: applicants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applicants", currentOrganizationId],
    queryFn: fetchApplicants,
  });

  const filteredAndSortedCandidates = applicants
    .filter((applicant: Application) => {
      const fullName = `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (applicant.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition =
        selectedPosition === "All Positions" ||
        (applicant.job?.position) === selectedPosition;
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        applicant.status === selectedStatus;
      return matchesSearch && matchesPosition && matchesStatus;
    })
    .sort((a: Application, b: Application) => {
      const compatibilityScoreA = a.applicantEvaluation.evaluation.compatibilityScore;
      const compatibilityScoreB = a.applicantEvaluation.evaluation.compatibilityScore;
      switch (sortBy) {
        case "score-desc":
          return (compatibilityScoreB || 0) - (compatibilityScoreA || 0);
        case "score-asc":
          return (compatibilityScoreA || 0) - (compatibilityScoreB || 0);
        case "date-desc":
          return new Date(b.appliedAt!).getTime() - new Date(a.appliedAt!).getTime();
        case "date-asc":
          return new Date(a.appliedAt!).getTime() - new Date(b.appliedAt!).getTime();
        case "name-asc":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "name-desc":
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        default:
          return 0;
      }
    });

  const handleScheduleInterviewClick = (jobId: string, applicantId: string | undefined) => {
    navigate(`jobs/${jobId}/applications/${applicantId}/schedules/new`)
  }

  if (error) return <p>Something went wrong</p>;

  const talentAcquisitionSidebar = SIDEBAR_ITEMS[0]?.items[0]?.href;
  if (talentAcquisitionSidebar !== location.pathname) {
    return <Outlet />
  }

  return (
    <>
      <Outlet />
      {/* Header */}
      <section>
        <PageHeader
          title="Candidates"
          subtitle="A unified list of every applicant who has entered the system."
        />
      </section>

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
              <SelectItem key={"all-position"} value="All Positions">
                All Positions
              </SelectItem>
              {positions.map((position, key) => (
                <SelectItem key={key} value={position}>
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
              <SelectItem key={"all_statuses"} value="All Statuses">
                All Statuses
              </SelectItem>
              {APPLICATION_STATUS.map((status) => (
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
        {isLoading ? (
          <Skeleton className="w-40 h-4" />
        ) : (
          <>
            Showing {filteredAndSortedCandidates.length} of {applicants.length} candidates
          </>
        )}
      </div>

      {/* Table Container with horizontal scroll */}
      <div
        className="overflow-x-auto border bg-card"
        style={{ minWidth: "800px" }}
      >
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Candidate</TableHead>
                <TableHead className="w-[200px]">Position</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px] text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="cursor-default">
                        <div className="flex items-center gap-2">
                          <span>Compatibility Score</span>
                          <div >
                            <Gemini key={"gemini-logo"} size={15} />
                          </div>
                          <TooltipContent
                            side="top"
                            className="w-[220px] p-0"
                            sideOffset={8}
                          >
                            <div className="p-3.5">
                              <div className="flex items-center gap-2 mb-2.5">
                                <Gemini size={16} />
                                <span className="text-[13px] font-medium">Scored by <span className="font-semibold">Gemini</span></span>
                              </div>
                              <p className="text-[12px] text-muted-foreground leading-relaxed mb-2.5">
                                This score is intelligently analyzed by Gemini based on the uploaded
                                resume — evaluating skills, experience, and role alignment.
                              </p>
                              <div className="flex items-center gap-1.5 bg-muted rounded-md px-2.5 py-2">
                                <FileText size={13} className="text-muted-foreground" />
                                <span className="text-[11px] text-muted-foreground">
                                  Based on the uploaded resume
                                </span>
                              </div>
                            </div>
                          </TooltipContent>
                        </div>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="w-[120px]">Applied</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <CandidateRowSkeleton key={i} />
                ))
              ) : filteredAndSortedCandidates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No candidates found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCandidates.map((applicant: Application) => {
                  const applicationId = applicant.id;
                  const jobId = applicant.jobId
                  const fullName = `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`.trim();
                  const position = applicant.job?.position;
                  const phone = applicant.phoneNumber;
                  const appliedDate = applicant.appliedAt;
                  const compatibilityScore = applicant.applicantEvaluation.evaluation.compatibilityScore;
                  const scoreStyle = getScoreStyle(compatibilityScore);

                  return (
                    <TableRow
                      key={applicant.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">{fullName}</div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {applicant.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{position}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(applicant.status || "")}
                        >
                          {applicant.status ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {compatibilityScore ? (
                          <div className={`inline-flex items-center justify-center w-12 h-12 font-bold rounded-full ${scoreStyle.textColor} ${scoreStyle.bgColor}`}>
                            {compatibilityScore}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {appliedDate && formatDate(appliedDate)}
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
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleScheduleInterviewClick(jobId, applicationId)}>
                              <Phone className="w-4 h-4 mr-2" />
                              Schedule Interview
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div >
    </>
  );
};

export default HiringCandidatesPage;