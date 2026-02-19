import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/stores/use-store";
import { toast } from "sonner";
import { api } from "@/utils/axios";

interface Department {
  id: string;
  name: string;
  createdAt: string;
}

const DepartmentConfigPage = () => {
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);
  const currentOrganizationId = useStore(
    (state) => state.currentOrganizationId,
  );

  const fetchDepartments = async () => {
    const { data } = await api.get(
      `/organizations/${currentOrganizationId}/departments`,
    );
    return data;
  };

  const addDepartment = async (name: string) => {
    const { data } = await api.post(
      `/organizations/${currentOrganizationId}/departments`,
      { name, createdBy: user?.id },
    );

    toast.success("Department added successfully", {
      description: (
        <span className="text-muted-foreground">
          {name} has been added to the organization.
        </span>
      ),
    });
    return data;
  };

  const updateDepartment = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    const { data } = await api.patch(
      `/organizations/${currentOrganizationId}/departments/${id}`,
      { name },
    );
    toast.success("Department updated successfully", {
      description: (
        <span className="text-muted-foreground">
          Department has been updated successfully.
        </span>
      ),
    });
    return data;
  };

  const deleteDepartment = async (id: string) => {
    const { data } = await api.delete(
      `/organizations/${currentOrganizationId}/departments/${id}`,
    );

    toast.success("Department deleted successfully", {
      description: (
        <span className="text-muted-foreground">
          Department has been deleted successfully.
        </span>
      ),
    });
    return data;
  };

  const {
    data: departments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const addMutation = useMutation({
    mutationFn: addDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setDepartmentInput("");
    },
    onError: () => {
      toast.error("Failed to add department", {
        description: (
          <span className="text-muted-foreground">
            Something went wrong. Please try again.
          </span>
        ),
      });
      setDepartmentInput("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setEditingDepartment(null);
      setDepartmentInput("");
    },
    onError: () => {
      toast.error("Failed to update department", {
        description: (
          <span className="text-muted-foreground">
            Something went wrong. Please try again.
          </span>
        ),
      });
      setEditingDepartment(null);
      setDepartmentInput("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setDeletingDepartment(null);
    },
    onError: () => {
      toast.error("Failed to delete department", {
        description: (
          <span className="text-muted-foreground">
            Something went wrong. Please try again.
          </span>
        ),
      });
      setDeletingDepartment(null);
    },
  });

  const [departmentInput, setDepartmentInput] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);

  // Department CRUD Operations
  const handleAddDepartment = () => {
    const trimmed = departmentInput.trim();

    if (!trimmed) {
      toast.error("Department name is required", {
        description: (
          <span className="text-muted-foreground">
            Please enter a valid department name before adding.
          </span>
        ),
      });
      return;
    }

    if (departments.some((d: Department) => d.name === trimmed)) {
      toast.error("Department already exists", {
        description: (
          <span className="text-muted-foreground">
            {trimmed} is already in the list
          </span>
        ),
      });
      return;
    }

    addMutation.mutate(trimmed);
  };

  const handleUpdateDepartment = () => {
    if (editingDepartment && departmentInput.trim()) {
      updateMutation.mutate({
        id: editingDepartment.id,
        name: departmentInput.trim(),
      });
    }
  };

  const handleDeleteDepartment = () => {
    if (deletingDepartment) {
      deleteMutation.mutate(deletingDepartment.id);
    }
  };

  const startEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentInput(department.name);
  };

  const cancelEditDepartment = () => {
    setEditingDepartment(null);
    setDepartmentInput("");
  };

  const handleDepartmentKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingDepartment) {
        handleUpdateDepartment();
      } else {
        handleAddDepartment();
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  const isMutating =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <TabsContent value="departments" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Department Management
            </CardTitle>
            <CardDescription>
              Add, edit, or remove departments for job postings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add/Edit Department Form */}
            <div className="space-y-2">
              <Label htmlFor="departmentInput">
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="departmentInput"
                  placeholder="e.g., Engineering, Marketing"
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                  onKeyPress={handleDepartmentKeyPress}
                  disabled={isMutating}
                />
                {editingDepartment ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleUpdateDepartment}
                      disabled={!departmentInput.trim() || isMutating}
                    >
                      {updateMutation.isPending ? "Saving..." : "Update"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditDepartment}
                      disabled={isMutating}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={handleAddDepartment}
                    disabled={isMutating}
                  >
                    {addMutation.isPending ? (
                      "Adding..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Departments Table */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground"
                      >
                        No departments added yet. Add your first department
                        above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department: Department) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">
                          {department.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditDepartment(department)}
                              className="h-8 w-8"
                              disabled={isMutating}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingDepartment(department)}
                              className="h-8 w-8 hover:text-destructive"
                              disabled={isMutating}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Department Count Badge */}
            <div className="flex items-center justify-between pt-2">
              <Badge variant="secondary">
                Total Departments: {departments.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Delete Department Confirmation Dialog */}
      <AlertDialog
        open={!!deletingDepartment}
        onOpenChange={(open) => !open && setDeletingDepartment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingDepartment?.name}"? This
              action cannot be undone and may affect existing job postings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DepartmentConfigPage;
