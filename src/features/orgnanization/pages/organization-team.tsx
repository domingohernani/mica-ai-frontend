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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: Date;
  organizationId: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    userId: "alex.morgan@corp.io",
    role: "owner",
    joinedAt: new Date("2023-01-10"),
    organizationId: "org-1",
  },
  {
    id: "2",
    userId: "jamie.chen@corp.io",
    role: "admin",
    joinedAt: new Date("2023-03-22"),
    organizationId: "org-1",
  },
  {
    id: "3",
    userId: "sam.patel@corp.io",
    role: "admin",
    joinedAt: new Date("2023-05-14"),
    organizationId: "org-1",
  },
  {
    id: "4",
    userId: "riley.brooks@corp.io",
    role: "hiring_manager",
    joinedAt: new Date("2023-06-01"),
    organizationId: "org-1",
  },
  {
    id: "5",
    userId: "drew.santos@corp.io",
    role: "hiring_manager",
    joinedAt: new Date("2023-07-19"),
    organizationId: "org-1",
  },
  {
    id: "6",
    userId: "casey.hall@corp.io",
    role: "interviewer",
    joinedAt: new Date("2023-08-30"),
    organizationId: "org-1",
  },
  {
    id: "7",
    userId: "morgan.lee@corp.io",
    role: "interviewer",
    joinedAt: new Date("2023-10-05"),
    organizationId: "org-1",
  },
  {
    id: "8",
    userId: "taylor.kim@corp.io",
    role: "viewer",
    joinedAt: new Date("2023-11-12"),
    organizationId: "org-1",
  },
];

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
  }).format(date);

const toDisplayName = (email: string) =>
  email
    .split("@")[0]
    .split(".")
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
    .join(" ");

// ─── Main Component ───────────────────────────────────────────────────────────

const OrganizationTeam = () => {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
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

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: Member = {
      id: String(Date.now()),
      userId: inviteEmail.trim(),
      role: inviteRole,
      joinedAt: new Date(),
      organizationId: "org-1",
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setInviteRole("hiring_manager");
    setInviteOpen(false);
  };

  const handleEditSave = () => {
    if (!editMember) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === editMember.id ? { ...m, role: editRole } : m)),
    );
    setEditMember(null);
  };

  const handleRemoveConfirm = () => {
    if (!removeTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
    setRemoveTarget(null);
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
        Showing {filtered.length} of {members.length} members
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
              {filtered.length === 0 ? (
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
                            <AvatarFallback
                              className={`text-xs font-semibold ${getAvatarColor(member.userId)}`}
                            >
                              {getInitials(member.userId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {toDisplayName(member.userId)}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {member.userId}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge variant="secondary" className={role.color}>
                          {role.label}
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
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
              Send Invite
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
            <Button onClick={handleEditSave}>Save Changes</Button>
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
            <Button variant="destructive" onClick={handleRemoveConfirm}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationTeam;
