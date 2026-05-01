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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  MoreVertical,
  Mail,
  UserPlus,
  Users,
  Shield,
  UserCheck,
  Edit2,
  UserMinus,
  Calendar,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { useStore } from "@/stores/use-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/axios";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: Date;
  organizationId: string;
  email: string,
  firstName: string,
  lastName: string,
  profileUrl: string,
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  owner: {
    label: "Owner",
    color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  admin: {
    label: "Admin",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  hiring_manager: {
    label: "Hiring Manager",
    color: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  },
  interviewer: {
    label: "Interviewer",
    color: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
};

const ROLE_FILTER_OPTIONS = [
  "All Roles",
  "owner",
  "admin",
  "hiring_manager",
  "interviewer",
  "viewer",
];

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-lime-100 text-lime-700",
  "bg-orange-100 text-orange-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (email: string) =>
  email
    .split("@")[0]
    .split(".")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

const getAvatarColor = (email: string) =>
  AVATAR_COLORS[email.charCodeAt(0) % AVATAR_COLORS.length];

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const toDisplayName = (email: string) =>
  email
    .split("@")[0]
    .split(".")
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
    .join(" ");

// ─── Main Component ───────────────────────────────────────────────────────────

const OrganizationTeam = () => {
  const currentOrganizationId = useStore(
    (state) => state.currentOrganizationId,
  );
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  // Invite modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("hiring_manager");

  // Edit role modal
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editRole, setEditRole] = useState("");

  // Remove confirmation
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  // ─── Fetch Members ───────────────────────────────────────────────────────────

  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery<Member[]>({
    queryKey: ["members", currentOrganizationId],
    queryFn: async () => {
      if (!currentOrganizationId) return [];
      const { data } = await api.get(
        `/organizations/${currentOrganizationId}/members`,
      );

      console.log(data);


      return data;
    },
  });

  // ─── Invite Mutation ─────────────────────────────────────────────────────────

  const inviteMutation = useMutation({
    mutationFn: async (payload: { email: string; role: string }) => {
      const { data } = await api.post(
        `/organizations/${currentOrganizationId}/members`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", currentOrganizationId],
      });
      toast.success("Invitation sent successfully.");
      setInviteEmail("");
      setInviteRole("hiring_manager");
      setInviteOpen(false);
    },
    onError: () => {
      toast.error("Failed to send invitation. Please try again.");
    },
  });

  // ─── Edit Role Mutation ──────────────────────────────────────────────────────

  const editRoleMutation = useMutation({
    mutationFn: async (payload: { memberId: string; role: string }) => {
      const { data } = await api.patch(
        `/organizations/${currentOrganizationId}/members/${payload.memberId}`,
        { role: payload.role },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", currentOrganizationId],
      });
      toast.success("Role updated successfully.");
      setEditMember(null);
    },
    onError: () => {
      toast.error("Failed to update role. Please try again.");
    },
  });

  // ─── Remove Mutation ─────────────────────────────────────────────────────────

  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      await api.delete(
        `/organizations/${currentOrganizationId}/members/${memberId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", currentOrganizationId],
      });
      toast.success("Member removed successfully.");
      setRemoveTarget(null);
    },
    onError: () => {
      toast.error("Failed to remove member. Please try again.");
    },
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    inviteMutation.mutate({ email: inviteEmail.trim(), role: inviteRole });
  };

  const handleEditSave = () => {
    if (!editMember) return;
    editRoleMutation.mutate({ memberId: editMember.id, role: editRole });
  };

  const handleRemoveConfirm = () => {
    if (!removeTarget) return;
    removeMutation.mutate(removeTarget.id);
  };

  // ─── Derived State ────────────────────────────────────────────────────────────

  const filtered = members.filter((m) => {
    const matchSearch =
      m.userId.toLowerCase().includes(search.toLowerCase()) ||
      toDisplayName(m.userId).toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: members.length,
    admins: members.filter((m) => m.role === "admin" || m.role === "owner")
      .length,
    active: members.filter((m) => m.role !== "viewer").length,
  };

  return (
    <>
      {/* Header */}
      <section>
        <PageHeader
          title="Team"
          subtitle="Manage members and their roles within your organization."
        />
      </section>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-sm text-muted-foreground">Admins & Owners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <UserCheck className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Invite */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col flex-1 gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_FILTER_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r === "All Roles" ? "All Roles" : ROLE_CONFIG[r]?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setInviteOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {isLoading
          ? "Loading members..."
          : error
            ? "Failed to load members."
            : `Showing ${filtered.length} of ${members.length} members`}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border bg-card">
        <div className="min-w-[700px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[260px]">Member</TableHead>
                <TableHead className="w-[140px]">Role</TableHead>
                <TableHead className="w-40">Joined</TableHead>
                <TableHead className="text-right w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Loading members...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Something went wrong. Please try again.
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No members found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((member) => {
                  const role = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.viewer;
                  return (
                    <TableRow
                      key={member.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      {/* Member */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarImage
                              src={member.profileUrl}
                            />
                            <AvatarFallback
                              className={`text-xs font-semibold ${getAvatarColor(member.userId)}`}
                            >
                              {member.firstName[0]}
                              {/* {getInitials(member.userId)} */}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {`${member.firstName} ${member.lastName}`}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge variant="secondary" className={role?.color}>
                          {member.role}
                        </Badge>
                      </TableCell>

                      {/* Joined */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(member.joinedAt)}
                        </div>
                      </TableCell>

                      {/* Actions */}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setEditMember(member);
                                setEditRole(member.role);
                              }}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            {member.role !== "owner" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  onClick={() => setRemoveTarget(member)}
                                >
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Remove Member
                                </DropdownMenuItem>
                              </>
                            )}
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
      </div>

      {/* ── Invite Modal ── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to add someone to your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Role</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "admin",
                      "hiring_manager",
                      "interviewer",
                      "viewer",
                    ] as const
                  ).map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_CONFIG[r].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border bg-muted/50 p-3 space-y-1.5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Role permissions</p>
              <p>
                <span className="font-medium text-foreground">Admin</span> —
                Full platform access except billing and org deletion
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Hiring Manager
                </span>{" "}
                — Create job positions, review evaluations, manage candidates
              </p>
              <p>
                <span className="font-medium text-foreground">Interviewer</span>{" "}
                — View candidate results and leave feedback
              </p>
              <p>
                <span className="font-medium text-foreground">Viewer</span> —
                Read-only access to reports and summaries
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || inviteMutation.isPending}
            >
              {inviteMutation.isPending ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Role Modal ── */}
      <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Update the role for this team member.
            </DialogDescription>
          </DialogHeader>

          {editMember && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/50">
                <Avatar className="w-9 h-9">
                  <AvatarFallback
                    className={`text-xs font-semibold ${getAvatarColor(editMember.userId)}`}
                  >
                    {getInitials(editMember.userId)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {toDisplayName(editMember.userId)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {editMember.userId}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">New Role</label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "admin",
                        "hiring_manager",
                        "interviewer",
                        "viewer",
                      ] as const
                    ).map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_CONFIG[r].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMember(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={editRoleMutation.isPending}
            >
              {editRoleMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Remove Confirmation Modal ── */}
      <Dialog open={!!removeTarget} onOpenChange={() => setRemoveTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-foreground">
                {removeTarget ? toDisplayName(removeTarget.userId) : ""}
              </span>{" "}
              from this organization? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveConfirm}
              disabled={removeMutation.isPending}
            >cd
              {removeMutation.isPending ? "Removing..." : "Remove Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationTeam;
